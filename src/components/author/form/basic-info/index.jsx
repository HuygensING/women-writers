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
import Textarea from "hire-forms-textarea";

class BasicInfoForm extends React.Component {

	onNameChange(key, value) {
		let newKey, newValue;
		if(key === "names") {
			newKey = ["names", this.props.author.names.length, "components"];
			newValue = [];
			newValue.push({type: "FORENAME", value: value.FORENAME || ""});
		} else if(key.length === 4) {
			newKey = key;
			newValue = {type: value, value: ""};
		} else if(key[4] === "REMOVE") {
			newKey = key.slice(0, 3);
			newValue = this.props.author.names[key[1]].components.filter((v, i) => i !== key[3]);
		} else if(key.length > 2) {
			newKey = key.slice(0, 4);
			newValue = {
				type: key[4],
				value: value
			};
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

		let relatedTo = (model._id == null) ?
			null :
			<li>
				<label>Related to</label>
				<AutocompleteList
					async={API.getPersons}
					onChange={this.props.onChange.bind(this, ["@relations", "isRelatedTo"])}
					values={model["@relations"].isRelatedTo} />
			</li>;

		return (
			<ul>
				<li>
					<label>Name variations / spellings</label>
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
				{relatedTo}
				<li>
					<label>Bibliography</label>
					<Textarea
						onChange={this.props.onChange.bind(this, "bibliography")}
						value={model.bibliography} />
				</li>
				<li>
					<label>Provisional Notes</label>
					<Textarea
						onChange={this.props.onChange.bind(this, "notes")}
						value={model.notes} />
				</li>
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