import React from "react";

class ReceptionSearch extends React.Component {

	componentWillReceiveProps(nextProps) {
		if(nextProps.visible && nextProps.pendingSearchId) {
			console.log("ReceptionSearch visible with pendingSearchId: ", this.props.type);
			this.props.onVisible(nextProps.pendingSearchId)
		}
	}

	render() {
		return <span>{JSON.stringify(this.props)}</span>;
	}
}

ReceptionSearch.propTypes = {
	type: React.PropTypes.string,
	onVisible: React.PropTypes.func
}

export default ReceptionSearch;