import { parseEventQuery } from "./helper";

let prefix = 'vn'; // or '' for no prefix

function makeAttr(name) {
  return prefix ? `data-${prefix}-${name}` : `data-${name}`;
}

const EngineAttributes = {
  IF: makeAttr('if'),
  ELSEIF: makeAttr('elseif'),
  ELSE: makeAttr('else'),
  CONDITION: makeAttr('condition'),
  BIND: makeAttr('bind'),
  REPEAT: makeAttr('repeat'),
  REPEAT_ITEM: makeAttr('ritem'),
  NESTED_LEVEL: makeAttr('nested-level'),
  ID: makeAttr('id'),
  TARGET: makeAttr('target'),
  CONDITION_REMNANT: makeAttr('cond-remnant'),
  EVENT: makeAttr('on'),
  EVENT_TARGET: makeAttr('event-target')
};

const EventFunctions = new Proxy({}, {
  get(target, prop) {
    // console.log(`Accessing ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    // console.log(`Setting ${prop}`);
    target[prop] = value;
    // Here you can trigger re-renders if you build UI binding
    return true;
  }
});

const EventTargets = new Proxy({}, {
  get(target, prop) {
    // console.log(`Accessing ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    // console.log(`Setting ${prop}`);
    target[prop] = value;
    // Here you can trigger re-renders if you build UI binding
    return true;
  }
});

const appStates = new Proxy({}, {
  get(target, prop) {
    // console.log(`Accessing ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    // console.log(`Setting ${prop}`);
    target[prop] = value;
    // Here you can trigger re-renders if you build UI binding
    return true;
  }
});

const appStores = new Proxy({}, {
  get(target, prop) {
    // console.log(`Accessing ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    // console.log(`Setting ${prop}`);
    target[prop] = value;
    // Here you can trigger re-renders if you build UI binding
    return true;
  }

})
let templateCache = null;

export function $setState(name, obj) {
  appStates[name] = obj;
  updateDOMValues(name);
}

export function $getState(name) {
  return appStates[name];
}

export function $deleteState(name) {
  delete appStates[name]; // <--- was wrong before, fixed: it should be `appStates`, not `templateEngineStates`
  updateDOMValues(null);
}

export function $setStore(name, obj) {
  appStores[name] = obj;
  appStates[name] = obj;

  const existingStore = sessionStorage.getItem("store");
  if (!existingStore) {
    sessionStorage.setItem("store", JSON.stringify({
      [name]: obj
    }));
  } else {
    const existing = JSON.parse(existingStore);
    existing[name] = obj;
    sessionStorage.setItem("store", JSON.stringify(existing));
  }
  updateDOMValues(name)
}
export function $getStore(name) {
  try {
    const store = JSON.parse(sessionStorage.getItem("store") || "{}");
    return store[name] !== undefined ? store[name] : null;
  } catch (e) {
    console.error("Failed to parse store:", e);
    return null;
  }
}
export function $event(name, func) {
  EventFunctions[name] = func;
}
export function initStore() {
  try {
    const existingStore = sessionStorage.getItem("store");

    if (!existingStore) {
      console.warn("No store found in sessionStorage.");
      return;
    }

    const parsedStore = JSON.parse(existingStore);

    if (typeof parsedStore !== 'object' || parsedStore === null) {
      console.error("Invalid store format in sessionStorage.");
      return;
    }

    // Push all keys into appStores and appStates
    for (const [key, value] of Object.entries(parsedStore)) {
      $setStore(key, value)
    }


  } catch (e) {
    console.error("Failed to initialize store:", e);
  }
}
const refactorDOM = () => {
  const _cache = document.body.cloneNode(true);
  const selectorString = Object.values(EngineAttributes)
    .map(attr => `[${attr}]`)
    .join(', ');
  const domElements = document.querySelectorAll(selectorString);
  const vnElements = _cache.querySelectorAll(selectorString);

  const engineAttrList = Object.values(EngineAttributes);

  domElements.forEach((domEl, idx) => {
    const attributes = Array.from(domEl.attributes);
    attributes.forEach((attr, attrIdx) => {
      if (engineAttrList.includes(attr.name)) {
        const randomId = crypto.getRandomValues(new Uint8Array(8))
          .map(b => b.toString(36).padStart(2, '0'))
          .join('')
          .slice(0, 8);

        // Set the original attribute on cloned node
        domEl.setAttribute(attr.name, attr.value);
        domEl.setAttribute(makeAttr("target"), idx)

        // Remove original attribute from live DOM
        // domEl.removeAttribute(attr.name);

        // Set a new random ID attribute (e.g., data-vn-abc123)
        vnElements[idx].setAttribute(makeAttr("id"), idx);
        if (attr.name === EngineAttributes.REPEAT) {
          const level = setNestedLevel(vnElements[idx], attr.name, EngineAttributes.NESTED_LEVEL)
          domEl.setAttribute(EngineAttributes.NESTED_LEVEL, level)
        }

      }
    });
  });

  unwrapTemplates();
  templateCache = _cache;
};

