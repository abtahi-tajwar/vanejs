import { cache } from "../constants";
import { EngineAttributes } from "../constants";
import { evaluateCondition } from "../helper";
import { appStates } from "../constants";
import { getTargetDOM } from "../utils";
import { reRenderDOM } from "../core";

export function renderConditions(elements) {
  // To be implemented
  elements.forEach((el) => {
    if (
      el.hasAttribute(EngineAttributes.IF) &&
      !el.parentNode.hasAttribute(EngineAttributes.CONDITION)
    ) {
      const domEl = document.querySelector(
        `[${EngineAttributes.TARGET}="${el.getAttribute(EngineAttributes.ID)}"]`
      );
      if (!domEl) return;
      const alreadyRemoved = domEl.hasAttribute(
        EngineAttributes.CONDITION_REMNANT
      );

      const condition = el.getAttribute(EngineAttributes.IF);
      const result = evaluateCondition(condition, appStates);

      if (result && alreadyRemoved) {
        reAddConditionItem(domEl);
      } else if (!result && !alreadyRemoved) {
        removeConditionItem(domEl);
      }
    } else if (el.hasAttribute(EngineAttributes.CONDITION)) {
      let foundTrue = false;

      Array.from(el.children).forEach((block) => {
        if (
          block.hasAttribute(EngineAttributes.IF) ||
          block.hasAttribute(EngineAttributes.ELSEIF) ||
          block.hasAttribute(EngineAttributes.ELSE)
        ) {
          const domEl = document.querySelector(
            `[${EngineAttributes.TARGET}="${block.getAttribute(
              EngineAttributes.ID
            )}"]`
          );
          if (!domEl) return;
          const alreadyRemoved = domEl.hasAttribute(
            EngineAttributes.CONDITION_REMNANT
          );

          if (block.hasAttribute(EngineAttributes.IF)) {
            const condition = block.getAttribute(EngineAttributes.IF);
            const result = evaluateCondition(condition, appStates);
            foundTrue = result;

            if (result && alreadyRemoved) {
              reAddConditionItem(domEl);
            } else if (!result && !alreadyRemoved) {
              removeConditionItem(domEl);
            }
          } else if (block.hasAttribute(EngineAttributes.ELSEIF)) {
            const condition = block.getAttribute(EngineAttributes.ELSEIF);
            const result = evaluateCondition(condition, appStates);

            if (!foundTrue) {
              if (result && alreadyRemoved) {
                reAddConditionItem(domEl);
                foundTrue = true;
              } else if (!result && !alreadyRemoved) {
                removeConditionItem(domEl);
              }
            } else {
              if (!alreadyRemoved) {
                removeConditionItem(domEl);
              }
            }
          } else {
            if (!foundTrue && alreadyRemoved) {
              reAddConditionItem(domEl);
            } else if (foundTrue && !alreadyRemoved) {
              removeConditionItem(domEl);
            }
          }
        }
      });
    }
  });
}

export function removeConditionItem(dom) {
  const remnant = document.createElement("div");
  remnant.setAttribute(EngineAttributes.CONDITION_REMNANT, null);
  remnant.setAttribute(
    EngineAttributes.TARGET,
    dom.getAttribute(EngineAttributes.TARGET)
  );
  dom.parentNode.replaceChild(remnant, dom);
}
export function reAddConditionItem(dom) {
  const targetId = dom.getAttribute(EngineAttributes.TARGET);
  const cacheDOM = getTargetDOM(cache.template, targetId);
  const cloned = cacheDOM.cloneNode(true);
  cloned.setAttribute(EngineAttributes.TARGET, targetId);
  // Recursively update all children
  const descendants = cloned.querySelectorAll(`[${EngineAttributes.ID}]`);
  descendants.forEach((child) => {
    const id = child.getAttribute(EngineAttributes.ID);
    child.setAttribute(EngineAttributes.TARGET, id);
    child.removeAttribute(EngineAttributes.ID);
  });
  cloned.removeAttribute(EngineAttributes.ID);
  reRenderDOM(cloned);
  dom.parentNode.replaceChild(cloned, dom);
}
