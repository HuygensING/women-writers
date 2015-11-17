import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import SelectList from "hire-forms-select-list";
import AutocompleteList from "hire-forms-autocomplete-list";

import API from "../../../../stores/api";

class PersonalForm extends React.Component {
	render() {
		let model = this.props.author;

		return (
			<ul>
				<li>
					<label>Marital status</label>
					<SelectList
						async={API.getMaritalStatus}
						onChange={this.props.onChange.bind(this, ["@relations", "hasMaritalStatus"])}
						sort={true}
						values={model["@relations"].hasMaritalStatus} />
				</li>
				<li>
					<label>Spouse of</label>
					<AutocompleteList
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, ["@relations", "isSpouseOf"])}
						values={model["@relations"].isSpouseOf} />
				</li>
				<li>
					<label>Parent of</label>
					<AutocompleteList
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, ["@relations", "isParentOf"])}
						values={model["@relations"].isParentOf} />
				</li>
				{/*
				<li>
					<label>Sibling of</label>
					<AutocompleteList
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, ["@relations", "isSiblingOf"])}
						values={model["@relations"].isSiblingOf} />
				</li>
				<li>
					<label>Grandparent of</label>
					<AutocompleteList
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, ["@relations", "isGrandparentOf"])}
						values={model["@relations"].isGrandparentOf} />
				</li>
				*/}
				<li>
					<label>Children</label>
					<Select
						onChange={this.props.onChange.bind(this, "children")}
						options={["Yes", "No", "Unknown"]}
						value={model.children} />
				</li>
				<li>
					<label>Social class</label>
					<SelectList
						async={API.getSocialClass}
						onChange={this.props.onChange.bind(this, ["@relations", "hasSocialClass"])}
						sort={true}
						values={model["@relations"].hasSocialClass} />
				</li>
				<li>
					<label>Education</label>
					<SelectList
						async={API.getEducation}
						onChange={this.props.onChange.bind(this, ["@relations", "hasEducation"])}
						sort={true}
						values={model["@relations"].hasEducation} />
				</li>
				<li>
					<label>Religion</label>
					<SelectList
						async={API.getReligion}
						onChange={this.props.onChange.bind(this, ["@relations", "hasReligion"])}
						sort={true}
						values={model["@relations"].hasReligion} />
				</li>
			</ul>
		);
	}
}

PersonalForm.propTypes = {
	author: React.PropTypes.object,
	onChange: React.PropTypes.func
};

export default form(PersonalForm);