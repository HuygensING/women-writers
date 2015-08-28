import React from "react";
import form from "hire-forms-form";
import MultiForm from "hire-forms-multi-form";
import Select from "hire-forms-select";
import SelectList from "hire-forms-select-list";
import Input from "hire-forms-input";
import AutocompleteList from "hire-forms-autocomplete-list";
import NameForm from "./name";

import API from "../../../../stores/api";

let validateDate = function(value) {
    // Handle validation.
    let re = /^(\d{2}-)?(\d{2}-)?\d{4}(~|\?)?$/;
    let isValid = re.test(value);

    // Return a validator object.
    return {
        isValid: isValid,
        message: isValid ? "" : "A date should be formatted as: DD-MM-YYYY. \nOptionally a '~' (approximate) or '?' (uncertain) can be added."
    };
};

class BasicInfoForm {
	render() {
		let model = this.props.value;

		let pseudonyms = (model.get("_id") == null) ?
			null :
			<li>
				<label>Pseudonyms</label>
				<AutocompleteList
					async={API.getPersons}
					onChange={this.props.onChange.bind(this, ["@relations", "hasPseudonym"])}
					values={model.getIn(["@relations", "hasPseudonym"]).toJS()} />
			</li>;

		let birthPlace = (model.get("_id") == null) ?
			null :
			<li>
				<label>Birth place</label>
				<AutocompleteList
					async={API.getLocations}
					onChange={this.props.onChange.bind(this, ["@relations", "hasBirthPlace"])}
					values={model.getIn(["@relations", "hasBirthPlace"]).toJS()} />
			</li>;

		let livedIn = (model.get("_id") == null) ?
			null :
			<li>
				<label>Lived in</label>
				<AutocompleteList
					async={API.getLocations}
					onChange={this.props.onChange.bind(this, ["@relations", "hasResidenceLocation"])}
					values={model.getIn(["@relations", "hasResidenceLocation"]).toJS()} />
			</li>;

		let deathPlace = (model.get("_id") == null) ?
			null :
			<li>
				<label>Death place</label>
				<AutocompleteList
					async={API.getLocations}
					onChange={this.props.onChange.bind(this, ["@relations", "hasDeathPlace"])}
					values={model.getIn(["@relations", "hasDeathPlace"]).toJS()} />
			</li>;


		return (
			<ul>
				<li>
					<label>Names</label>
					<MultiForm
						attr={"names"}
						component = {NameForm}
						onChange={this.props.onChange}
						onDelete={this.props.onDelete}
						values={model.get("names")} />
				</li>
				{pseudonyms}
				<li>
					<label>Type</label>
					<SelectList
						onChange={this.props.onChange.bind(this, "types")}
						options={["Archetype", "Author", "Pseudonym"]}
						values={model.get("types").toJS()} />
				</li>
				<li>
					<label>Gender</label>
					<Select
						onChange={this.props.onChange.bind(this, "gender")}
						options={["Female", "Male", "Unknown"]}
						value={model.get("gender")} />
				</li>
				<li>
					<label>Birth date</label>
					<Input
						onChange={this.props.onChange.bind(this, "birthDate")}
						validate={validateDate}
						value={model.get("birthDate")} />
				</li>
				{birthPlace}
				{livedIn}
				<li>
					<label>Death date</label>
					<Input
						onChange={this.props.onChange.bind(this, "deathDate")}
						validate={validateDate}
						value={model.get("deathDate")} />
				</li>
				{deathPlace}
			</ul>
		);
	}
}

export default form(BasicInfoForm);