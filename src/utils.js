import { EngineAttributes } from "./constants";
import { prefix } from "./config";

export function getTargetDOM(dom, id) {
  return dom.querySelector(`[${EngineAttributes.ID}="${id}"]`);
}

export function makeAttr(name) {
  return prefix ? `data-${prefix}-${name}` : `data-${name}`;
}
