import React from "react";

const formatDate = (ts) => {
	let date = new Date(ts);
	return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
};

class ModifiedBy extends React.Component {

	render() {

		return this.props.userId ?
			<span className="modified-by">{this.props.label} {this.props.userId} on {formatDate(this.props.timeStamp)}</span> :
			null;
	}
}

ModifiedBy.propTypes = {
	label: React.PropTypes.string,
	timeStamp: React.PropTypes.number,
	userId: React.PropTypes.string
};

export default ModifiedBy;