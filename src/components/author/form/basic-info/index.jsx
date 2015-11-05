import React from "react";
import form from "hire-forms-form";
import MultiForm from "hire-forms-multi-form";
import Select from "hire-forms-select";
import SelectList from "hire-forms-select-list";
import Input from "hire-forms-input";
import AutocompleteList from "hire-forms-autocomplete-list";
import NameForm from "./name";

import {validateDate} from "../../../../validation";
import API from "../../../../stores/api";

class BasicInfoForm extends React.Component {

	onNameChange(key, value) {
		let newKey, newValue;

		if(key[4] === "REMOVE") {
			newKey = key.slice(0, 3);
			newValue = this.props.author.names[key[1]].components.filter((v, i) => i !== key[3]);
		} else if(key.length > 2) {
			newKey = key.slice(0, 4);
			newValue = {
				type: key[4],
				value: value
			};
		} else {
			newKey = [...key, "components"];
			newValue = [];
			if(value.FORENAME) { newValue.push({type: "FORENAME", value: value.FORENAME || ""}); }
			if(value.NAME_LINK) { newValue.push({type: "NAME_LINK", value: value.NAME_LINK || ""}); }
			if(value.SURNAME) { newValue.push({type: "SURNAME", value: value.SURNAME || ""}); }
		}
		this.props.onChange(newKey, newValue);
	}

	render() {
		let model = this.props.author;

		let pseudonyms = (model._id == null) ?
			null :
			<li>
				<label>Pseudonyms</label>
				<AutocompleteList
					async={API.getPersons}
					onChange={this.props.onChange.bind(this, ["@relations", "hasPseudonym"])}
					values={model["@relations"].hasPseudonym} />
			</li>;

		let birthPlace = (model._id == null) ?
			null :
			<li>
				<label>Birth place</label>
				<AutocompleteList
					async={API.getLocations}
					onChange={this.props.onChange.bind(this, ["@relations", "hasBirthPlace"])}
					values={model["@relations"].hasBirthPlace} />
			</li>;

		let livedIn = (model._id == null) ?
			null :
			<li>
				<label>Lived in</label>
				<AutocompleteList
					async={API.getLocations}
					onChange={this.props.onChange.bind(this, ["@relations", "hasResidenceLocation"])}
					values={model["@relations"].hasResidenceLocation} />
			</li>;

		let deathPlace = (model._id == null) ?
			null :
			<li>
				<label>Death place</label>
				<AutocompleteList
					async={API.getLocations}
					onChange={this.props.onChange.bind(this, ["@relations", "hasDeathPlace"])}
					values={model["@relations"].hasDeathPlace} />
			</li>;


		return (
			<ul>
				<li>
					<label>Names</label>
					<MultiForm
						attr={"names"}
						component = {NameForm}
						model={{
							FORENAME: "",
							SURNAME: "",
							components: []
						}}
						onChange={this.onNameChange.bind(this)}
						onDelete={this.props.onDelete}
						values={model.names} />
				</li>
				{pseudonyms}
				<li>
					<label>Type</label>
					<SelectList
						onChange={this.props.onChange.bind(this, "types")}
						options={["Archetype", "Author", "Pseudonym", "Reader"]}
						values={model.types} />
				</li>
				<li>
					<label>Gender</label>
					<Select
						onChange={this.props.onChange.bind(this, "gender")}
						options={["Female", "Male", "Unknown"]}
						value={model.gender} />
				</li>
				<li>
					<label>Birth date</label>
					<Input
						onChange={this.props.onChange.bind(this, "birthDate")}
						validate={validateDate}
						value={model.birthDate} />
				</li>
				{birthPlace}
				{livedIn}
				<li>
					<label>Death date</label>
					<Input
						onChange={this.props.onChange.bind(this, "deathDate")}
						validate={validateDate}
						value={model.deathDate} />
				</li>
				{deathPlace}
			</ul>
		);
	}
}

BasicInfoForm.propTypes = {
	author: React.PropTypes.object,
	onChange: React.PropTypes.func,
	onDelete: React.PropTypes.func
};

export default form(BasicInfoForm);