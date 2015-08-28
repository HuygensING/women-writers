import React from "react";
import cx from "classnames";

import Author from "./author";
import AuthorForm from "./author-form";

import Publication from "./publication";
import PublicationForm from "./publication-form";

class App extends React.Component {
	render() {
		let id = (this.props.id === "new") ?
			null :
			this.props.id;

		switch(this.props.page) {
			case "author":
				return (<Author id={id} tab={this.props.tab} />);

			case "authorForm":
				return (<AuthorForm id={id} tab={this.props.tab} />);

			case "publication":
				return (<Publication id={id} tab={this.props.tab} />);

			case "publicationForm":
				return (<PublicationForm id={id} tab={this.props.tab} />);
		}
	}
}

App.propTypes = {
	id: React.PropTypes.string.isRequired,
	page: React.PropTypes.string.isRequired,
	tab: React.PropTypes.string
};

export default App;