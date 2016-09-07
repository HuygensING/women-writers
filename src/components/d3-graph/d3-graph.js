import React from "react";
import ForceDirectedGraph from "hire-force-directed-graph";
import GraphTable from "./table";
import cx from "classnames";

class D3Graph extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hideRelationLabels: false
		};
	}

	componentDidMount() {
		const {graph, params: { id, collection }, onFetchGraph} = this.props;

		// If the requested id from the route does not match the data, or if there is no data
		if ((!graph.id && id) || (id && graph.id !== id) ) {
			// Fetch the correct author based on the id.
			onFetchGraph(collection, id);
		}
	}

	componentWillReceiveProps(nextProps) {
		const { onFetchGraph } = this.props;
		// Triggers fetch data from server based on id from route.
		if (this.props.params.id !== nextProps.params.id) {
			onFetchGraph(nextProps.params.collection, nextProps.params.id);
		}
	}


	toggleRelationLabels() {
		this.setState({hideRelationLabels: !this.state.hideRelationLabels});
	}

	onCheckChange(ev) {
		const { graph: { data }, onGraphRelationTypeChange } = this.props;

		const newRelationTypes = data.relationTypes.map((rlt) => {
			return {
				checked: rlt.name === ev.target.id ? !rlt.checked : rlt.checked,
				name: rlt.name
			};
		});
		onGraphRelationTypeChange(newRelationTypes);
	}

	render() {
		const { graph: { data, table }, onSelectGraph, onFetchGraphTable } = this.props;
		if (!data) { return null; }

		const checkBoxes = data.relationTypes.sort((a, b) => a.name.localeCompare(b.name)).map((rlt, i) => (
			<li className="list-group-item" key={i}><input checked={rlt.checked} id={rlt.name} onChange={this.onCheckChange.bind(this)} type="checkbox" /><label htmlFor={rlt.name}>{rlt.name}</label></li>
		));

		return (
			<div className={cx("graph", {"hide-relation-labels": this.state.hideRelationLabels})} style={{height: window.innerHeight - 180}}>
				<GraphTable data={table} />
				<ul className="checkboxes list-group">
					<li className="list-group-item"><h4>Relation types</h4></li>
					{checkBoxes}
					<li className="list-group-item">
					<button onClick={this.toggleRelationLabels.bind(this)}>
						{this.state.hideRelationLabels ? "Show relation labels" : "Hide relation labels"}
					</button>
					</li>
				</ul>

				<ForceDirectedGraph data={data}
									onEntityClick={(node) => onFetchGraphTable(node.type + "s", node.key.replace(/.*\//, ""))}
									onNodeClick={(node) => onSelectGraph(node.type + "s", node.key.replace(/.*\//, ""))}/>
			</div>
		);
	}
}

export default D3Graph;