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


function populateRepeatValues(state, elements) {
  elements.forEach(el => {
    const query = el.dataset.repeat.split(" ");
    if (query.length !== 3) throw new Error(`data-repeat format error at ${state}, please write format like data-repeat="state.example in item"`)
    const [path, _, pointer] = query;

    const template = document.createElement("template")
    template.content.appendChild(el.querySelector("template")?.content.cloneNode(true));
    console.log("Template", template);
    const bindNodes = template.content.querySelectorAll("[data-bind]")
    console.log("Bind nodes", bindNodes);
    populateTextValues(bindNodes);

    el.innerHTML = "";
    if (!template) throw new Error("Please define a <template></template> inside your data repeat")
    const arrVal = getValueByPath(templateEngineStates, path) ?? [];
    for (let i = 0; i < arrVal.length; i++) {
      const itemDOM = template.content.cloneNode(true);
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




