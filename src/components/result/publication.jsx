import React from "react";

class Result extends React.Component {

	onSelect() {
		this.props.onSelect({path: "documents/" + this.props.data.data._id});
	}

	render() {

		return (<li>
			<label onClick={this.onSelect.bind(this)}>
				<span className="author-name" title={this.props.data.data.authorName}>
					{this.props.data.data.authorName}
				</span>
				<span className="title">{this.props.data.data.title} ({this.props.data.data.date})</span>
			</label>
		</li>);
	}
}

Result.propTypes = {
	data: React.PropTypes.object,
	onSelect: React.PropTypes.func
};

export default Result;