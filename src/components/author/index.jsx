import React from "react";

import router from "../../router";

import AuthorHeader from "./header";
import EditButton from "../edit-button";
import AuthorRecord from "./record";
import AuthorForm from "./form";
import SaveFooter from "../save-footer";

import actions from "../../actions/author";
import authorStore from "../../stores/author";
import userStore from "../../stores/user";

/*
 * AuthorController for the AuthorRecord and AuthorForm
 *
 * AuthorRecord and AuthorForm share a controller, because they
 * use the same data.
 */
class AuthorController extends React.Component {
	constructor(props) {
		super(props);

		this.onStoreChange = this.onStoreChange.bind(this);

		this.state = Object.assign(
			authorStore.getState(),
			userStore.getState(), {
				edit: this.props.edit
			}
		);
	}

	componentDidMount() {
		actions.getAuthor(this.props.id);
		authorStore.listen(this.onStoreChange);
		userStore.listen(this.onStoreChange);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			actions.getAuthor(nextProps.id);
		}

		if (this.state.edit !== nextProps.edit) {
			this.setState({
				edit: nextProps.edit
			});
		}
	}

	componentWillUnmount() {
		authorStore.stopListening(this.onStoreChange);
		userStore.stopListening(this.onStoreChange);
	}

	onStoreChange() {
		let state = Object.assign(authorStore.getState(), userStore.getState());

		this.setState(state);
	}

	handleEditButtonClick() {
		this.setState({
			edit: true
		});

		let id = this.state.author.get("_id");
		let tab = this.refs.authorRecord.state.activeTab.toLowerCase();
		let path = `persons/${id}/${tab}/edit`;
		router.navigate(path);
	}

	handleFooterCancel() {
		this.setState({
			edit: false
		});

		let id = this.state.author.get("_id");
		let tab = this.refs.authorForm.state.activeTab.toLowerCase();
		let path = `persons/${id}/${tab}`;
		router.navigate(path);
	}

	render() {
		let editButton = (this.state.edit) ?
			null :
			<EditButton
				onClick={this.handleEditButtonClick.bind(this)}
				pid={this.state.author.get("^pid")}
				token={this.state.user.get("token")} />;

		let body = (this.state.edit) ?
			<AuthorForm
				{...this.props}
				author={this.state.author}
				ref="authorForm"
				router={router} /> :
			<AuthorRecord
				{...this.props}
				author={this.state.author}
				ref="authorRecord"
				router={router} />;

		let footer = (this.state.edit) ?
			<SaveFooter
				onCancel={this.handleFooterCancel.bind(this)}
				type="author" /> :
			null;

		return (
			<div className="author">
				<AuthorHeader
					author={this.state.author} />
				{editButton}
				{body}
				{footer}
			</div>
		);
	}
}

AuthorController.propTypes = {
	edit: React.PropTypes.bool,
	id: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "personal", "public", "publications", "links"])
};

AuthorController.defaultProps = {
	edit: false,
	tab: "basic info"
};

export default AuthorController;