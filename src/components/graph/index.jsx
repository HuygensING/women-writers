import React from "react";
import cx from "classnames";
import ForceDirectedGraph from "hire-force-directed-graph";
import GraphTable from "./table";

class GraphController extends React.Component {

	constructor(props) {
		super(props);
		this.renderedGraph = null;
		this.state = {
			hideRelationLabels: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.id !== this.props.id) {
			this.renderedGraph = null;
		}
	}


	onEntityClick(obj) {
		if(obj.type === "person" || obj.type === "document") {
			this.props.onEntityClick(obj);
		}
	}

	onNodeClick(obj) {
		this.props.onNavigate(`/graph/${obj.key}`);
	}

	renderGraph() {
		this.renderedGraph = this.renderedGraph ||
			<ForceDirectedGraph data={this.props.data} onEntityClick={this.onEntityClick.bind(this)} onNodeClick={this.onNodeClick.bind(this)} />;
		return this.renderedGraph;
	}

	toggleRelationLabels() {
		this.setState({hideRelationLabels: !this.state.hideRelationLabels});
	}

	render() {
		let table = this.props.table !== null ?
			<GraphTable data={this.props.table} onNavigate={this.props.onNavigate} /> :
			null;
		return this.props.data === null ?
			(<div className={cx("graph", {visible: this.props.visible})}>Loading</div>)
			:
			(
				<div className={cx("graph", {visible: this.props.visible, "hide-relation-labels": this.state.hideRelationLabels})}>
					{table}
					<button onClick={this.toggleRelationLabels.bind(this)} style={{position: "absolute", right: "260px", top: "28px"}}>
						{this.state.hideRelationLabels ? "Show relation labels" : "Hide relation labels"}
					</button>
					{this.renderGraph()}
				</div>
			);
	}
}

GraphController.propTypes = {
	data: React.PropTypes.object,
	id: React.PropTypes.string,
	onEntityClick: React.PropTypes.func,
	onNavigate: React.PropTypes.func,
	table: React.PropTypes.object,
	visible: React.PropTypes.bool
};

export default GraphController;
