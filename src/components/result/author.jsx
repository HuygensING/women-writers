import React from "react";

class Result extends React.Component {

	onSelect() {
		this.props.onSelect({path: "persons/" + this.props.data.data._id});
	}

	render() {
		let residenceLocation = this.props.data.data.residenceLocation ?
			this.props.data.data.residenceLocation.split(";")[0] : null;
		return (<li>
			<label onClick={this.onSelect.bind(this)}>
				<span className="names">{this.props.data.displayName}</span>
				<span className="dates">{this.props.data.data.birthDate} - {this.props.data.data.deathDate}</span>
				<span className="residence-location" title={this.props.data.data.residenceLocation}>
					{residenceLocation}
				</span>
			</label>
		</li>);
	}
}

Result.propTypes = {
	data: React.PropTypes.object,
	onSelect: React.PropTypes.func
};

export default Result;