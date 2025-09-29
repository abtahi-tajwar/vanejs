import { EngineAttributes } from "../constants";
import { getValueByPath } from '../helper'
import { appStates } from "../constants";

export const renderBinds = (elements) => {
  elements.forEach((el) => {
    let key = el.getAttribute(EngineAttributes.BIND);
    let value = "";

    if (!key) return;

    // Check if key has { ... } expressions
    const regex = /\{([^}]+)\}/g;
    let match;
    let result = key;
    console.log("*&(@H(N))", key, result);
    while ((match = regex.exec(key)) !== null) {
      const path = match[1].trim(); // the stuff inside { }
      const resolved = appStates ? getValueByPath(appStates, path) : "";
      result = result.replace(match[0], resolved ?? "");
    }

    // If no braces were used, just resolve normally
    if (!key.includes("{")) {
      value = appStates ? getValueByPath(appStates, key) : "";
    } else {
      value = result;
    }

    el.innerText = value;
  });
};

