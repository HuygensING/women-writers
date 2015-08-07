import React from "react";
import form from "hire-forms-form";
import MultiForm from "hire-forms-multi-form";
import Select from "hire-forms-select";
import SelectList from "hire-forms-select-list";
import Input from "hire-forms-input";
import AutocompleteList from "hire-forms-autocomplete-list";
import NameForm from "./name";

import API from "../../../stores/api";

class BasicInfoForm {
	render() {
		let model = this.props.value;

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
				<li>
					<label>Pseudonyms</label>
					<AutocompleteList
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, ["@relations", "hasPseudonym"])}
						values={model.getIn(["@relations", "hasPseudonym"]).toJS()} />
				</li>
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
						value={model.get("birthDate")} />
				</li>
				<li>
					<label>Birth place</label>
					<AutocompleteList
						async={API.getLocations}
						onChange={this.props.onChange.bind(this, ["@relations", "hasBirthPlace"])}
						values={model.getIn(["@relations", "hasBirthPlace"]).toJS()} />
				</li>
				<li>
					<label>Lived in</label>
					<AutocompleteList
						async={API.getLocations}
						onChange={this.props.onChange.bind(this, ["@relations", "hasResidenceLocation"])}
						values={model.getIn(["@relations", "hasResidenceLocation"]).toJS()} />
				</li>
				<li>
					<label>Death date</label>
					<Input
						onChange={this.props.onChange.bind(this, "deathDate")}
						value={model.get("deathDate")} />
				</li>
				<li>
					<label>Death place</label>
					<AutocompleteList
						async={API.getLocations}
						onChange={this.props.onChange.bind(this, ["@relations", "hasDeathPlace"])}
						values={model.getIn(["@relations", "hasDeathPlace"]).toJS()} />
				</li>
			</ul>
		);
	}
}

export default form(BasicInfoForm);