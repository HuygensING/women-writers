import React from "react";
import form from "hire-forms-form";
import MultiForm from "hire-forms-multi-form";
import Select from "hire-forms-select";
import Input from "hire-forms-input";
import NameForm from "./name";

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
					<MultiForm
						attr={"pseudonyms"}
						component = {NameForm}
						onChange={this.props.onChange}
						onDelete={this.props.onDelete}
						values={model.get("pseudonyms")} />
				</li>
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
				<li>
					<label>Birth date</label>
					<Input
						onChange={this.props.onChange.bind(this, "birthDate")}
						value={model.get("birthDate")} />
				</li>
				<li>
					<label>Birth place</label>
					<Input
						onChange={this.props.onChange.bind(this, "birthPlace")}
						value={model.get("birthPlace")} />
				</li>
				<li>
					<label>Death date</label>
					<Input
						onChange={this.props.onChange.bind(this, "deathDate")}
						value={model.get("deathDate")} />
				</li>
				<li>
					<label>Death place</label>
					<Input
						onChange={this.props.onChange.bind(this, "deathPlace")}
						value={model.get("deathPlace")} />
				</li>
			</ul>
		);
	}
}

export default form(BasicInfoForm);