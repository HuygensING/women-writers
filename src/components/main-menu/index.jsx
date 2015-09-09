import React from "react";
import cx from "classnames";

import config from "../../config";

import {Login, Federated, Basic} from "hire-login";
import Link from "../link";

class MainMenu extends React.Component {
	render() {
		let [types] = window.location.pathname.substr(1).split("/").slice(1, 2);

		if (types == null) {
			types = "persons";
		}

		let newAuthor, newPublication;
		if (this.props.user != null && this.props.user.authenticated) {
			newAuthor = (
				<li className="new-author">
					<button onClick={this.props.onNewAuthor}>
						New author
					</button>
				</li>);

			newPublication = (
				<li className="new-publication">
					<button onClick={this.props.onNewPublication}>
						New publication
					</button>
				</li>);
		}

		return (
			<ul>
				<li className={cx({active: types === "persons"})}>
					<Link
						href="persons"
						onNavigate={this.props.onNavigate}
						value="Women authors" />
				</li>
				<li className={cx({active: types === "documents"})}>
					<Link
						href="documents"
						onNavigate={this.props.onNavigate}
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
				{newAuthor}
				{newPublication}
			</ul>
		);
	}
}

export default MainMenu;