import React from "react";

import StringComponent from "../../values/string";
import TextComponent from "../../values/text";
import Relation from "../../values/relation";

import DatableField from "../../form-fields/datable";
import KeywordField from "../../form-fields/keyword";
import SelectField from "../../form-fields/select";
import RelationField from "../../form-fields/relation";
import TextField from "../../form-fields/text";
import StringField from "../../form-fields/string";

class BasicInfo extends React.Component {
	render() {
		const model = this.props.entity.data;
		const { otherData } = this.props;
		const otherRelations = otherData["@relations"] || {};

		const pid = model["^pid"] ? <a className="link" href={model["^pid"]} target="_blank">{model["^pid"]}</a> : "-";

		const { editable, onChange, metadata } = this.props;


		return (
			<div>
				<ul className="record list-group">
					<li className="list-group-item">
						<label>Author</label>
						{ editable
							? <RelationField name="isCreatedBy"
											 path={metadata.properties.find((p) => p.name === "isCreatedBy").quicksearch}
											 onChange={onChange}
											 entity={this.props.entity} />
							: <Relation values={model["@relations"].isCreatedBy} otherValues={otherRelations.isCreatedBy} linkTo="authorIndex"/>
						}
					</li>
					<li className="list-group-item">
						<label>Title</label>
						{ editable
							? <StringField name="title" entity={this.props.entity} onChange={onChange} />
							: <StringComponent value={model.title} otherValue={otherData.title} />
						}
					</li>
					<li className="list-group-item">
						<label>English Title</label>
						{ editable
							? <StringField name="englishTitle" entity={this.props.entity} onChange={onChange} />
							: <StringComponent value={model.englishTitle} otherValue={otherData.englishTitle} />
						}
					</li>
					<li className="list-group-item">
						<label>Document type</label>
						{ editable
							? <SelectField name="documentType" options={metadata.properties.find((p) => p.name === "documentType").options}
										   onChange={onChange} entity={this.props.entity} />
							: <StringComponent value={model.documentType} otherValue={otherData.documentType} />
						}
					</li>
					<li className="list-group-item">
						<label>Genres</label>
						{ editable
							? <KeywordField name="hasGenre" onChange={onChange}
											 options={metadata.properties.find((p) => p.name === "hasGenre").options.sort((a,b) => a.value.localeCompare(b.value))}
											 entity={this.props.entity} />
							: <Relation values={model["@relations"].hasGenre} otherValues={otherRelations.hasGenre} />
						}
					</li>
					<li className="list-group-item">
						<label>Language</label>
						{ editable
							? <RelationField name="hasWorkLanguage"
											 path={metadata.properties.find((p) => p.name === "hasWorkLanguage").quicksearch}
											 onChange={onChange}
											 entity={this.props.entity} />
							: <Relation values={model["@relations"].hasWorkLanguage} otherValues={otherRelations.hasWorkLanguage} />
						}
					</li>
					<li className="list-group-item">
						<label>Publish location</label>
						{ editable
							? <RelationField name="hasPublishLocation"
											path={metadata.properties.find((p) => p.name === "hasPublishLocation").quicksearch}
											onChange={onChange}
											entity={this.props.entity} />
							: <Relation values={model["@relations"].hasPublishLocation} otherValues={otherRelations.hasPublishLocation} />
						}
					</li>
					<li className="list-group-item">
						<label>Date</label>
						{ editable
							? <DatableField name="date" entity={this.props.entity} onChange={onChange} />
							: <StringComponent value={model.date} otherValue={otherData.date} />
						}
					</li>
					<li className="list-group-item">
						<label>Reference</label>
						{ editable
							? <StringField name="reference" onChange={onChange} entity={this.props.entity} />
							: <StringComponent value={model.reference} otherValue={otherData.reference} />
						}
					</li>
					<li className="list-group-item">
						<label>Notes</label>
						{ editable
							? <TextField name="notes" onChange={onChange} entity={this.props.entity} />
							: <TextComponent value={model.notes} otherValue={otherData.notes} />
						}
					</li>
					<li className="list-group-item">
						<label>Persistent ID</label>
						{pid}
					</li>
				</ul>
				<div className="temp-data panel panel-default">
					<h2 className="panel-heading">Temporary data</h2>
					<ul className="list-group">
						<li className="list-group-item">
							<label>Creator</label>
							<span>{model.tempCreator}</span>
						</li>
						<li className="list-group-item">
							<label>Language</label>
							<span>{model.tempLanguage}</span>
						</li>
						<li className="list-group-item">
							<label>Origin</label>
							<span>{model.tempOrigin}</span>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

export default BasicInfo;