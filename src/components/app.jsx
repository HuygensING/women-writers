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
				return (
					<Author
						edit={this.props.edit}
						id={id}
						tab={this.props.tab} />
				);

			case "publication":
				return (
					<Publication
						edit={this.props.edit}
						id={id}
						tab={this.props.tab} />
				);
		}
	}
}

App.propTypes = {
	edit: React.PropTypes.bool.isRequired,
	id: React.PropTypes.string.isRequired,
	page: React.PropTypes.string.isRequired,
	tab: React.PropTypes.string
};

export default App;