function unwrapTemplates(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      return node.tagName === 'TEMPLATE' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });

  const templates = [];
  let node;
  while ((node = walker.nextNode())) {
    templates.push(node);
  }

  templates.forEach(template => {
    const parent = template.parentNode;
    if (!parent) return;

    // Recursively unwrap inside the template first
    unwrapTemplates(template.content);

    // Move the content into a fragment
    const fragment = document.createDocumentFragment();
    fragment.appendChild(template.content.cloneNode(true));

    parent.replaceChild(fragment, template);
  });
}

const updateDOMValues = (stateName) => {
  const conditionals = templateCache.querySelectorAll(
    `[${EngineAttributes.IF}], [${EngineAttributes.CONDITION}]`
  );
  renderConditions(conditionals);

  const elements = document.querySelectorAll(
    `[${EngineAttributes.BIND}^="${stateName}."]`
  );
  renderBinds(elements);

  const repeatElements = document.querySelectorAll(
    `[${EngineAttributes.REPEAT}^="${stateName}."]`
  );
  renderRepeats(repeatElements);

  const eventElements = document.querySelectorAll(
    `[${EngineAttributes.EVENT}]`
  )
  renderEvents(eventElements);
};

// const reRenderDOM = (htmlCollection, skip = null) => {
//   const binds = [];
//   const conditions = [];
//   const repeats = [];
//   for (elem of htmlCollection) {
//     const attrs = Array.from(elem.attributes);
//     if (!elem.hasAttribute(skip)) {
//       if (elem.hasAttribute(EngineAttributes.BIND)) {
//         binds.push(elem);
//       } else if (elem.hasAttribute(EngineAttributes.CONDITION)) {
//         conditions.push(elem)
//       } else if (elem.hasAttribute(EngineAttributes.REPEAT)) {
//         repeats.push(elem);
//       }
//     }
//   }
//
//   if (conditions.length) renderConditions(conditions);
//   if (binds.length) renderBinds(binds)
//   if (repeats.length) renderRepeats(repeats);
//
// }

function reRenderDOM(root, skip = null) {
  const binds = [];
  const conditions = [];
  const repeats = [];

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (skip && node.hasAttribute(skip)) {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    },
    false
  );

  let node;
  while (node = walker.nextNode()) {
    if (node.hasAttribute(EngineAttributes.BIND)) {
      binds.push(node);
    } else if (node.hasAttribute(EngineAttributes.CONDITION)) {
      conditions.push(node);
    } else if (node.hasAttribute(EngineAttributes.REPEAT)) {
      repeats.push(node);
    }
  }

  if (conditions.length) renderConditions(conditions);
  if (binds.length) renderBinds(binds);
  if (repeats.length) renderRepeats(repeats);
}


