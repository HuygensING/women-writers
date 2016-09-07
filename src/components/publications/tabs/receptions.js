import publicationReceptionDefinitions from "../../../definitions/publication-receptions";
import authorReceptionDefinitions from "../../../definitions/author-receptions";
import React from "react";
import RelationList from "../../values/relation-list";
import RelationField from "../../form-fields/relation";

class Receptions extends React.Component {

	renderReceptionList(inboundOrOutboundReceptions, labels, linkTo = this.props.linkToView) {

		return inboundOrOutboundReceptions.map((receptionType, j) => {
			const receptions = (this.props.entity.data["@relations"][receptionType] || [])
				.sort((a, b) => a.displayName.localeCompare(b.displayName));
			return receptions.length ? (
				<RelationList
					key={j}
					label={labels[receptionType]}
					relations={receptions}
					linkTo={linkTo}
				/>
			) : null;
		});
	}

	renderReceptionEdit(inboundOrOutboundReceptions, labels) {
		const { onChange, metadata } = this.props;

		return inboundOrOutboundReceptions.map((receptionType, i) => (
			<li className="list-group-item" key={i}>
				<label>{labels[receptionType]}</label>
				<RelationField name={receptionType}
							   path={metadata.properties.find((p) => p.name === receptionType).quicksearch}
							   onChange={onChange} entity={this.props.entity}
				/>
			</li>
		));
	}

	render() {

		const listIsEmpty = publicationReceptionDefinitions.outBound
				.concat(publicationReceptionDefinitions.inBound)
				.concat(authorReceptionDefinitions.inBound)
				.map((receptionType) => (this.props.entity.data["@relations"][receptionType] || []))
				.filter((receptions) => receptions.length > 0)
				.length === 0;

		const hasOutBound = publicationReceptionDefinitions.outBound
				.map((receptionType) => (this.props.entity.data["@relations"][receptionType] || []))
				.filter((receptions) => receptions.length > 0)
				.length > 0;

		const hasInbound = publicationReceptionDefinitions.inBound
				.map((receptionType) => (this.props.entity.data["@relations"][receptionType] || []))
				.filter((receptions) => receptions.length > 0)
				.length > 0;

		const hasAuthorInbound = authorReceptionDefinitions.inBound
				.map((receptionType) => (this.props.entity.data["@relations"][receptionType] || []))
				.filter((receptions) => receptions.length > 0)
				.length > 0;

		const { editable } = this.props;

		if (editable) {
			return (
				<ul className="list-group">
					<li className="list-group-item">
						<h3>Publication has receptions</h3>
					</li>
					{this.renderReceptionEdit(publicationReceptionDefinitions.outBound, publicationReceptionDefinitions.overviewLabels)}
					<li className="list-group-item">
						<h3>Publication is a reception of</h3>
					</li>
					{this.renderReceptionEdit(publicationReceptionDefinitions.inBound, publicationReceptionDefinitions.overviewLabels)}
					<li className="list-group-item">
						<h3>Publication is a reception of author</h3>
					</li>
					{this.renderReceptionEdit(authorReceptionDefinitions.inBound, authorReceptionDefinitions.overviewLabels)}
				</ul>
			);
		} else {
			return listIsEmpty ? (
				<ul className="list-group">
					<li className="list-group-item">The list is empty</li>
				</ul>
			) : (
				<ul className="list-group">
					{hasOutBound ? (
						<li className="list-group-item">
							<h3>Publication has receptions</h3>
						</li>
					) : null }
					{this.renderReceptionList(publicationReceptionDefinitions.outBound, publicationReceptionDefinitions.overviewLabels)}
					{hasInbound ? (
						<li className="list-group-item">
							<h3>Publication is a reception of</h3>
						</li>
					) : null }
					{this.renderReceptionList(publicationReceptionDefinitions.inBound, publicationReceptionDefinitions.overviewLabels)}
					{hasAuthorInbound ? (
						<li className="list-group-item">
							<h3>Publication is a reception of author</h3>
						</li>
					) : null }
					{this.renderReceptionList(authorReceptionDefinitions.inBound, authorReceptionDefinitions.overviewLabels, "authorIndex")}
				</ul>
			);
		}
	}
}


export default Receptions;
