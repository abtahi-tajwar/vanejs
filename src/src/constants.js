import { prefix } from "./config";
import { makeAttr } from "./utils";

export const EngineAttributes = {
  IF: makeAttr('if'),
  ELSEIF: makeAttr('elseif'),
  ELSE: makeAttr('else'),
  CONDITION: makeAttr('condition'),
  BIND: makeAttr('bind'),
  ATTRIBUTE_BIND: makeAttr('bind-attr'),
  REPEAT: makeAttr('repeat'),
  REPEAT_ITEM: makeAttr('ritem'),
  REPEAT_ATTRIBUTE: makeAttr('rattr'),
  NESTED_LEVEL: makeAttr('nested-level'),
  ID: makeAttr('id'),
  TARGET: makeAttr('target'),
  CONDITION_REMNANT: makeAttr('cond-remnant'),
  EVENT: makeAttr('on'),
  EVENT_TARGET: makeAttr('event-target')
};

export const EventFunctions = new Proxy({}, {
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

export const EventTargets = new Proxy({}, {
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

export const appStates = new Proxy({}, {
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

export const appStores = new Proxy({}, {
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

export const cache = new Proxy({
  template: null
}, {
  get(target, prop) {
    return target[prop];
  },
  set(target, prop, value) {
    target[prop] = value;
    // Optional: trigger DOM update or re-render here
    return true;
  }
});


