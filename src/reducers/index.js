import {combineReducers} from "redux";

import authors from "./authors";
import errors from "./errors";
import graphs from "./graphs";
import publications from "./publications";
import receptions from "./receptions";
import relations from "./relations";
import router from "./router";
import user from "./user";

export default combineReducers({
	authors: authors,
	errors: errors,
	graphs: graphs,
	publications: publications,
	receptions: receptions,
	relations: relations,
	router: router,
	user: user
});