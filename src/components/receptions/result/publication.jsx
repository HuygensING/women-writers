import React from "react";

class Result extends React.Component {
	onSelectSource() {
		this.props.onSelect({path: "documents/" + this.props.data.sourceData._id});
	}

	onSelectTarget() {
		this.props.onSelect({path: "documents/" + this.props.data.targetData._id});
	}

	render() {
		let sourceData = this.props.data.sourceData;
		let targetData = this.props.data.targetData;
		return (<li>
			<ul>
				<li><label onClick={this.onSelectSource.bind(this)}>{sourceData.title}</label></li>
				<li>{sourceData.createdBy}</li>
				<li>{sourceData.date} {sourceData.publishLocation}</li>
			</ul>
			<ul>
				<li>{this.props.data.relationName}</li>
			</ul>
			<ul>
				<li><label onClick={this.onSelectTarget.bind(this)}>{targetData.title}</label></li>
				<li>{targetData.createdBy}</li>
				<li>{targetData.date} {targetData.publishLocation}</li>
			</ul>
		</li>);
	}
}

Result.propTypes = {
	data: React.PropTypes.object,
	onSelect: React.PropTypes.func
};

export default Result;