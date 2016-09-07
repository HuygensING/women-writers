import React from "react";

import Relation from "../../values/relation";
import KeywordField from "../../form-fields/keyword";
import RelationField from "../../form-fields/relation";
import StringComponent from "../../values/string";

class Public extends React.Component {
	render() {
		let model = this.props.entity.data;
		const { otherData } = this.props;
		const otherRelations = otherData["@relations"] || {};

		const { editable, onChange, metadata, authorized } = this.props;

		return (
			<div>
				<ul className="record list-group">
					<li className="list-group-item">
						<label>Profession(s) and other activities</label>
						{ editable
							? <KeywordField name="hasProfession" onChange={onChange}
											options={metadata.properties.find((p) => p.name === "hasProfession").options.sort((a, b) => a.value.localeCompare(b.value)) }
											entity={this.props.entity} />
							: <Relation values={model["@relations"].hasProfession} otherValues={otherRelations.hasProfession} />
						}
					</li>
					<li className="list-group-item">
						<label>Financial aspects</label>
						{ editable
							? <KeywordField name="hasFinancialSituation" onChange={onChange}
											options={metadata.properties.find((p) => p.name === "hasFinancialSituation").options}
											entity={this.props.entity} />
							: <Relation values={model["@relations"].hasFinancialSituation} otherValues={otherRelations.hasFinancialSituation} />
						}
					</li>
					<li className="list-group-item">
						<label>Collaborations</label>
						{ editable
							? <RelationField name="isCollaboratorOf"
								path={metadata.properties.find((p) => p.name === "isCollaboratorOf").quicksearch}
								onChange={onChange} entity={this.props.entity} />
							: <Relation values={model["@relations"].isCollaboratorOf} otherValues={otherRelations.isCollaboratorOf} linkTo="authorIndex" />
						}
					</li>
					<li className="list-group-item">
						<label>Memberships</label>
						{ editable
							? <RelationField name="isMemberOf"
								path={metadata.properties.find((p) => p.name === "isMemberOf").quicksearch}
								onChange={onChange} entity={this.props.entity} />
							: <Relation values={model["@relations"].isMemberOf} otherValues={otherRelations.isMemberOf}
										linkTo={authorized ? "collectiveIndex" : null} />
						}
					</li>
					<li className="list-group-item">
						<label>Publication languages</label>
						<StringComponent value={model["@authorLanguages"].join(", ")} />
					</li>
				</ul>
				<div className="temp-data panel panel-default">
					<h2 className="panel-heading">Temporary data</h2>
					<ul className="list-group">
						<li className="list-group-item">
							<label>Financial situation</label>
							<span>{model.tempFinancialSituation}</span>
						</li>
						<li className="list-group-item">
							<label>Collaborations</label>
							<span>{model.tempCollaborations}</span>
						</li>
						<li className="list-group-item">
							<label>Memberships</label>
							<span>{model.tempMemberships}</span>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

Public.propTypes = {
	entity: React.PropTypes.object
};

export default Public;