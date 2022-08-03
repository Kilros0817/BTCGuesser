import { config } from "../../constant";
import { jsonParse } from "../../lib/json";
import { isObject } from "lodash";

const initialState = {};

const restoreState = {
  ...initialState,
  ...(jsonParse(localStorage.getItem(config.APP_NAME))?.app ?? {}),
};

const updateStore = (state = {}, payload) => {
  return !payload
    ? state
    : typeof payload === "function"
    ? payload(state)
    : isObject(payload)
    ? {
        ...state,
        ...payload,
      }
    : state;
};

const app = (state = restoreState, { type, payload = null }) => {
  switch (type) {
    case "SET_APP":
      return updateStore(state, payload);
    case "UPDATE_APP":
      return updateStore(state, payload);
    case "RESET_APP":
      return initialState;
    default:
      return state;
  }
};

export default app;
