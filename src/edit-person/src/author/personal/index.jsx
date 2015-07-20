import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import Input from "hire-forms-input";
import Textarea from "hire-forms-textarea";

class PersonalForm {
	render() {
		let model = this.props.value;

		return (
			<ul>
				<li>
					<label>Marital status</label>
					<Select
						onChange={this.props.onChange.bind(this, "maritalStatus")}
						options={["Abandoned by husband/partner", "Co-habitation with partner female", "Co-habitation with partner male", "Divorced", "Liaison with man", "Liaison with woman", "Married", "Remarried", "Separated", "Single", "Widowed"]}
						value={model.get("maritalStatus")} />
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
						onChange={this.props.onChange.bind(this, "socialClass")}
						options={["Royalty", "Aristocracy by birth", "Aristocracy by marriage", "Upper class", "Middle class", "Lower class"]}
						value={model.get("socialClass")} />
				</li>
				<li>
					<label>Education</label>
					<Select
						onChange={this.props.onChange.bind(this, "education")}
						options={["Convent education", "Educated at home", "School education", "Self-educated", "University education", "Other"]}
						value={model.get("education")} />
				</li>
				<li>
					<label>Religion</label>
					<Select
						onChange={this.props.onChange.bind(this, "religion")}
						options={["Atheist", "Catholic", "Eastern Orthodox", "Jewish", "Muslim", "Protestant", "Spiritist"]}
						value={model.get("religion")} />
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