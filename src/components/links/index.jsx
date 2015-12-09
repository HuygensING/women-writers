import React from "react";

class Links extends React.Component {
	render() {
		let links;

		if (this.props.values.length) {

			links = this.props.values.map((link, index) =>
				<li key={link.url + index}>
					<a href={link.url}>{link.label}</a>
				</li>
			);

			links = <ul>{links}</ul>;
		} else {
			links = <div className="hire-empty-list">The list of links is empty.</div>;
		}

		return links;
	}
}

Links.propTypes = {
	values: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			url: React.PropTypes.string,
			label: React.PropTypes.string
		})
	)
};

Links.defaultProps = {
	values: []
};

export default Links;