import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import SelectList from "hire-forms-select-list";
import AutocompleteList from "hire-forms-autocomplete-list";
import Textarea from "hire-forms-textarea";

import API from "../../../stores/api";

class PersonalForm {
	render() {
		let model = this.props.value;

		return (
			<ul>
				<li>
					<label>Marital status</label>
					<SelectList
						async={API.getMaritalStatus}
						onChange={this.props.onChange.bind(this, ["@relations", "hasMaritalStatus"])}
						sort={true}
						values={model.getIn(["@relations", "hasMaritalStatus"]).toJS()} />
				</li>
				<li>
					<label>Spouse of</label>
					<AutocompleteList
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, ["@relations", "isSpouseOf"])}
						values={model.getIn(["@relations", "isSpouseOf"]).toJS()} />
				</li>
				<li>
					<label>Children</label>
					<Select
						onChange={this.props.onChange.bind(this, "children")}
						options={["Yes", "No", "Unknown"]}
						value={model.get("children")} />
				</li>
				<li>
					<label>Social class</label>
					<SelectList
						async={API.getSocialClass}
						onChange={this.props.onChange.bind(this, ["@relations", "hasSocialClass"])}
						sort={true}
						values={model.getIn(["@relations", "hasSocialClass"]).toJS()} />
				</li>
				<li>
					<label>Education</label>
					<SelectList
						async={API.getEducation}
						onChange={this.props.onChange.bind(this, ["@relations", "hasEducation"])}
						sort={true}
						values={model.getIn(["@relations", "hasEducation"]).toJS()} />
				</li>
				<li>
					<label>Religion</label>
					<SelectList
						async={API.getReligion}
						onChange={this.props.onChange.bind(this, ["@relations", "hasReligion"])}
						sort={true}
						values={model.getIn(["@relations", "hasReligion"]).toJS()} />
				</li>
				<li>
					<label>Bibliography</label>
					<Textarea
						onChange={this.props.onChange.bind(this, "bibliography")}
						value={model.get("bibliography")} />
				</li>
				<li>
					<label>Notes</label>
					<Textarea
						onChange={this.props.onChange.bind(this, "notes")}
						value={model.get("notes")} />
				</li>
			</ul>
		);
	}
}

export default form(PersonalForm);