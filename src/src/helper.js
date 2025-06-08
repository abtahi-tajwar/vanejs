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

