const getStateEventName = (state) => `state_event_${state}`


const templateEngineStates = new Proxy({}, {
  get(target, prop) {
    console.log(`Accessing ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`Setting ${prop}`);
    target[prop] = value;
    // Here you can trigger re-renders if you build UI binding
    return true;
  }
});

/** State functions **/

function $setState(name, obj) {
  templateEngineStates[name] = obj;
  updateDOMValues(name)

}

function $getState(name) {
  const state = templateEngineStates[name];
  return state;
}

// function $updateState(name, obj) {
//   const updated = obj;
//   templateEngineStates[name] = updated;
//   updateDOMValues(name)
//   return updated
// }

function $deleteState(name) {
  delete templateEngineStates[name];
  updateDOMValues(null)
}

const updateDOMValues = (stateName) => {
  const conditionals = document.querySelectorAll("[data-if], [data-condition]")
  renderConditions(conditionals)
  const elements = document.querySelectorAll(`[data-bind^="${stateName}."]`);
  renderBinds(elements);
  const repeatElements = document.querySelectorAll(`[data-repeat^="${stateName}."]`)
  renderRepeats(stateName, repeatElements);
}

const renderBinds = (elements) => {
  elements.forEach(el => {
    let key;
    key = el.dataset.bind;
    const value = templateEngineStates ? getValueByPath(templateEngineStates, key) : null;
    el.innerHTML = value;
  })
}


function renderRepeats(state, elements, parentPointer = null, parentPointerPath = null) {
  elements.forEach(el => {
    const query = el.dataset.repeat.split(" ");
    if (query.length !== 3) throw new Error(`data-repeat format error at ${state}, please write format like data-repeat="state.example in item"`)
    let [path, _, pointer] = query;
    if (parentPointer && parentPointerPath && path.includes(`{${parentPointer}}`)) {
      path = path.replace(`{${parentPointer}}`, `${parentPointerPath}`)
    }
    const template = document.createElement("template")
    template.content.appendChild(Array.from(el.children).find(c => c.tagName === "TEMPLATE")?.content.cloneNode(true));
    const bindNodes = template.content.querySelectorAll("[data-bind]")
    renderBinds(bindNodes);


    el.innerHTML = "";
    if (!template) throw new Error("Please define a <template></template> inside your data repeat")
    const arrVal = getValueByPath(templateEngineStates, path) ?? [];
    for (let i = 0; i < arrVal.length; i++) {
      const itemDOM = template.content.cloneNode(true);

      const repeatNodes = itemDOM.querySelectorAll("[data-repeat]");
      renderRepeats(state, repeatNodes, pointer, `${path}[${i}]`)

      itemDOM.querySelectorAll("[data-repeat]").forEach(item => item.removeAttribute('data-repeat'))
      const rItems = itemDOM.querySelectorAll(`[data-ritem^="{${pointer}}"]`)

      rItems.forEach((item) => {
        let key = item.dataset.ritem;
        const absolutepath = key.replace(`{${pointer}}`, `${path}[${i}]`)
        const value = templateEngineStates ? getValueByPath(templateEngineStates, absolutepath) : null;
        item.innerHTML = value;
      })
      el.appendChild(itemDOM);

    }
    template.style.display = "none";
    el.appendChild(template);
  })
}

function renderConditions(elements) {
  elements.forEach(el => console.log("Outer html", el.outerHTML))
  elements.forEach(el => {
    if (el.hasAttribute("data-condition")) {
      const children = Array.from(el.children)
    } else {
      const result = evaluateCondition(el.dataset.if, templateEngineStates);
      console.log("Evaluation result", result);
      if (!result) el.remove();
      else {
        const template = Array.from(el.children).find(c => c.tagName === "TEMPLATE");
        el.appendChild(template.content);
        template.remove();
      }
    }

  })
}

// function getValueByPath(obj, path) {
//   const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1'); // arr[2] → arr.2
//   return normalizedPath.split('.').reduce((acc, key) => acc?.[key], obj);
// }

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
