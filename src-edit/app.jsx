import React from "react";

import Author from "./author";
import Publication from "./publication";

class App extends React.Component {
	render() {
		let [pathRoot, types, id, ...rest] = window.location.pathname.substr(1).split("/");

		let form = (types === "persons") ?
			<Author id={id} /> :
			<Publication id={id} />;

		return (
			<div className="app">
				<header>
					<h1>NEWW Women Writers</h1>
				</header>
				<ul className="main-menu">
					<li>
						<a href="/womenwriters/persons/">Authors</a>
					</li>
					<li>
						<a href="/womenwriters/documents/">Publications</a>
					</li>
				</ul>
				{form}
			</div>
		);
	}
}

export default App;