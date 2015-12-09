import React from "react";

class Result extends React.Component {
	onSelectSource() {
		this.props.onSelect({path: "documents/" + this.props.data.sourceData._id});
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
				<li><label onClick={this.onSelectSource.bind(this)}>{sourceData.title}</label></li>
				<li className="created-by">{sourceData.authorName}</li>
				<li><span className="date">{sourceData.date}</span>{sourceData.publishLocation}</li>
			</ul>
			<ul>
				<li>{this.getLabel(this.props.data.relationName)}</li>
			</ul>
			<ul>
				<li><label onClick={this.onSelectTarget.bind(this)}>{targetData.title}</label></li>
				<li className="created-by">{targetData.authorName}</li>
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