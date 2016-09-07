import React from "react";
import { urls } from "../../../router";
import { Link } from "react-router";

class AuthorReceptionPageLinks extends React.Component {


	render() {
		const { entity, authorReceptionPages } = this.props;

		const pageIndex = authorReceptionPages.indexOf(entity.data._id);
		const prevPublication = pageIndex > -1 && pageIndex > 0 ?
			<Link className="btn btn-default" to={urls.authorReceptionIndex(authorReceptionPages[pageIndex - 1])}>◂ Previous</Link> : null;

		const nextPublication = pageIndex > -1 && pageIndex < authorReceptionPages.length - 1 ?
			<Link className="btn btn-default" to={urls.authorReceptionIndex(authorReceptionPages[pageIndex + 1])}>Next ▸</Link> : null;


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

export default AuthorReceptionPageLinks;