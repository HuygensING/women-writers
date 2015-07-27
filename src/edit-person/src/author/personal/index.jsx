import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import Input from "hire-forms-input";
import Textarea from "hire-forms-textarea";

import API from "../../api";

class PersonalForm {
	render() {
		let model = this.props.value;

		return (
			<ul>
				<li>
					<label>Marital status</label>
					<Select
						async={API.getMaritalStatus}
						onChange={this.props.onChange.bind(this, "maritalStatus")}
						value={model.get("maritalStatus").toJS()} />
				</li>
				{/* isSpouseOf */}
				<li>
					<label>Children</label>
					<Select
						onChange={this.props.onChange.bind(this, "children")}
						options={["yes", "no", "unknown"]}
						value={model.get("children")} />
				</li>
				<li>
					<label>Social class</label>
					<Select
						async={API.getSocialClass}
						onChange={this.props.onChange.bind(this, "socialClass")}
						value={model.get("socialClass").toJS()} />
				</li>
				<li>
					<label>Education</label>
					<Select
						async={API.getEducation}
						onChange={this.props.onChange.bind(this, "education")}
						value={model.get("education").toJS()} />
				</li>
				<li>
					<label>Religion</label>
					<Select
						async={API.getReligion}
						onChange={this.props.onChange.bind(this, "religion")}
						value={model.get("religion").toJS()} />
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