import React from "react";
import cx from "classnames";

import config from "../../config";

import {Login, Federated, Basic} from "hire-login";
import Link from "../link";

class MainMenu extends React.Component {
	render() {
		let types = window.location.pathname.substr(1).split("/")[2];

		if (types == null) {
			types = "persons";
		}

		let newAuthor, newPublication, newCollective, lastModified;
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

			newCollective = (
				<li className="new-collective">
					<button onClick={this.props.onNewCollective}>
						New collective
					</button>
				</li>);

			lastModified = (
				<li className={cx({active: types === "modified"})}>
					<Link
						href="modified"
						onNavigate={this.props.onNavigate}
						value="Last modified" />
				</li>
			);
		}

		return (
			<ul>
				<li>
					<a href="/womenwriters">Home</a>
				</li>
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
				<li className={cx({active: types === "receptions"})}>
					<Link
						href="receptions/publications"
						onNavigate={this.props.onNavigate}
						value="Receptions" />
				</li>
				<li dangerouslySetInnerHTML={{__html: this.props.wordpressLinks || ""}}></li>
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
				<li className={cx({active: types === "collectives"})}>
					<Link
						href="collectives"
						onNavigate={this.props.onNavigate}
						value="Collectives" />
				</li>
				{lastModified}
				{newAuthor}
				{newPublication}
				{newCollective}
			</ul>
		);
	}
}

MainMenu.propTypes = {
	onLoginChange: React.PropTypes.func,
	onNavigate: React.PropTypes.func,
	onNewAuthor: React.PropTypes.func,
	onNewCollective: React.PropTypes.func,
	onNewPublication: React.PropTypes.func,
	user: React.PropTypes.object,
	wordpressLinks: React.PropTypes.string
};

export default MainMenu;