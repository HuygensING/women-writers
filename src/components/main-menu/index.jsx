import React from "react";
import cx from "classnames";

import config from "../../config";

import {Login, Federated, Basic} from "hire-login";
import Link from "../link";

// import userActions from "../../actions/user";
// import router from "../../router";

class MainMenu extends React.Component {
	// handleLoginChange(response) {
	// 	if (response.authenticated && response.token != null) {
	// 		userActions.receive({
	// 			displayName: response.userData.displayName,
	// 			email: response.userData.email,
	// 			token: response.token
	// 		});
	// 	}
	// }

	// handleNew(type) {
	// 	let types = type === "author" ?
	// 		"persons" :
	// 		"documents";

	// 	router.navigate(`/${types}/new`, {trigger: true});
	// }

	render() {
		let [types] = window.location.pathname.substr(1).split("/").slice(1, 2);

		if (types == null) {
			types = "persons";
		}

		return (
			<ul>
				<li className={cx({active: types === "persons"})}>
					<Link
						href="persons"
						value="Women authors" />
				</li>
				<li className={cx({active: types === "documents"})}>
					<Link
						href="documents"
						value="Their publications" />
				</li>
				<li className="login">
					<Login
						appId="WomenWriters"
						headers={{VRE_ID: "WomenWriters"}}
						onChange={(this.props.onLoginChange)}
						userUrl={config.userUrl}>
						<Federated url={config.federatedAuthenticateUrl} />
						<Basic url={config.basicAuthenticateUrl} />
					</Login>
				</li>
				<li className="new-author">
					<button onClick={this.props.onNewAuthor}>
						New author
					</button>
				</li>
				<li className="new-publication">
					<button onClick={this.props.onNewPublication}>
						New publication
					</button>
				</li>
			</ul>
		);
	}
}

export default MainMenu;