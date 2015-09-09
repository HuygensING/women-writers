import React from "react";
import Link from "../link";

class DocumentRelation extends React.Component {
	render() {
		if (!this.props.values.length) {
			return <span>-</span>;
		}

		let relations = this.props.values.map((v, index) => {
			let id = v.key.substr(v.key.lastIndexOf("/") + 1);

			let button = (this.props.onRemove != null) ?
				<button
					onClick={this.props.onRemove.bind(
						this,
						this.props.relationName,
						v.key
					)}>
					x
				</button> :
				null;

			return (
				<li key={index}>
					{button}
					<Link
						href={`/documents/${id}`}
						onNavigate={this.props.onNavigate}
						value={v.value} />
				</li>
			);
		});

		return (
			<span>
				<ul className="relation document-relation">
					{relations}
				</ul>
			</span>
		);
	}
}

DocumentRelation.propTypes = {
	onNavigate: React.PropTypes.func,
	onRemove: React.PropTypes.func,
	relationName: React.PropTypes.string,
	values: React.PropTypes.array
};

DocumentRelation.defaultProps = {
	values: []
};

export default DocumentRelation;