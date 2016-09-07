import React from "react";
import Select from "hire-forms-select";

class Field extends React.Component {
	render() {
		return (
			<span>
				<Select
					onChange={this.props.onChange.bind(this, [this.props.name])}
					options={this.props.options}
					value={this.props.entity.data[this.props.name]}
				/>
			</span>
		);
	}
}

Field.propTypes = {
	entity: React.PropTypes.object,
	name: React.PropTypes.string,
	onChange: React.PropTypes.func,
	options: React.PropTypes.array
};

export default Field;