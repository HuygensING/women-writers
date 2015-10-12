import React from "react";
import cx from "classnames";
import ForceDirectedGraph from "hire-force-directed-graph";


class GraphController extends React.Component {
	onEntityClick(obj) {
		if(obj.type === "person" || obj.type === "document") {
			console.log("SHOW A TABLE HERE FOR", obj);
		}
	}

	onNodeClick(obj) {
		this.props.onNavigate(`/graph/${obj.key}`);
	}

	render() {
		return this.props.data === null ?
		(<div className={cx("graph", {visible: this.props.visible})}>Loading</div>)
			:
		(
			<div className={cx("graph", {visible: this.props.visible})}>
				<ForceDirectedGraph
					data={this.props.data}
					onEntityClick={this.onEntityClick.bind(this)}
					onNodeClick={this.onNodeClick.bind(this)} />
			</div>
		);
	}
}

GraphController.propTypes = {
	data: React.PropTypes.object,
	onNavigate: React.PropTypes.func,
	visible: React.PropTypes.bool
};

export default GraphController;