function renderConditions(elements) {
  // To be implemented
  elements.forEach(el => {
    if (el.hasAttribute(EngineAttributes.IF) && !el.parentNode.hasAttribute(EngineAttributes.CONDITION)) {
      const domEl = document.querySelector(`[${EngineAttributes.TARGET}="${el.getAttribute(EngineAttributes.ID)}"]`)
      if (!domEl) return;
      const alreadyRemoved = domEl.hasAttribute(EngineAttributes.CONDITION_REMNANT);

      const condition = el.getAttribute(EngineAttributes.IF);
      const result = evaluateCondition(condition, appStates);

      if (result && alreadyRemoved) {
        reAddConditionItem(domEl)
      } else if (!result && !alreadyRemoved) {
        removeConditionItem(domEl)
      }
    } else if (el.hasAttribute(EngineAttributes.CONDITION)) {
      let foundTrue = false;

      Array.from(el.children).forEach(block => {
        if (block.hasAttribute(EngineAttributes.IF) || block.hasAttribute(EngineAttributes.ELSEIF) || block.hasAttribute(EngineAttributes.ELSE)) {
          const domEl = document.querySelector(`[${EngineAttributes.TARGET}="${block.getAttribute(EngineAttributes.ID)}"]`)
          if (!domEl) return;
          const alreadyRemoved = domEl.hasAttribute(EngineAttributes.CONDITION_REMNANT);

          if (block.hasAttribute(EngineAttributes.IF)) {
            const condition = block.getAttribute(EngineAttributes.IF);
            const result = evaluateCondition(condition, appStates);
            foundTrue = result;

            if (result && alreadyRemoved) {
              reAddConditionItem(domEl)
            } else if (!result && !alreadyRemoved) {
              removeConditionItem(domEl)
            }
          }
          else if (block.hasAttribute(EngineAttributes.ELSEIF)) {
            const condition = block.getAttribute(EngineAttributes.ELSEIF);
            const result = evaluateCondition(condition, appStates);

            if (!foundTrue) {
              if (result && alreadyRemoved) {
                reAddConditionItem(domEl)
                foundTrue = true
              } else if (!result && !alreadyRemoved) {
                removeConditionItem(domEl)
              }
            }
            else {
              if (!alreadyRemoved) {
                removeConditionItem(domEl)
              }
            }
          }
          else {
            if (!foundTrue && alreadyRemoved) {
              reAddConditionItem(domEl)
            } else if (foundTrue && !alreadyRemoved) {
              removeConditionItem(domEl)
            }
          }

        }
      })
    }
  })
}

function removeConditionItem(dom) {
  const remnant = document.createElement("div");
  remnant.setAttribute(EngineAttributes.CONDITION_REMNANT, null)
  remnant.setAttribute(EngineAttributes.TARGET, dom.getAttribute(EngineAttributes.TARGET))
  dom.parentNode.replaceChild(remnant, dom);

}
function reAddConditionItem(dom) {
  const targetId = dom.getAttribute(EngineAttributes.TARGET);
  const cacheDOM = getTargetDOM(templateCache, targetId)
  const cloned = cacheDOM.cloneNode(true);
  cloned.setAttribute(EngineAttributes.TARGET, targetId)
  // Recursively update all children
  const descendants = cloned.querySelectorAll(`[${EngineAttributes.ID}]`);
  descendants.forEach(child => {
    const id = child.getAttribute(EngineAttributes.ID);
    child.setAttribute(EngineAttributes.TARGET, id);
    child.removeAttribute(EngineAttributes.ID);
  }); cloned.removeAttribute(EngineAttributes.ID)
  reRenderDOM(cloned)
  dom.parentNode.replaceChild(cloned, dom)

}

const renderBinds = (elements) => {
  elements.forEach(el => {
    let key;
    key = el.getAttribute(EngineAttributes.BIND);
    const value = appStates ? getValueByPath(appStates, key) : null;
    el.innerText = value;
  })
}

