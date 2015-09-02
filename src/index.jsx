import React from "react";
import router from "./router";
import renderMainMenu from "./components/main-menu";
import Message from "./components/messages";

import relationsActions from "./actions/relations";

relationsActions.getRelations();

router.history.start({
	root: "/womenwriters"
});

router.on("route", renderMainMenu);

document.addEventListener("DOMContentLoaded", () => {
		renderMainMenu();
		React.render(<Message />, document.querySelector(".messages"));
	}
);

// function callbackFn() {
// 	console.log("CALLBSC");
// 	console.log(arguments);
// }

// var request = new XMLHttpRequest();
// request.onreadystatechange = function() {
// 	if (request.readyState === 4) {
// 		console.log(request.status);
// 	}
// };

// request.addEventListener("error", callbackFn, false);
// request.addEventListener("abort", callbackFn, false);


// request.open("GET", "https://acc.repository.huygens.knaw.nl/v2/domain/wwpersons/newaa");
// request.setRequestHeader("Accept", "application/json");
// // request.setRequestHeader("Content-Type", "application/json");
// // request.setRequestHeader("VRE_ID", "WomenWriters");
// request.send(null);

