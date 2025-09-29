import { EngineAttributes, EventTargets, appStates } from "../constants";
import { generateRandomID } from "../helper";
import { parseEventQuery, removeCurlyBraces, getValueByPath } from "../helper";
import { EventFunctions } from "../constants";

export function renderEvents(elements) {
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

export function eventRootHandler(query) {
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