function renderRepeats(elements, parentPointer = null, parentPointerPath = null, level = 0) {
  elements.forEach(el => {
    const eLevel = el.getAttribute(`${EngineAttributes.NESTED_LEVEL}`)
    if (parseInt(eLevel) != level) {
      return;
    }
    const query = el.getAttribute(`${EngineAttributes.REPEAT}`)
    let [path, _, pointer] = query.split(" ");
    if (!path || !pointer) throw new Error(`data-repeat format error at ${state}, please write format like data-repeat="state.example in item"`)
    if (parentPointer && parentPointerPath && path.includes(`{${parentPointer}}`)) {
      path = path.replace(`{${parentPointer}}`, `${parentPointerPath}`)
    }
    const stateValue = getValueByPath(appStates, path);
    if (!Array.isArray(stateValue)) throw new Error("data-repeat state is not a valid array, data-repeat only accepts array")
    const cacheTarget = el.getAttribute(`${EngineAttributes.TARGET}`)
    const cacheDOM = getTargetDOM(templateCache, cacheTarget)

    if (level === 0) {
      el.innerHTML = cacheDOM.innerHTML;
      el.querySelectorAll(`[${EngineAttributes.ID}]`).forEach(item => {
        const id = item.getAttribute(EngineAttributes.ID);
        item.setAttribute(EngineAttributes.TARGET, id);
        item.removeAttribute(EngineAttributes.ID)
      })
    }

    let resultHTML = ''
    stateValue.forEach((val, idx) => {
      const nestedRepeats = el.querySelectorAll(`[${EngineAttributes.REPEAT}]`)
      if (nestedRepeats.length) renderRepeats(nestedRepeats, pointer, `${path}[${idx}]`, level + 1)
      const cacheDOMClone = cacheDOM.cloneNode(true)

      // reRenderDOM(el.children, EngineAttributes.REPEAT);
      reRenderDOM(el, EngineAttributes.REPEAT);
      const rItems = el.querySelectorAll(`[${EngineAttributes.REPEAT_ITEM}]`);
      let alreadyAddedTargets = [];

      rItems.forEach(item => {
        if (!item.getAttribute(EngineAttributes.REPEAT_ITEM).includes(`{${pointer}}`)) return;
        const target = item.getAttribute(EngineAttributes.TARGET);
        if (alreadyAddedTargets.includes(target)) {
          item.parentNode.removeChild(item);
          return;
        } else {
          alreadyAddedTargets.push(target);
        }
        let key = item.getAttribute(EngineAttributes.REPEAT_ITEM);
        const absolutepath = key.replace(`{${pointer}}`, `${path}[${idx}]`)
        const value = appStates ? getValueByPath(appStates, absolutepath) : null;
        item.innerText = value;

      })
      resultHTML += el.innerHTML
    })
    el.innerHTML = resultHTML;

  })
}
function renderEvents(elements) {
  elements.forEach(el => {
    if (!el.hasAttribute(EngineAttributes.EVENT_TARGET)) {
      const eventId = generateRandomID();
      el.setAttribute(EngineAttributes.EVENT_TARGET, eventId);
      const query = el.getAttribute(EngineAttributes.EVENT);
      const parsedQuery = parseEventQuery(query);
      console.log("Parsed query", parsedQuery);
      parsedQuery.forEach(qitem => {
        el.addEventListener(qitem.event, () => eventRootHandler(qitem))
      })
      EventTargets[eventId] =
      {
        click: () => eventRootHandler(eventId)
      }
      console.log("Event targetsl", EventTargets)

    }
  })
}

function eventRootHandler(query) {
  console.log("The query", query);
  const modified = query.params.map(p => {
    if (typeof p === "string" && p.startsWith('{') && p.endsWith('}')) {
      const path = removeCurlyBraces(p);
      return getValueByPath(appStates, path);
    }
    return p
  })
  console.log("Modified", modified)
  EventFunctions[query.funcName]({ params: modified });
}
// Helper functions
function getValueByPath(obj, path) {
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

function getTargetDOM(dom, id) {
  return dom.querySelector(`[${EngineAttributes.ID}="${id}"]`)
}



function setNestedLevel(node, repeatAttr = 'data-repeat', levelAttr = 'data-repeat-level') {

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

function evaluateCondition(expression, state) {
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

function generateRandomID(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, x => chars[x % chars.length]).join('');
}

function removeCurlyBraces(str) {
  str = str.trim(); // remove any surrounding whitespace

  if (str.startsWith("{") && str.endsWith("}")) {
    return str.slice(1, -1);
  }

  return str;
}



// Execution Layer
window.addEventListener('load', function() {
  refactorDOM();
  initStore();
  // reRenderDOM(this.document);
});


window.VaneJS = {
  $getState,
  $setState,
  $deleteState
}
