import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";

class BasicInfoForm {
	render() {
		let model = this.props.value;

		return (
			<ul>
				<li>
					<label>Person type</label>
					<Select
						onChange={this.props.onChange.bind(this, "persontype")}
						options={["Archetype", "Author", "Pseudonym"]}
						value={model.get("persontype")} />
				</li>
				<li>
					<label>Gender</label>
					<Select
						onChange={this.props.onChange.bind(this, "gender")}
						options={["Female", "Male", "Unknown"]}
						value={model.get("gender")} />
				</li>
			</ul>
		);
	}
}

export default form(BasicInfoForm);