import { APP_NAME } from "config";
import { combineReducers, configureStore } from "redux";
import reducers from "./reducers";

const store = configureStore(combineReducers(reducers));

store.subscribe(() => {
  const storeData = store.getState();
  const saveData = { app: storeData?.app ?? {} };
  window.localStorage.setItem(APP_NAME, JSON.stringify(saveData));
});

store.dispatch({ type: "AUTH_CHECK" });

export default store;
