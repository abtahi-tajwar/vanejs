import { EngineAttributes } from "../constants";
import { getValueByPath } from '../helper'
import { appStates } from "../constants";

export const renderBinds = (elements) => {
  elements.forEach(el => {
    let key;
    key = el.getAttribute(EngineAttributes.BIND);
    const value = appStates ? getValueByPath(appStates, key) : null;
    el.innerText = value;
  })
}

