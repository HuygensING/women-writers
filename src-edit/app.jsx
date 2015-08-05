import React from "react";
import cx from "classnames";

import Author from "./components/author";
import Publication from "./components/publication";
import EditAuthor from "./components/edit-author";
import EditPublication from "./components/edit-publication";

class App extends React.Component {
	render() {
		let [pathRoot, types, id, ...rest] = window.location.pathname.substr(1).split("/");

		let form = null;

		if (types === "persons") {
			form = (rest.length && rest[0] === "edit") ?
				<EditAuthor id={id} /> :
				<Author id={id} />;

			if (id === "new") {
				form = <EditAuthor />
			}
		} else if (types === "documents") {
			form = (rest.length && rest[0] === "edit") ?
				<EditPublication id={id} /> :
				<Publication id={id} />;

			if (id === "new") {
				form = <EditPublication />
			}
		}

		return (
			<div className="app">
				<header>
					<h1>NEWW Women Writers</h1>
				</header>
				{form}
			</div>
		);
	}
}

export default App;