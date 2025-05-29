const getStateEventName = (state) => `state_event_${state}`


let templateEngineStates = {}

/** State functions **/
function $setState(name, obj) {
  templateEngineStates[name] = obj;
  updateDOMValues(name)

}

function $getState(name) {
  const state = templateEngineStates[name];
  return state;
}

function $updateState(name, obj) {
  const updated = obj;
  templateEngineStates[name] = updated;
  updateDOMValues(name)
  return updated
}

function $deleteState(name) {
  delete templateEngineStates[name];
  updateDOMValues(null)
}

const updateDOMValues = (stateName, state) => {
  const elements = document.querySelectorAll(`[data-bind^="${stateName}."]`);
  populateTextValues(elements);
  const repeatElements = document.querySelectorAll(`[data-repeat^="${stateName}."]`)
  repeatElements.forEach(r => console.log("Root repeat", r))
  populateRepeatValues(stateName, repeatElements);
}

const populateTextValues = (elements) => {
  elements.forEach(el => {
    let key;
    key = el.dataset.bind;
    const value = templateEngineStates ? getValueByPath(templateEngineStates, key) : null;
    el.innerHTML = value;
  })
}


function populateRepeatValues(state, elements, pointerPath = null) {
  elements.forEach(n => console.log("elements", n))
  elements.forEach(el => {
    const query = el.dataset.repeat.split(" ");
    if (query.length !== 3) throw new Error(`data-repeat format error at ${state}, please write format like data-repeat="state.example in item"`)
    const [path, _, pointer] = query;

    const template = document.createElement("template")
    console.log("Which template", el, el.querySelector("template"));
    template.content.appendChild(Array.from(el.children).find(c => c.tagName === "TEMPLATE")?.content.cloneNode(true));
    const bindNodes = template.content.querySelectorAll("[data-bind]")
    populateTextValues(bindNodes);

    const repeatNodes = template.content.querySelectorAll("[data-repeat]");
    repeatNodes.forEach(n => console.log("Repeat node", n))
    populateRepeatValues(state, repeatNodes)

    el.innerHTML = "";
    if (!template) throw new Error("Please define a <template></template> inside your data repeat")
    const arrVal = getValueByPath(templateEngineStates, path) ?? [];
    for (let i = 0; i < arrVal.length; i++) {
      const itemDOM = template.content.cloneNode(true);
      itemDOM.querySelectorAll("[data-repeat]").forEach(item => item.removeAttribute('data-repeat'))
      const rItems = itemDOM.querySelectorAll(`[data-ritem^="{${pointer}}."]`)

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


function getValueByPath(obj, path) {
  const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1'); // arr[2] → arr.2
  return normalizedPath.split('.').reduce((acc, key) => acc?.[key], obj);
}




