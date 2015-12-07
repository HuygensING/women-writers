import React from "react";
import Link from "../../link";

const receptionOfRelations = [
	"isEditionOf",
	"isSequelOf",
	"isTranslationOf",
	"isAdaptationOf",
	"isPlagiarismOf",
	"hasAnnotationsOn",
	"isBibliographyOf",
	"isCensoringOf",
	"commentsOnWork",
	"isAnthologyContaining",
	"isCopyOf",
	"isAwardForWork",
	"isPrefaceOf",
	"isIntertextualTo",
	"listsWork",
	"mentionsWork",
	"isParodyOf",
	"quotesWork",
	"referencesWork"
];

class PublicationHeader extends React.Component {
	render() {
		let receptionOf = Object.keys(this.props.publication["@relations"]).filter((relName) => receptionOfRelations.indexOf(relName) > -1);
		let receptions = receptionOf.length ? receptionOf
			.map((relName) => this.props.publication["@relations"][relName])
			.reduce((a, b) => a.concat(b), []) :
			null;

		let receptionTag = receptions ?
			<small className="receptions">
				<span>Reception on</span>
				<span>
					<ul className="relation">
						{ receptions.map((reception, i) => (
							<li key={i}>
								<Link href={reception.key.replace("domain/ww", "")} onNavigate={this.props.onNavigate} value={reception.value} />
							</li>
						))}
					</ul>
				</span>
			</small> :
			null;

		return (
			<header className="page">
				<h2 title={this.props.publication.title}>
					<span>{this.props.publication.title}</span>
					{receptionTag}
				</h2>
			</header>
		);
	}
}

PublicationHeader.propTypes = {
	onNavigate: React.PropTypes.func,
	publication: React.PropTypes.object
};

export default PublicationHeader;