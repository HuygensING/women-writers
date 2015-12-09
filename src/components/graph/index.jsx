import React from "react";
import cx from "classnames";
import ForceDirectedGraph from "hire-force-directed-graph";
import GraphTable from "./table";
import isEqual from "lodash.isequal";

class GraphController extends React.Component {

	constructor(props) {
		super(props);
		this.renderedGraph = null;
		this.state = {
			hideRelationLabels: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.id !== this.props.id || !isEqual(nextProps.data.relationTypes, this.props.data.relationTypes)) {
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

	onCheckChange(ev) {
		let newRelationTypes = this.props.data.relationTypes.map((rlt) => {
			return {
				checked: rlt.name === ev.target.id ? !rlt.checked : rlt.checked,
				name: rlt.name
			};
		});
		this.props.onRelationsChange(newRelationTypes);
	}

	render() {
		let table = this.props.table !== null ?
			<GraphTable data={this.props.table} onNavigate={this.props.onNavigate} /> :
			null;
		let checkBoxes = this.props.data.relationTypes.sort((a, b) => a.name.localeCompare(b.name)).map((rlt, i) => (
			<div key={i}><input checked={rlt.checked} id={rlt.name} onChange={this.onCheckChange.bind(this)} type="checkbox" /><label htmlFor={rlt.name}>{rlt.name}</label></div>
		));
		return this.props.data === null ?
			(<div className={cx("graph", {visible: this.props.visible})}>Loading</div>)
			:
			(
				<div className={cx("graph", {visible: this.props.visible, "hide-relation-labels": this.state.hideRelationLabels})}>
					{table}
					<div className="checkboxes">
						<h4>Relation types</h4>
						{checkBoxes}
						<button onClick={this.toggleRelationLabels.bind(this)}>
							{this.state.hideRelationLabels ? "Show relation labels" : "Hide relation labels"}
						</button>
					</div>
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
	onRelationsChange: React.PropTypes.func,
	table: React.PropTypes.object,
	visible: React.PropTypes.bool
};

export default GraphController;
