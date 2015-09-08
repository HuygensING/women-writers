import {combineReducers} from "redux";

import authors from "./authors";
import publications from "./publications";
import relations from "./relations";
import router from "./router";
import user from "./user";

export default combineReducers({
	authors: authors,
	publications: publications,
	relations: relations,
	router: router,
	user: user
});