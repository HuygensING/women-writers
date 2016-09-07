import {createStore, applyMiddleware, combineReducers} from "redux";
import thunkMiddleware from "redux-thunk";

import reducers from "./index";

let data = combineReducers(reducers);

let store = createStore(data, {}, applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f);

export default store;
