import { EngineAttributes, appStates, cache } from "../constants";
import { getValueByPath } from "../helper";
import { getTargetDOM } from "../utils";
import { reRenderDOM } from "../core";
import { renderAttributeBinds } from "./attributeBinds";

export function renderRepeats(elements, parentPointer = null, parentPointerPath = null, level = 0) {
  elements.forEach((el) => {
    const eLevel = el.getAttribute(`${EngineAttributes.NESTED_LEVEL}`);
    if (parseInt(eLevel) !== level) return;

    let query = el.getAttribute(`${EngineAttributes.REPEAT}`);
    const [rawPath, , pointer] = query.split(" ");
    if (!rawPath || !pointer) throw new Error("data-repeat format error, use data-repeat=\"state.items as item\"");

    if (parentPointer && parentPointerPath && rawPath.includes(`{${parentPointer}}`)) {
      query = query.replace(`{${parentPointer}}`, `${parentPointerPath}`);
    }
    const path = query.split(" ")[0];

    const stateValue = getValueByPath(appStates, path);
    if (!Array.isArray(stateValue)) throw new Error("data-repeat only accepts arrays");

    const cacheTarget = el.getAttribute(`${EngineAttributes.TARGET}`);
    const cacheDOM = getTargetDOM(cache.template, cacheTarget);

    let resultHTML = "";

    stateValue.forEach((val, idx) => {
      // work on a per-item clone
      const instance = cacheDOM.cloneNode(true);

      // convert cached IDs to TARGETs
      instance.querySelectorAll(`[${EngineAttributes.ID}]`).forEach((node) => {
        const id = node.getAttribute(EngineAttributes.ID);
        node.setAttribute(EngineAttributes.TARGET, id);
        node.removeAttribute(EngineAttributes.ID);
      });

      // nested repeats only inside the instance
      const nestedRepeats = instance.querySelectorAll(`[${EngineAttributes.REPEAT}]`);
      if (nestedRepeats.length) {
        renderRepeats(nestedRepeats, pointer, `${path}[${idx}]`, level + 1);
      }

      // run binds/attrs in the instance only
      reRenderDOM(instance, EngineAttributes.REPEAT);

      // fill repeat items
      const rItems = instance.querySelectorAll(`[${EngineAttributes.REPEAT_ITEM}]`);
      rItems.forEach((item) => {
        const spec = item.getAttribute(EngineAttributes.REPEAT_ITEM);
        if (!spec || !spec.includes(`{${pointer}}`)) return;
        const absolute = spec.replace(`{${pointer}}`, `${path}[${idx}]`);
        const value = appStates ? getValueByPath(appStates, absolute) : null;
        item.innerText = value;
      });

      // fill repeat attribute binds
      const rAttrs = instance.querySelectorAll(`[${EngineAttributes.REPEAT_ATTRIBUTE}]`);
      rAttrs.forEach((item) => {
        const spec = item.getAttribute(EngineAttributes.REPEAT_ATTRIBUTE);
        if (!spec || !spec.includes(`{${pointer}}`)) return;
        const absolute = spec.replace(`{${pointer}}`, `${path}[${idx}]`);
        item.setAttribute(EngineAttributes.ATTRIBUTE_BIND, absolute);
        renderAttributeBinds([item]);
      });

      resultHTML += instance.innerHTML;
    });

    el.innerHTML = resultHTML;
  });
}
