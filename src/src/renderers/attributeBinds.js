import { EngineAttributes } from "../constants";
import { getValueByPath } from "../helper";
import { appStates } from "../constants";

export const renderAttributeBinds = (elements) => {
  elements.forEach((el) => {
    const raw = el.getAttribute(EngineAttributes.ATTRIBUTE_BIND);
    if (!raw) return;

    // support multiple pairs separated by ; or ,
    const pairs = raw.split(/;|,/).map(s => s.trim()).filter(Boolean);

    pairs.forEach((pair) => {
      const eqIdx = pair.indexOf('=');
      if (eqIdx === -1) {
        console.log("raw", raw);
        throw new Error(
          'Syntax error in Attribute Bind. Example: data-vn-attr-bind="href=data.profile.github"'
        );
      }

      const attr = pair.slice(0, eqIdx).trim();
      let pathOrTemplate = pair.slice(eqIdx + 1).trim();

      let finalValue = null;

      // Case 1: direct path (no { } )
      if (!pathOrTemplate.includes("{")) {
        finalValue = appStates ? getValueByPath(appStates, pathOrTemplate) : null;
      } 
      // Case 2: template string with { ... }
      else {
        finalValue = pathOrTemplate.replace(/\{([^}]+)\}/g, (_, path) => {
          const val = appStates ? getValueByPath(appStates, path.trim()) : "";
          return val == null ? "" : String(val);
        });
      }

      // Handle null/undefined/false by removing the attribute
      if (finalValue === null || finalValue === undefined || finalValue === false) {
        el.removeAttribute(attr);
        return;
      }

      // Boolean attributes (disabled, required, etc.)
      const booleanAttrs = new Set([
        "disabled", "required", "readonly", "checked", "hidden", "autofocus"
      ]);
      if (booleanAttrs.has(attr) && (finalValue === true || finalValue === "true")) {
        el.setAttribute(attr, "");
        return;
      }

      el.setAttribute(attr, String(finalValue));
    });
  });
};
