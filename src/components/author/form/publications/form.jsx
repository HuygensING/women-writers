import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import Autocomplete from "hire-forms-autocomplete";
import API from "../../../../stores/api";

const DEFAULT_STATE = {
	relationType: {
		key: "",
		value: ""
	},
	relation: {
		key: "",
		value: ""
	}
};

class AuthorPublicationsForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = DEFAULT_STATE;
		if(this.props.selectOptions.length === 1) {
			this.state = {relationType: this.props.selectOptions[0]};
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.selectOptions.length === 1) {
			this.setState({relationType: nextProps.selectOptions[0]});
		}
	}

	handleChange(key, value) {
		this.setState({
			[key]: value
		});
	}

	handleSubmit() {
		this.props.onChange(this.state);
		this.setState({relation: DEFAULT_STATE.relation});
	}

	render() {
		let select = this.props.selectOptions.length > 1 ?
			(<Select
				onChange={this.handleChange.bind(this, "relationType")}
				options={this.props.selectOptions}
				value={this.state.relationType} />)	:
			<label>{this.state.relationType.value}</label>;

		let autocomplete = this.props.selectOptions.length ?
			<Autocomplete async={API.getDocuments} onChange={this.handleChange.bind(this, "relation")} value={this.state.relation} /> : null;

		let button = this.props.selectOptions.length ?
			<button onClick={this.handleSubmit.bind(this)}>Add relation</button> : null;

		return (
			<ul className="well">
				<li>{select}</li>
				<li>{autocomplete}</li>
				<li>{button}</li>
			</ul>
		);
	}
}

AuthorPublicationsForm.propTypes = {
	onChange: React.PropTypes.func,
	selectOptions: React.PropTypes.array
};

export default form(AuthorPublicationsForm);