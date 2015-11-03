import React from "react";

class VariationData extends React.Component {

	renderObjectData(data = this.props.data) {

		return (Object.keys(data) || []).map((k, i) => (
			<li key={i}>{k.match(/^[0-9]$/) ? "" : k + ":"}{typeof data[k] === "object" && data[k] !== null ? <ul>{this.renderObjectData(data[k])}</ul> : data[k]}</li>
		));
	}

	render() {
		return (<div className="variation-data">
			{this.renderObjectData()}
		</div>);
	}
}

VariationData.propTypes = {
	data: React.PropTypes.object
};


export default VariationData;