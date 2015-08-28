import React from "react";
import Immutable from "immutable";
import form from "hire-forms-form";
import Input from "hire-forms-input";

let name = new Immutable.Map({
	firstName: "",
	lastName: ""
});

class NameForm {
	render() {
		let model = name.merge(this.props.value);

		return (
			<ul>
				<li>
					<Input
						onChange={this.props.handleChange.bind(this, "firstName")}
						placeholder="First name"
						value={model.get("firstName")} />
				</li>
				<li>
					<Input
						onChange={this.props.handleChange.bind(this, "lastName")}
						placeholder="Last name"
						value={model.get("lastName")} />
				</li>
			</ul>
		);
	}
}

export default form(NameForm, "names-form");