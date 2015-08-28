import React from "react";

import RelationAuthor from "../../values/relation-person";

class PublicationHeader extends React.Component {
	render() {
		return (
			<header className="page">
				<h2>
					{this.props.publication.get("title")}
				</h2>
			</header>
		);
	}
}

export default PublicationHeader;