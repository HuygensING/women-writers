import React from "react";
import router from "../../router";
import authorActions from "../../actions/author";
import publicationActions from "../../actions/publication";

class NewButton {
	goToNew() {
		let type;

		if (this.props.type === "author") {
			type = "person";

			authorActions.setKey(["@relations", "isCreatorOf"], [{
				key: `https://acc.repository.huygens.knaw.nl/domain/ww${type}s/${this.props.key}`,
				value: this.props.value
			}]);
		} else if (this.props.type === "publication") {
			type = "document";

			publicationActions.setKey(["@relations", "isCreatedBy"], [{
				key: `https://acc.repository.huygens.knaw.nl/domain/ww${type}s/${this.props.key}`,
				value: this.props.value
			}]);
		}

		router.navigate(`/${type}s/new`);
	}

	render() {
		let button = this.props.value ?
			<button onClick={this.goToNew.bind(this)}>Add {this.props.type}</button> :
			null;

		return button;
	}
}

NewButton.propTypes = {
	key: React.PropTypes.string,
	type: React.PropTypes.oneOf(["author", "publication"]),
	value: React.PropTypes.node
};

export default NewButton;