import React from "react";

class PublicationHeader extends React.Component {
	render() {
		return (
			<header className="page">
				<h2>
					{this.props.publication.title}
				</h2>
			</header>
		);
	}
}

export default PublicationHeader;