import { EngineAttributes } from "../constants";
import { getValueByPath } from "../helper";
import { appStates, cache } from "../constants";
import { getTargetDOM } from "../utils";
import { reRenderDOM } from "../core";

export function renderRepeats(
  elements,
  parentPointer = null,
  parentPointerPath = null,
  level = 0
) {
  elements.forEach((el) => {
    const eLevel = el.getAttribute(`${EngineAttributes.NESTED_LEVEL}`);
    if (parseInt(eLevel) != level) {
      return;
    }
    const query = el.getAttribute(`${EngineAttributes.REPEAT}`);
    let [path, _, pointer] = query.split(" ");
    if (!path || !pointer)
      throw new Error(
        `data-repeat format error at ${state}, please write format like data-repeat="state.example in item"`
      );
    if (
      parentPointer &&
      parentPointerPath &&
      path.includes(`{${parentPointer}}`)
    ) {
      path = path.replace(`{${parentPointer}}`, `${parentPointerPath}`);
    }
    const stateValue = getValueByPath(appStates, path);
    if (!Array.isArray(stateValue))
      throw new Error(
        "data-repeat state is not a valid array, data-repeat only accepts array"
      );
    const cacheTarget = el.getAttribute(`${EngineAttributes.TARGET}`);
    const cacheDOM = getTargetDOM(cache.template, cacheTarget);

    if (level === 0) {
      el.innerHTML = cacheDOM.innerHTML;
      el.querySelectorAll(`[${EngineAttributes.ID}]`).forEach((item) => {
        const id = item.getAttribute(EngineAttributes.ID);
        item.setAttribute(EngineAttributes.TARGET, id);
        item.removeAttribute(EngineAttributes.ID);
      });
    }

    let resultHTML = "";
    stateValue.forEach((val, idx) => {
      const nestedRepeats = el.querySelectorAll(`[${EngineAttributes.REPEAT}]`);
      if (nestedRepeats.length)
        renderRepeats(nestedRepeats, pointer, `${path}[${idx}]`, level + 1);
      const cacheDOMClone = cacheDOM.cloneNode(true);

      // reRenderDOM(el.children, EngineAttributes.REPEAT);
      reRenderDOM(el, EngineAttributes.REPEAT);
      const rItems = el.querySelectorAll(`[${EngineAttributes.REPEAT_ITEM}]`);
      let alreadyAddedTargets = [];

      rItems.forEach((item) => {
        if (
          !item
            .getAttribute(EngineAttributes.REPEAT_ITEM)
            .includes(`{${pointer}}`)
        )
          return;
        const target = item.getAttribute(EngineAttributes.TARGET);
        if (alreadyAddedTargets.includes(target)) {
          item.parentNode.removeChild(item);
          return;
        } else {
          alreadyAddedTargets.push(target);
        }
        let key = item.getAttribute(EngineAttributes.REPEAT_ITEM);
        const absolutepath = key.replace(`{${pointer}}`, `${path}[${idx}]`);
        const value = appStates
          ? getValueByPath(appStates, absolutepath)
          : null;
        item.innerText = value;
      });
      resultHTML += el.innerHTML;
    });
    el.innerHTML = resultHTML;
  });
}
