import React from "react";

class PublicationHeader extends React.Component {
	render() {
		return (
			<header className="page">
				<h2 title={this.props.publication.title}>
					<span>{this.props.publication.title}</span>
				</h2>
			</header>
		);
	}
}

PublicationHeader.propTypes = {
	publication: React.PropTypes.object
};

export default PublicationHeader;