import React from "react";
import { urls } from "../../../router";
import { Link } from "react-router";

class PublicationPageLinks extends React.Component {


	render() {
		const { entity, publicationPages } = this.props;

		const pageIndex = publicationPages.indexOf(entity.data._id);
		const nextPublication = pageIndex > -1 && pageIndex < publicationPages.length - 1 ?
			<Link className="btn btn-default" to={urls.publicationIndex(publicationPages[pageIndex + 1])}>Next ▸</Link> : null;

		const prevPublication = pageIndex > -1 && pageIndex > 0 ?
			<Link className="btn btn-default" to={urls.publicationIndex(publicationPages[pageIndex - 1])}>◂ Previous</Link> : null;


		return (
			<div className="col-md-3">
				<div className="btn-group pull-right">
					{prevPublication}
					{nextPublication}
				</div>
			</div>
		);
	}
}

export default PublicationPageLinks;