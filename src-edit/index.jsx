import router from "./router";
import renderMainMenu from "./components/main-menu";

import relationsActions from "./actions/relations";

relationsActions.getRelations();

router.history.start({
	root: "/womenwriters"
});

router.on("route", renderMainMenu);

document.addEventListener("DOMContentLoaded", renderMainMenu);