import React from "react";

import Link from "../../../link";
import Relation from "../../../values/relation";

class Public extends React.Component {
	render() {
		let model = this.props.author;

		let memberships = model["@relations"].isMemberOf ?(
			<li>
				<label>Memberships</label>
				<span><ul className="relation">
					{model["@relations"].isMemberOf.map((r, i) =>
						<li key={i}><Link href={"collectives/" + r.key.replace(/.*\//, "")} onNavigate={this.props.onNavigate} value={r.value} /></li>
					)}
				</ul></span>
			</li>) : <li><label>Memberships</label>-</li>;

		return (
			<ul className="record">
				<li>
					<label>Profession(s) and other activities</label>
					<Relation values={model["@relations"].hasProfession} />
				</li>
				<li>
					<label>Financial aspects</label>
					<Relation values={model["@relations"].hasFinancialSituation} />
				</li>
				<li>
					<label>Collaborations</label>
					<Relation values={model["@relations"].isCollaboratorOf} />
				</li>
				{memberships}
			</ul>
		);
	}
}

Public.propTypes = {
	author: React.PropTypes.object,
	onNavigate: React.PropTypes.func
};

export default Public;