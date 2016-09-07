import React from "react";

const formatDate = (ts) => {
	let date = new Date(ts);
	return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
};

class ModifiedBy extends React.Component {

	render() {

		return this.props.username ?
			<div className="modified-by">{this.props.label} {this.props.username} on {formatDate(this.props.timeStamp)}</div> :
				this.props.userId ?
				<div className="modified-by">{this.props.label} {this.props.userId} on {formatDate(this.props.timeStamp)}</div> :
			null;
	}
}

ModifiedBy.propTypes = {
	label: React.PropTypes.string,
	timeStamp: React.PropTypes.number,
	username: React.PropTypes.string
};

export default ModifiedBy;