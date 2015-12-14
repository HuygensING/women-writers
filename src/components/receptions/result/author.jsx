import React from "react";

class Result extends React.Component {

	onSelectSource() {
		this.props.onSelect({path: "persons/" + this.props.data.sourceData._id});
	}

	onSelectTarget() {
		this.props.onSelect({path: "documents/" + this.props.data.targetData._id});
	}

	getLabel(relationName) {
		return this.props.labels.facetValues.dynamic_s_relation[relationName] ?
			this.props.labels.facetValues.dynamic_s_relation[relationName] :
			relationName;
	}

	render() {
		let sourceData = this.props.data.sourceData;
		let targetData = this.props.data.targetData;

		return (<li>
			<ul>
				<li><label onClick={this.onSelectSource.bind(this)}>{sourceData.name}</label></li>
				<li className="created-by">{sourceData.birthDate} - {sourceData.deathDate}</li>
				<li><span className="date">{sourceData.residenceLocation}</span>{sourceData.gender}</li>
			</ul>
			<ul>
				<li>{this.getLabel(this.props.data.relationName)}</li>
			</ul>
			<ul>
				<li className="created-by">{targetData.authorName}</li>
				<li><label onClick={this.onSelectTarget.bind(this)}>{targetData.title}</label></li>
				<li><span className="date">{targetData.date}</span>{targetData.publishLocation}</li>
			</ul>
		</li>);
	}
}

Result.propTypes = {
	data: React.PropTypes.object,
	labels: React.PropTypes.object,
	onSelect: React.PropTypes.func
};

export default Result;