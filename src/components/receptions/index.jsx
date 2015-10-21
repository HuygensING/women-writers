import React from "react";
import cx from "classnames";
import {Tabs, Tab} from "hire-tabs";
import ReceptionSearch from "./reception-search";


class ReceptionsController extends React.Component {

	render() {
		return (
			<div className={cx("receptions", {visible: this.props.visible})}>
				<Tabs onChange={this.props.onTabChange}>
					<Tab
						active={this.props.tab === "authors"}
						label="Authors">
						<ReceptionSearch
							{...this.props.receptions.author}
							activeFacets={this.props.authors.activeFacets}
							activeQuery={this.props.authors.query}
							onSelect={this.props.onSelect}
							onUnsetFacetValue={this.props.onUnsetAuthorFacetValue}
							onUnsetFullTextField={this.props.onUnsetAuthorFullTextField}
							onVisible={this.props.onShowAuthorReceptions}
							type="authors"
							visible={this.props.visible && this.props.tab === "authors"}
						/>
					</Tab>
					<Tab
						active={this.props.tab === "publications"}
						label="Publications">
						<ReceptionSearch
							{...this.props.receptions.publication}
							activeFacets={this.props.publications.activeFacets}
							activeQuery={this.props.publications.query}
							onSelect={this.props.onSelect}
							onUnsetFacetValue={this.props.onUnsetPublicationFacetValue}
							onUnsetFullTextField={this.props.onUnsetPublicationFullTextField}
							onVisible={this.props.onShowPublicationReceptions}
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