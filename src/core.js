import { EngineAttributes, cache } from "./constants";
import { setNestedLevel } from "./helper";
import { renderConditions } from "./renderers/condition";
import { renderBinds } from "./renderers/bind";
import { renderRepeats } from "./renderers/repeat";
import { renderEvents } from "./renderers/event";
import { makeAttr } from "./utils";
import { $setStore } from ".";

export const refactorDOM = () => {
  const _cache = document.body.cloneNode(true);
  const selectorString = Object.values(EngineAttributes)
    .map((attr) => `[${attr}]`)
    .join(", ");
  const domElements = document.querySelectorAll(selectorString);
  const vnElements = _cache.querySelectorAll(selectorString);

  const engineAttrList = Object.values(EngineAttributes);

  domElements.forEach((domEl, idx) => {
    const attributes = Array.from(domEl.attributes);
    attributes.forEach((attr, attrIdx) => {
      if (engineAttrList.includes(attr.name)) {
        const randomId = crypto
          .getRandomValues(new Uint8Array(8))
          .map((b) => b.toString(36).padStart(2, "0"))
          .join("")
          .slice(0, 8);

        // Set the original attribute on cloned node
        domEl.setAttribute(attr.name, attr.value);
        domEl.setAttribute(makeAttr("target"), idx);

        // Remove original attribute from live DOM
        // domEl.removeAttribute(attr.name);

        // Set a new random ID attribute (e.g., data-vn-abc123)
        vnElements[idx].setAttribute(makeAttr("id"), idx);
        if (attr.name === EngineAttributes.REPEAT) {
          const level = setNestedLevel(
            vnElements[idx],
            attr.name,
            EngineAttributes.NESTED_LEVEL
          );
          domEl.setAttribute(EngineAttributes.NESTED_LEVEL, level);
        }
      }
    });
  });

  unwrapTemplates();
  cache.template = _cache;
};

export function unwrapTemplates(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      return node.tagName === "TEMPLATE"
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  });

  const templates = [];
  let node;
  while ((node = walker.nextNode())) {
    templates.push(node);
  }

  templates.forEach((template) => {
    const parent = template.parentNode;
    if (!parent) return;

    // Recursively unwrap inside the template first
    unwrapTemplates(template.content);

    // Move the content into a fragment
    const fragment = document.createDocumentFragment();
    fragment.appendChild(template.content.cloneNode(true));

    parent.replaceChild(fragment, template);
  });
}

export const updateDOMValues = (stateName) => {
  const conditionals = cache.template.querySelectorAll(
    `[${EngineAttributes.IF}], [${EngineAttributes.CONDITION}]`
  );
  renderConditions(conditionals);

  const elements = document.querySelectorAll(
    `[${EngineAttributes.BIND}^="${stateName}."]`
  );
  renderBinds(elements);

  const repeatElements = document.querySelectorAll(
    `[${EngineAttributes.REPEAT}^="${stateName}."]`
  );
  renderRepeats(repeatElements);

  const eventElements = document.querySelectorAll(
    `[${EngineAttributes.EVENT}]`
  );
  renderEvents(eventElements);
};

export function reRenderDOM(root, skip = null) {
  const binds = [];
  const conditions = [];
  const repeats = [];

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (skip && node.hasAttribute(skip)) {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    },
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    if (node.hasAttribute(EngineAttributes.BIND)) {
      binds.push(node);
    } else if (node.hasAttribute(EngineAttributes.CONDITION)) {
      conditions.push(node);
    } else if (node.hasAttribute(EngineAttributes.REPEAT)) {
      repeats.push(node);
    }
  }

  if (conditions.length) renderConditions(conditions);
  if (binds.length) renderBinds(binds);
  if (repeats.length) renderRepeats(repeats);
}

export function initStore() {
  try {
    const existingStore = sessionStorage.getItem("store");

    if (!existingStore) {
      console.warn("No store found in sessionStorage.");
      return;
    }

    const parsedStore = JSON.parse(existingStore);

    if (typeof parsedStore !== "object" || parsedStore === null) {
      console.error("Invalid store format in sessionStorage.");
      return;
    }

    // Push all keys into appStores and appStates
    for (const [key, value] of Object.entries(parsedStore)) {
      $setStore(key, value);
    }
  } catch (e) {
    console.error("Failed to initialize store:", e);
  }
}
