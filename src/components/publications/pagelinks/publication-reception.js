import React from "react";
import { urls } from "../../../router";
import { Link } from "react-router";

class PublicationReceptionPageLinks extends React.Component {

	render() {
		const { entity, publicationReceptionPages } = this.props;

		const pageIndex = publicationReceptionPages.receptionIds.indexOf(entity.data._id);
		const otherPageIndex = publicationReceptionPages.documentIds.indexOf(entity.data._id);

		if (pageIndex > -1) {
			const nextPublication = pageIndex < publicationReceptionPages.receptionIds.length - 1 ?
				<Link className="btn btn-default"
					  to={urls.publicationReceptionIndex(publicationReceptionPages.receptionIds[pageIndex + 1])}>Next ▸</Link> : null;

			const prevPublication = pageIndex > 0 ?
				<Link className="btn btn-default"
					  to={urls.publicationReceptionIndex(publicationReceptionPages.receptionIds[pageIndex - 1])}>◂ Previous</Link> : null;


			return (
				<div className="col-md-3">
					<div className="btn-group pull-right">
						{prevPublication}
						{nextPublication}
					</div>
				</div>
			);
		} else if (otherPageIndex > -1) {
			const nextPublication = otherPageIndex < publicationReceptionPages.documentIds.length - 1 ?
				<Link className="btn btn-default"
					  to={urls.publicationReceptionIndex(publicationReceptionPages.documentIds[otherPageIndex + 1])}>Next ▸</Link> : null;

			const prevPublication = otherPageIndex > 0 ?
				<Link className="btn btn-default"
					  to={urls.publicationReceptionIndex(publicationReceptionPages.documentIds[otherPageIndex - 1])}>◂ Previous</Link> : null;


			return (
				<div className="col-md-3">
					<div className="btn-group pull-right">
						{prevPublication}
						{nextPublication}
					</div>
				</div>
			);
		}

		return null;
	}
}

export default PublicationReceptionPageLinks;