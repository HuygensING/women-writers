import React from "react";

import StringComponent from "../../values/string";
import Relation from "../../values/relation";
import KeywordField from "../../form-fields/keyword";
import SelectField from "../../form-fields/select";

class Personal extends React.Component {
	render() {
		let model = this.props.entity.data;
		const { otherData } = this.props;
		const otherRelations = otherData["@relations"] || {};

		const { editable, onChange, metadata } = this.props;

		return (
			<div>
				<ul className="record list-group">
					<li className="list-group-item">
						<label>Marital status</label>
						{ editable
							? <KeywordField name="hasMaritalStatus" onChange={onChange}
								options={metadata.properties.find((p) => p.name === "hasMaritalStatus").options}
								entity={this.props.entity} />
							: <Relation values={model["@relations"].hasMaritalStatus} otherValues={otherRelations.hasMaritalStatus} />
						}
					</li>
					<li className="list-group-item">
						<label>Children</label>
						{ editable
							? <SelectField
								name="children" options={metadata.properties.find((p) => p.name === "children").options}
								onChange={onChange} entity={this.props.entity} />
							: <StringComponent value={model.children} otherValue={otherData.children} />
						}
					</li>
					<li className="list-group-item">
						<label>Social class</label>
						{ editable
							? <KeywordField name="hasSocialClass" onChange={onChange}
											options={metadata.properties.find((p) => p.name === "hasSocialClass").options}
											entity={this.props.entity} />
							: <Relation values={model["@relations"].hasSocialClass} otherValues={otherRelations.hasSocialClass} />
						}
					</li>
					<li className="list-group-item">
						<label>Education</label>
						{ editable
							? <KeywordField name="hasEducation" onChange={onChange}
											options={metadata.properties.find((p) => p.name === "hasEducation").options}
											entity={this.props.entity} />
							: <Relation values={model["@relations"].hasEducation} otherValues={otherRelations.hasEducation} />
						}
					</li>
					<li className="list-group-item">
						<label>Religion / ideology</label>
						{editable
							? <KeywordField name="hasReligion" onChange={onChange}
											options={metadata.properties.find((p) => p.name === "hasReligion").options}
											entity={this.props.entity} />
							: <Relation values={model["@relations"].hasReligion} otherValues={otherRelations.hasReligion} />
						}
					</li>
				</ul>
				<div className="temp-data panel panel-default">
					<h2 className="panel-heading">Temporary data</h2>
					<ul>
						<li>
							<label>Spouse</label>
							<span>{model.tempSpouse}</span>
						</li>
						<li>
							<label>Children</label>
							<span>{model.tempChildren}</span>
						</li>
						<li>
							<label>Ps Children</label>
							<span>{model.tempPsChildren}</span>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

Personal.propTypes = {
	entity: React.PropTypes.object,
	onNavigate: React.PropTypes.func
};

export default Personal;