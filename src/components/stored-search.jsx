import React from "react";
import cx from "classnames";
import Loader from "./icons/loader";


class StoredSearchController extends React.Component {

	render() {
		return (
			<div className={cx({visible: this.props.visible, "stored-search": true})}>
				<Loader />
			</div>
		);
	}
}

StoredSearchController.propTypes = {
	visible: React.PropTypes.bool
};

export default StoredSearchController;