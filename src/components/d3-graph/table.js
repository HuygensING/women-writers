import React from "react";
import { Link } from "react-router";
import { urls } from "../../router";


class GraphTable extends React.Component {

	makeName(name, i) {
		return <li className="list-group-item" key={i}>{name.components.map((component) => component.value).join(" ")}</li>;
	}

	renderNames() {
		if(this.props.data.data.names && this.props.data.data.names.length > 0) {
			return (<li className="list-group-item">
				<label>Names</label>
				<ul className="list-group">
					{this.props.data.data.names.map(this.makeName.bind(this))}
				</ul>
			</li>);
		} else if(this.props.data.data.tempName) {
			return (<li className="list-group-item">
				<label>Names</label>
				<ul className="list-group">
					<li className="list-group-item">{this.props.data.data.tempName}</li>
				</ul>
			</li>);
		}
		return null;
	}

	renderMD(field, label) {
		if(this.props.data.data[field]) {
			return (<li className="list-group-item">
				<label>{label}</label>
				<div>{this.props.data.data[field]}</div>
			</li>);
		}
		return null;
	}

	linkText() {
		return this.props.data.data.names && this.props.data.data.names.length ?
		"More " + this.props.data.data.names[0].components.map((component) => component.value).join(" ") :
			(this.props.data.data.title || this.props.data.data.tempName ? "More " + (this.props.data.data.title || this.props.data.data.tempName) : "More");
	}

	renderDomainLink() {
		if(this.props.data.data["@variationRefs"]) {
			let found = this.props.data.data["@variationRefs"].filter((varRef) => varRef.type.match(/^ww/));
			if(!found.length) { return null; }
			if(found[0].type === "wwdocument" || found[0].type === "wwperson") {
				const url = found[0].type === "wwdocument" ?
					urls.publicationIndex(found[0].id) :
					urls.authorIndex(found[0].id);
				return (<li className="list-group-item">
					<Link to={url}>{this.linkText()}</Link>
				</li>);
			}
		}
		return null;
	}

	render() {
		return (
			<ul className="graph-table list-group">
				<li className="list-group-item"><h4>{this.props.data.data["@type"].replace(/^ww/, "").toUpperCase()}</h4></li>
				{this.renderMD("title", "Title")}
				{this.renderNames()}
				{this.renderMD("birthDate", "Date of birth")}
				{this.renderMD("deathDate", "Date of death")}
				{this.renderMD("date", "Date")}
				{this.renderDomainLink()}
			</ul>
		);

	}
}

GraphTable.propTypes = {
	data: React.PropTypes.object,
	onNavigate: React.PropTypes.func
};

export default GraphTable;