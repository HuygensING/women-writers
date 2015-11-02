import React from "react";

import Relation from "../../../values/relation";

class Public extends React.Component {
	render() {
		let model = this.props.author;

		return (
			<ul className="record">
				<li>
					<label>Profession</label>
					<Relation values={model["@relations"].hasProfession} />
				</li>
				<li>
					<label>Financials</label>
					<Relation values={model["@relations"].hasFinancialSituation} />
				</li>
				<li>
					<label>Collaborations</label>
					<Relation values={model["@relations"].isCollaboratorOf} />
				</li>
				<li>
					<label>Memberships</label>
					<Relation values={model["@relations"].isMemberOf} />
				</li>
			</ul>
		);
	}
}

export default Public;