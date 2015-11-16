import React from "react";
import {makeLabel} from "./date";


class ModifiedResult extends React.Component {

	onSelect() {
		let path = this.props.data.data.title ? "documents" : "persons";
		this.props.onSelect({path: path + "/" + this.props.data.data._id});
	}

	render() {
		return (<li onClick={this.onSelect.bind(this)}>
			<label>
				{this.props.data.data.title || this.props.data.displayName}
				<span className="modified-date">
					{this.props.data.data.modified_date ? makeLabel(this.props.data.data.modified_date) : null}
				</span>
			</label>
		</li>);
	}
}

ModifiedResult.propTypes = {
	data: React.PropTypes.object,
	onSelect: React.PropTypes.func
};


export default ModifiedResult;