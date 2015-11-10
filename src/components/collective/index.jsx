import React from "react";
import cx from "classnames";

class CollectiveController extends React.Component {

	render() {
		return (
			<div
				className={cx(
					"collective",
					{visible: this.props.visible}
				)}>
				Show collective
			</div>
		);
	}
}

CollectiveController.propTypes = {
	visible: React.PropTypes.bool
};

export default CollectiveController;
