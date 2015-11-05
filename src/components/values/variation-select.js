import React from "react";
import Select from "hire-forms-select";

class VariationSelect extends React.Component {
	onSelectVariation(type) {
		let found = (this.props.variationRefs || []).filter((v) => v.type === type);
		if (found.length) {
			this.props.onSelectVariation(type, found[0].id);
		} else {
			this.props.onSelectVariation(null);
		}
	}

	render() {
		let variations = (this.props.variationRefs || []).filter((v) => v.type !== "wwperson").map((v) => v.type);
		if(variations.length) {
			return (<Select
				onChange={this.onSelectVariation.bind(this)}
				options={["Show other data", ...variations]}
				value={this.props.showVariation ? this.props.showVariation : "Show other data"}
			/>);
		} else {
			return null;
		}
	}
}

VariationSelect.propTypes = {
	onSelectVariation: React.PropTypes.func,
	showVariation: React.PropTypes.string,
	variationRefs: React.PropTypes.array
};


export default VariationSelect;