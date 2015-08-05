import React from "react";
import cx from "classnames";

class MainMenu extends React.Component {
	render() {
		let [pathRoot, types, id, ...rest] = window.location.pathname.substr(1).split("/");

		return (
			<ul>
				<li className={cx({active: types === "persons"})}>
					<a href="/womenwriters/persons/">Women authors</a>
				</li>
				<li className={cx({active: types === "documents"})}>
					<a href="/womenwriters/documents/">Their publications</a>
				</li>
			</ul>
		);
	}
}

export default function() {
	return React.render(<MainMenu />, document.getElementById("main-menu"));
}