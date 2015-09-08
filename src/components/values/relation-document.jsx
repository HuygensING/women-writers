import React from "react";
import Link from "../link";

class DocumentRelation extends React.Component {
	render() {
		if (!this.props.values.length) {
			return <span>-</span>;
		}

		let relations = this.props.values.map((v, index) => {
			return (
				<li key={index}>
					<Link
						href={`/documents/${v.key.substr(v.key.lastIndexOf("/") + 1)}`}
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
	values: React.PropTypes.array
};

DocumentRelation.defaultProps = {
	values: []
};

export default DocumentRelation;