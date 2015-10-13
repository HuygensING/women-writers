import React from "react";
import Link from "../link";
class GraphTable extends React.Component {

	makeName(name, i) {
		return <li key={i}>{name.components.map((component) => component.value).join(", ")}</li>;
	}

	renderNames() {
		if(this.props.data.data.names && this.props.data.data.names.length > 0) {
			return (<div>
				<label>Names</label>
				<ul>
					{this.props.data.data.names.map(this.makeName.bind(this))}
				</ul>
			</div>);
		}
		return null;
	}

	renderMD(field, label) {
		if(this.props.data.data[field]) {
			return (<div>
				<label>{label}</label>
				<div>{this.props.data.data[field]}</div>
			</div>);
		}
		return null;
	}

	renderDomainLink() {
		if(this.props.data.data["@variationRefs"]) {
			let found = this.props.data.data["@variationRefs"].filter((varRef) => varRef.type.match(/^ww/));
			if(!found) { return null; }
			if(found[0].type === "wwdocument" || found[0].type === "wwperson") {
				return (<div>
					<Link href={`/${found[0].type.replace(/^ww/, "")}s/${found[0].id}`} onNavigate={this.props.onNavigate} value="Link" />
				</div>);
			}
		}
		return null;
	}

	render() {
		return (
			<ul className="graph-table">
				<li><h4>{this.props.data.data["@type"].toUpperCase()}</h4></li>
				<li>{this.renderMD("title", "Title")}</li>
				<li>{this.renderNames()}</li>
				<li>{this.renderMD("birthDate", "Date of birth")}</li>
				<li>{this.renderMD("deathDate", "Date of death")}</li>
				<li>{this.renderMD("date", "Date")}</li>
				<li>{this.renderDomainLink()}</li>
			</ul>
		);

	}
}

GraphTable.propTypes = {
	data: React.PropTypes.object,
	onNavigate: React.PropTypes.func
};

export default GraphTable;