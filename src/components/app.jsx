import React from "react";

import Author from "./author";
import Publication from "./publication";

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
	id: React.PropTypes.string,
	page: React.PropTypes.string.isRequired,
	tab: React.PropTypes.string
};

export default App;