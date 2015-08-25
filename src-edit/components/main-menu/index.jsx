import React from "react";
import cx from "classnames";

import {Login, Federated, Basic} from "hire-login";

import userActions from "../../actions/user";
import router from "../../router";

class MainMenu extends React.Component {
	handleLoginChange(response) {
		if (response.authenticated && response.token != null) {
			userActions.receive({
				displayName: response.userData.displayName,
				email: response.userData.email,
				token: response.token
			});
		}
	}

	handleNew(type) {
		let types = type === "author" ?
			"persons" :
			"documents";

		router.navigate(`/${types}/new`, {trigger: true});
	}

	render() {
		let [types] = window.location.pathname.substr(1).split("/").slice(1, 2);

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
						onChange={this.handleLoginChange.bind(this)}
						userUrl="https://acc.repository.huygens.knaw.nl/v2/system/users/me">
						<Federated url="https://secure.huygens.knaw.nl/saml2/login" />
						<Basic url="https://acc.repository.huygens.knaw.nl/v2/authenticate" />
					</Login>
				</li>
				<li className="new-author">
					<button onClick={this.handleNew.bind(this, "author")}>
						New author
					</button>
				</li>
				<li className="new-publication">
					<button onClick={this.handleNew.bind(this, "publication")}>
						New publication
					</button>
				</li>
			</ul>
		);
	}
}

export default function() {
	return React.render(<MainMenu />, document.getElementById("main-menu"));
}