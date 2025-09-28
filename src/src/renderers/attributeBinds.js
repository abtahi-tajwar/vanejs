import { EngineAttributes } from "../constants";
import { getValueByPath } from '../helper'
import { appStates } from "../constants";

export const renderAttributeBinds = (elements) => {
  elements.forEach((el) => {
    const raw = el.getAttribute(EngineAttributes.ATTRIBUTE_BIND);
    if (!raw) return;

    // support multiple pairs separated by ; or ,
    const pairs = raw.split(/;|,/).map(s => s.trim()).filter(Boolean);

    pairs.forEach((pair) => {
      // split only on the first '=' to avoid breaking URLs with '='
      const eqIdx = pair.indexOf('=');
      if (eqIdx === -1) {
        console.log("raw", raw);
        throw new Error(
          'Syntax error in Attribute Bind. Example: data-vn-attr-bind="href=data.profile.github"'
        );
      }

      const attr = pair.slice(0, eqIdx).trim();          // e.g., "href"
      const path = pair.slice(eqIdx + 1).trim();         // e.g., "data.profile.github"

      // Resolve the value from appStates using your helper
      const val = appStates ? getValueByPath(appStates, path) : null;

      // Handle null/undefined/false by removing the attribute
      if (val === null || val === undefined || val === false) {
        el.removeAttribute(attr);
        return;
      }

      // Boolean attributes (e.g., disabled, required)
      // If val is true => set empty attribute; if string/number => set as string
      const booleanAttrs = new Set(['disabled', 'required', 'readonly', 'checked', 'hidden', 'autofocus']);
      if (booleanAttrs.has(attr) && (val === true || val === 'true')) {
        el.setAttribute(attr, '');
        return;
      }

      el.setAttribute(attr, String(val));
    });
  });
};

