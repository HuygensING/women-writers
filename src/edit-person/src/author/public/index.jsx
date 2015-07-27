import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";

import API from "../../api";

class PublicForm {
	render() {
		let model = this.props.value;

		return (
			<ul>
				<li>
					<label>Profession</label>
					<Select
						async={API.getProfession}
						onChange={this.props.onChange.bind(this, "profession")}
						value={model.get("profession").toJS()} />
				</li>
				<li>
					<label>Financials</label>
					<Select
						async={API.getFinancialSituation}
						onChange={this.props.onChange.bind(this, "financials")}
						value={model.get("financials").toJS()} />
				</li>
				{/* Collaborations */}
				{/* Memberschips */}
				{/* TEMP DATA */}
			</ul>
		);
	}
}

export default form(PublicForm);