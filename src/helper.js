import { EngineAttributes } from "./constants";
export function parseEventQuery(query) {
  const result = [];

  const pairs = query.split(';').map(pair => pair.trim()).filter(Boolean);

  for (const pair of pairs) {
    const [event, funcCall] = pair.split(':');
    if (!event || !funcCall) continue;

    const match = funcCall.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\((.*)\)$/);
    if (!match) continue;

    const funcName = match[1].trim();
    const paramString = match[2].trim();

    const params = [];
    let current = '';
    let inString = false;
    let quoteChar = '';

    for (let i = 0; i < paramString.length; i++) {
      const char = paramString[i];

      if (inString) {
        if (char === quoteChar) {
          inString = false;
        }
        current += char;
      } else {
        if (char === '\'' || char === '"') {
          inString = true;
          quoteChar = char;
          current += char;
        } else if (char === ',') {
          params.push(cleanParam(current.trim()));
          current = '';
        } else {
          current += char;
        }
      }
    }

    if (current.trim()) {
      params.push(cleanParam(current.trim()));
    }

    result.push({
      event: event.trim(),
      funcName: funcName,
      params: params
    });
  }

  return result;

  function cleanParam(str) {
    // Trim quotes if they exist
    if ((str.startsWith("'") && str.endsWith("'")) || (str.startsWith('"') && str.endsWith('"'))) {
      return str.slice(1, -1);
    }

    // Try converting to number if it's a pure number
    if (!isNaN(str) && str.trim() !== '') {
      return Number(str);
    }

    // Otherwise, return as-is (like {state.name})
    return str;
  }
}

export function setNestedLevel(node, repeatAttr = 'data-repeat', levelAttr = 'data-repeat-level') {

  let parent = node.parentElement;
  let level = 0;

  while (parent) {
    if (parent.hasAttribute(repeatAttr)) {
      level++;
    }
    parent = parent.parentElement;
  }

  node.setAttribute(levelAttr, level.toString());
  return level;
}

export function evaluateCondition(expression, state) {
  if (state) {
    try {
      // Replace all {variable} with real values from state
      const populatedExpr = expression.replace(/\{(.*?)\}/g, (_, path) => {
        const value = getValueByPath(state, path.trim());

        // If value is string, wrap with quotes
        if (typeof value === 'string') {
          return `'${value}'`;
        } else if (typeof value === 'object') {
          return JSON.stringify(value); // or throw error
        } else {
          return value;
        }
      });


      return Function(`return (${populatedExpr});`)();
    } catch (e) {
      console.warn("Failed to evaluate condition:", expression, e);
      return false;
    }

  }
};

export function generateRandomID(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, x => chars[x % chars.length]).join('');
}

export function removeCurlyBraces(str) {
  str = str.trim(); // remove any surrounding whitespace

  if (str.startsWith("{") && str.endsWith("}")) {
    return str.slice(1, -1);
  }

  return str;
}

export function getValueByPath(obj, path) {
  const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1'); // arr[2] -> arr.2
  const keys = normalizedPath.split('.');
  let current = obj;

  for (let key of keys) {
    if (current === undefined || current === null) {
      return undefined; // path not found
    }
    current = current[key];
  }
  return current;
}


