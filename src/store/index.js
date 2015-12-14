import {createStore, applyMiddleware} from "redux";
import reducers from "../reducers";
import thunkMiddleware from "redux-thunk";

const logger = () => next => action => {
	if (action.hasOwnProperty("type")) {
		console.log("[REDUX]", action.type, action);
	}

	return next(action);
};

let createStoreWithMiddleware = applyMiddleware(/*logger,*/ thunkMiddleware)(createStore);

export default createStoreWithMiddleware(reducers);