import React from "react";
import form from "hire-forms-form";
import SelectList from "hire-forms-select-list";
import AutocompleteList from "hire-forms-autocomplete-list";

import API from "../../../../stores/api";

class PublicForm {
	render() {
		let model = this.props.value;

		return (
			<ul>
				<li>
					<label>Profession</label>
					<SelectList
						async={API.getProfession}
						onChange={this.props.onChange.bind(this, ["@relations", "hasProfession"])}
						values={model.getIn(["@relations", "hasProfession"]).toJS()} />
				</li>
				<li>
					<label>Financials</label>
					<SelectList
						async={API.getFinancialSituation}
						onChange={this.props.onChange.bind(this, ["@relations", "hasFinancialSituation"])}
						values={model.getIn(["@relations", "hasFinancialSituation"]).toJS()} />
				</li>
				<li>
					<label>Collaborations</label>
					<AutocompleteList
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, ["@relations", "isCollaboratorOf"])}
						values={model.getIn(["@relations", "isCollaboratorOf"]).toJS()} />
				</li>
				<li>
					<label>Memberships</label>
					<AutocompleteList
						async={API.getCollectives}
						onChange={this.props.onChange.bind(this, ["@relations", "isMemberOf"])}
						values={model.getIn(["@relations", "isMemberOf"]).toJS()} />
				</li>
			</ul>
		);
	}
}

export default form(PublicForm);