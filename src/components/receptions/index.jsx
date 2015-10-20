import React from "react";
import cx from "classnames";
import {Tabs, Tab} from "hire-tabs";


class ReceptionsController extends React.Component {

	render() {
		return (
			<div className={cx("receptions", {visible: this.props.visible})}>
				<Tabs onChange={this.props.onTabChange}>
					<Tab
						active={this.props.tab === "authors"}
						label="Authors">
						<span>{JSON.stringify(this.props.receptions.author)}</span>
					</Tab>
					<Tab
						active={this.props.tab === "publications"}
						label="Publications">
						<span>{JSON.stringify(this.props.receptions.publication)}</span>
					</Tab>
				</Tabs>
			</div>
		);
	}
}

ReceptionsController.propTypes = {
	onTabChange: React.PropTypes.func,
	receptions: React.PropTypes.object,
	tab: React.PropTypes.string,
	visible: React.PropTypes.bool
};

export default ReceptionsController;