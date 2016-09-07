import React from "react";
import TextArea from "hire-forms-textarea";

class TextField extends React.Component {
	render() {
		return (
			<span>
				<TextArea
					onChange={this.props.onChange.bind(this, [this.props.name])}
					value={this.props.entity.data[this.props.name] || ""}
				/>
			</span>
		);
	}
}

TextField.propTypes = {
	entity: React.PropTypes.object,
	name: React.PropTypes.string,
	onChange: React.PropTypes.func
};

export default TextField;