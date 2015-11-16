import React from "react";
import cx from "classnames";
import Link from "../link";

class MainMenu extends React.Component {
	render() {
		let types = window.location.pathname.substr(1).split("/")[2];

		if (types == null) {
			types = "persons";
		}

		let lastModified, collectives;
		if (this.props.user != null && this.props.user.authenticated) {
			lastModified = (
				<li className={cx({active: types === "modified"})}>
					<Link
						href="modified"
						onNavigate={this.props.onNavigate}
						value="Last modified" />
				</li>
			);
			collectives = (
				<li className={cx({active: types === "collectives"})}>
					<Link
						href="collectives"
						onNavigate={this.props.onNavigate}
						value="Collectives" />
				</li>
			);
		}

		return (
			<div className="main-menu">
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
					{collectives}
					<li dangerouslySetInnerHTML={{__html: this.props.wordpressLinks || ""}}></li>
					{lastModified}
				</ul>
			</div>
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