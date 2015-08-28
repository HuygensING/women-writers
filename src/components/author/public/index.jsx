import React from "react";

import Relation from "../../values/relation";

class Public {
	render() {
		let model = this.props.value;

		return (
			<ul className="record">
				<li>
					<label>Profession</label>
					<Relation values={model.getIn(["@relations", "hasProfession"]).toJS()} />
				</li>
				<li>
					<label>Financials</label>
					<Relation values={model.getIn(["@relations", "hasFinancialSituation"]).toJS()} />
				</li>
				<li>
					<label>Collaborations</label>
					<Relation values={model.getIn(["@relations", "isCollaboratorOf"]).toJS()} />
				</li>
				<li>
					<label>Memberships</label>
					<Relation values={model.getIn(["@relations", "isMemberOf"]).toJS()} />
				</li>
			</ul>
		);
	}
}

export default Public;