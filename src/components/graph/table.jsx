import React from "react";
import Link from "../link";
class GraphTable extends React.Component {

	makeName(name, i) {
		return <li key={i}>{name.components.map((component) => component.value).join(", ")}</li>;
	}

	renderNames() {
		if(this.props.data.names) {
			return (<div>
				<label>Names</label>
				<ul>
					{this.props.data.names.map(this.makeName.bind(this))}
				</ul>
			</div>);
		}
		return null;
	}

	renderTitle() {
		if(this.props.data.title) {
			return (<div>
				<label>Title</label>
				<div>{this.props.data.title}</div>
			</div>);
		}
		return null;
	}

	renderDomainLink() {
		if(this.props.data["@variationRefs"]) {

			let found = this.props.data["@variationRefs"].filter((varRef) => varRef.type.match(/^ww/));
			if(!found) { return null; }

			return (<div>
				<Link href={`/${found[0].type.replace(/^ww/, "")}s/${found[0].id}`} onNavigate={this.props.onNavigate} value="Link" />
			</div>);
		}
		return null;
	}

	render() {
		return (
			<div style={{position: "absolute", width: "200px"}}>
				{this.renderTitle()}
				{this.renderNames()}
				{this.renderDomainLink()}
			</div>
		);

	}
}

GraphTable.propTypes = {
	data: React.PropTypes.object,
	onNavigate: React.PropTypes.func
};

export default GraphTable;