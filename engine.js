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


function populateRepeatValues(state, elements, parentPointer = null, parentPointerPath = null) {
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
    populateTextValues(bindNodes);


    el.innerHTML = "";
    if (!template) throw new Error("Please define a <template></template> inside your data repeat")
    const arrVal = getValueByPath(templateEngineStates, path) ?? [];
    console.log("Path", arrVal, path);
    for (let i = 0; i < arrVal.length; i++) {
      const itemDOM = template.content.cloneNode(true);

      const repeatNodes = itemDOM.querySelectorAll("[data-repeat]");
      populateRepeatValues(state, repeatNodes, pointer, `${path}[${i}]`)

      itemDOM.querySelectorAll("[data-repeat]").forEach(item => item.removeAttribute('data-repeat'))
      const rItems = itemDOM.querySelectorAll(`[data-ritem^="{${pointer}}"]`)

      rItems.forEach((item) => {
        let key = item.dataset.ritem;
        const absolutepath = key.replace(`{${pointer}}`, `${path}[${i}]`)
        console.log("Absolute path", absolutepath);
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




