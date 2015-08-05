import React from "react";

import router from "./router";
import App from "./app";
import renderMainMenu from "./components/main-menu";

router.history.start({
	root: "/womenwriters"
});

router.on("route", renderMainMenu)

document.addEventListener("DOMContentLoaded", renderMainMenu);