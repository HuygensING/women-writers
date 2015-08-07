import React from "react";
import cx from "classnames";

import {Login, Federated, Basic} from "hire-login";

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
				<li className="login">
					<Login
						appId="WomenWriters"
						headers={{VRE_ID: "WomenWriters"}}
						onChange={function() {}}
						userUrl="https://acc.repository.huygens.knaw.nl/system/users/me">
						<Federated url="https://secure.huygens.knaw.nl/saml2/login" />
						<Basic url="https://acc.repository.huygens.knaw.nl/authenticate" />
					</Login>
				</li>
			</ul>
		);
	}
}

export default function() {
	return React.render(<MainMenu />, document.getElementById("main-menu"));
}