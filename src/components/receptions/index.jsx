import React from "react";
import cx from "classnames";
import {Tabs, Tab} from "hire-tabs";
import ReceptionSearch from "./reception-search";
import isEqual from "lodash.isequal";

class ReceptionsController extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			authors: this.props.authors.query,
			publications: this.props.publications.query,
			storedQueries: {
				authors: null,
				publications: null
			}
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.visible || nextProps.visible ||
			!isEqual(this.props.authors.query, nextProps.authors.query) ||
			!isEqual(this.props.publications.query, nextProps.publications.query) ||
			!isEqual(this.state, nextState);
	}

	setReceptionQuery(type, results, query) {
		this.setState({[type]: query});
		if(this.props.receptions.awaitingQuery) {
			this.setState({storedQueries: {[this.props.receptions.awaitingQuery.type]: this.props.receptions.awaitingQuery.query}});
		}
	}

	permalink(type) {
		let arr = window.location.href.split("/");
		let query = {
			query: {
				[type]: this.props[type].query,
				receptions: this.state[type]
			},
			type: type
		};

		return arr[0] + "//" + arr[2] + "/womenwriters/vre/stored-search/receptions/" + encodeURIComponent(JSON.stringify(query));
	}

	onPermaClick(ev) {
		ev.target.select();
	}

	render() {
		return (
			<div className={cx("receptions", {visible: this.props.visible})}>
				<Tabs onChange={this.props.onTabChange}>
					<Tab
						active={this.props.tab === "authors"}
						label="Authors">
						<div className="permalink">
							Share / store this search:
							<input onClick={this.onPermaClick.bind(this)} readOnly value={this.permalink("authors")} />
						</div>
						<ReceptionSearch
							{...this.props.receptions.author}
							activeFacets={this.props.authors.activeFacets}
							activeQuery={this.props.authors.query}
							onChange={this.setReceptionQuery.bind(this, "authors")}
							onSelect={this.props.onSelect}
							onUnsetFacetValue={this.props.onUnsetAuthorFacetValue}
							onUnsetFullTextField={this.props.onUnsetAuthorFullTextField}
							onVisible={this.props.onShowAuthorReceptions}
							storedQuery={this.state.storedQueries.authors}
							type="authors"
							visible={this.props.visible && this.props.tab === "authors"}
						/>
					</Tab>
					<Tab
						active={this.props.tab === "publications"}
						label="Publications">
						<div className="permalink">
							Share / store this search:
							<input onClick={this.onPermaClick.bind(this)} readOnly value={this.permalink("publications")} />
						</div>
						<ReceptionSearch
							{...this.props.receptions.publication}
							activeFacets={this.props.publications.activeFacets}
							activeQuery={this.props.publications.query}
							onChange={this.setReceptionQuery.bind(this, "publications")}
							onSelect={this.props.onSelect}
							onUnsetFacetValue={this.props.onUnsetPublicationFacetValue}
							onUnsetFullTextField={this.props.onUnsetPublicationFullTextField}
							onVisible={this.props.onShowPublicationReceptions}
							storedQuery={this.state.storedQueries.publications}
							type="publications"
							visible={this.props.visible && this.props.tab === "publications"}
						/>
					</Tab>
				</Tabs>
			</div>
		);
	}
}

ReceptionsController.propTypes = {
	authors: React.PropTypes.object,
	onSelect: React.PropTypes.func,
	onShowAuthorReceptions: React.PropTypes.func,
	onShowPublicationReceptions: React.PropTypes.func,
	onTabChange: React.PropTypes.func,
	onUnsetAuthorFacetValue: React.PropTypes.func,
	onUnsetAuthorFullTextField: React.PropTypes.func,
	onUnsetPublicationFacetValue: React.PropTypes.func,
	onUnsetPublicationFullTextField: React.PropTypes.func,
	publications: React.PropTypes.object,
	receptions: React.PropTypes.object,
	tab: React.PropTypes.string,
	visible: React.PropTypes.bool
};

export default ReceptionsController;