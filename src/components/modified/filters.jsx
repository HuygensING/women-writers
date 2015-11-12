import React from "react";
import RangeSlider from "hire-range-slider";
import {makeDate} from "./date";

const lowestDate = () => new Date(new Date().setMonth(new Date().getMonth() - 12));
const highestLimit = makeDate(new Date());
const lowestLimit = makeDate(lowestDate());

const makeDays = (value) =>
	(parseInt(("" + value).substr(0, 4)) * 365) +
	(parseInt(("" + value).substr(4, 2)) * 31) +
	parseInt(("" + value).substr(6, 2));

const makeLabel = (value) =>
	("" + value).substr(6, 2) + "-" +
	("" + value).substr(4, 2) + "-" +
	("" + value).substr(0, 4);

const calcRange = (value) => (makeDays(value) - makeDays(lowestLimit)) / (makeDays(highestLimit) - makeDays(lowestLimit));

class ModifiedFilters extends React.Component {

	constructor(props) {
		super(props);
		let {lowerLimit, upperLimit} = this.props.queries.last.facetValues.filter((f) => f.name === "dynamic_i_modified")[0];

		this.state = {
			lowerDate: lowerLimit,
			upperDate: upperLimit,
			lowerLimit: calcRange(lowerLimit),
			upperLimit: calcRange(upperLimit)
		};
	}

	onChange(opts) {
		let lowerDate = lowestDate();
		let upperDate = lowestDate();
		let lowerDays = Math.floor(opts.lowerLimit * (makeDays(highestLimit) - makeDays(lowestLimit)));
		let upperDays = Math.ceil(opts.upperLimit * (makeDays(highestLimit) - makeDays(lowestLimit)));
		lowerDate.setDate(lowerDate.getDate() + lowerDays);
		upperDate.setDate(upperDate.getDate() + upperDays);

		if(opts.refresh) {
			this.props.onSelectFacetRange("dynamic_i_modified", {
				lowerLimit: makeDate(lowerDate),
				upperLimit: makeDate(upperDate)
			});
		} else {
			this.setState({
				lowerDate: makeDate(lowerDate),
				upperDate: makeDate(upperDate),
				lowerLimit: opts.lowerLimit,
				upperLimit: opts.upperLimit
			});
		}
	}

	render() {
		return (
			<div>
				<label style={{float: "right"}}>{makeLabel(this.state.upperDate)}</label>
				<label style={{float: "right"}}>{makeLabel(this.state.lowerDate)} &nbsp;-&nbsp; </label>
				<RangeSlider lowerLimit={this.state.lowerLimit} onChange={this.onChange.bind(this)} upperLimit={this.state.upperLimit} />
			</div>
		);
	}
}

ModifiedFilters.propTypes ={
	onSelectFacetRange: React.PropTypes.func,
	queries: React.PropTypes.object,
	results: React.PropTypes.object
};

export default ModifiedFilters;

