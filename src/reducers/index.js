import {combineReducers} from "redux";

import authors from "./authors";
import publications from "./publications";
import relations from "./relations";
import user from "./user";

export default combineReducers({
	authors: authors,
	publications: publications,
	relations: relations,
	user: user
});