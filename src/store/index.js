
import { combineReducers, createStore } from "redux";
import reducers from "./reducers";
import {config} from "../constant"

const store = createStore(combineReducers(reducers));

store.subscribe(() => {
  const storeData = store.getState();
  const saveData = { app: storeData?.app ?? {} };
  window.localStorage.setItem(config.APP_NAME, JSON.stringify(saveData));
});

export default store;
