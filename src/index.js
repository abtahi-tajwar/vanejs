import { EventFunctions, appStates, appStores } from "./constants";
import { refactorDOM, initStore, updateDOMValues } from "./core";

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
    sessionStorage.setItem(
      "store",
      JSON.stringify({
        [name]: obj,
      })
    );
  } else {
    const existing = JSON.parse(existingStore);
    existing[name] = obj;
    sessionStorage.setItem("store", JSON.stringify(existing));
  }
  updateDOMValues(name);
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

// Execution Layer
window.addEventListener("load", function () {
  refactorDOM();
  initStore();
  // reRenderDOM(this.document);
});

window.VaneJS = {
  $getState,
  $setState,
  $deleteState,
};
