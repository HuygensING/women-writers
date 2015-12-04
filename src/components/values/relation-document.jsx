import React from "react";
import Link from "../link";

class DocumentRelation extends React.Component {
	render() {
		if (!this.props.values.length) {
			return <span>-</span>;
		}

		let relations = this.props.values
			.sort((a, b) => {
				return a.isReceptionOf && !b.isReceptionOf ? -1 :
					b.isReceptionOf && !a.isReceptionOf ? 1 :
					a.value.localeCompare(b.value);
			})
			.map((v, index) => {
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
			let receptionData = v.isReceptionOf ?
				<div className="reception-data">
					{v.isReceptionOf.map((receptionOf) =>
						<Link
							href={`/documents/${receptionOf.sourceId}`}
							onNavigate={this.props.onNavigate}
							value={receptionOf.receptionTitle} />
					)}
				</div> : null;
			return (
				<li key={index}>
					{button}
					<Link
						href={`/documents/${id}`}
						onNavigate={this.props.onNavigate}
						value={v.value} />
					{receptionData}
				</li>
			);
		});

		return (
			<span>
				<ol className="relation document-relation">
					{relations}
				</ol>
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