import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";

class PublicForm {
	render() {
		let model = this.props.value;

		return (
			<ul>
				<li>
					<label>Profession</label>
					<Select
						onChange={this.props.onChange.bind(this, "profession")}
						options={["Actress", "Biographer", "Compiler", "Contributor to periodical press", "Cultural and educational patron", "Editor of periodical press", "Embroiderer", "Essayist", "Fiction writer/novelist", "Historian", "Journalist", "Lady-in-waiting", "Literary critic", "Midwife", "Musician/composer", "Nun", "Nurse", "Painter", "Philosopher", "Playwright", "Poet", "Publisher", "Salonnière", "Scholar", "Social-cultural activist", "Teacher/governess", "Translator", "Traveller", "Writer"]}
						value={model.get("profession")} />
				</li>
				<li>
					<label>Financials</label>
					<Select
						onChange={this.props.onChange.bind(this, "financials")}
						options={["Investing/losing her own money", "Living by her pen", "Other income", "Stipend/allowance/pension"]}
						value={model.get("financials")} />
				</li>
				{/* Collaborations */}
				{/* Memberschips */}
				{/* TEMP DATA */}
			</ul>
		);
	}
}

export default form(PublicForm);