import React from "react";
import cx from "classnames";
import config from "../../config";
import FacetedSearch from "hire-faceted-search";
import ModifiedFilters from "./filters";
import ModifiedResult from "./result";
import {makeDate} from "./date";


class ModifiedController extends React.Component {


	render() {
		let now = makeDate(new Date());
		let twoMonthsAgo = makeDate(new Date(new Date().setMonth(new Date().getMonth() - 2)));

		return (
			<div className={cx("last-modified",	{visible: this.props.visible})}>
				<div className="modified-authors">
					<header>Authors</header>
					<FacetedSearch
						config={{
							baseURL: config.baseUrl,
							searchPath: "/search/wwpersons",
							headers: {
								VRE_ID: "WomenWriters",
								Accept: "application/json"
							}
						}}
						customComponents={{
							filters: ModifiedFilters,
							result: ModifiedResult
						}}
						facetList={["dynamic_i_modified"]}
						numberedResults={true}
						onSelect={this.props.onSelect}
						query={{
							facetValues: [{name: "dynamic_i_modified", lowerLimit: twoMonthsAgo, upperLimit: now}],
							sortParameters: [{ fieldname: "dynamic_k_modified", direction: "desc"}]
						}}
					/>
				</div>
				<div className="modified-publications">
					<header>Publications</header>
					<FacetedSearch
						config={{
							baseURL: config.baseUrl,
							searchPath: "/search/wwdocuments",
							headers: {
								Accept: "application/json",
								VRE_ID: "WomenWriters"
							}
						}}
						customComponents={{
							filters: ModifiedFilters,
							result: ModifiedResult
						}}
						facetList={["dynamic_i_modified"]}
						numberedResults={true}
						onSelect={this.props.onSelect}
						query={{
							facetValues: [{name: "dynamic_i_modified", lowerLimit: twoMonthsAgo, upperLimit: now}],
							sortParameters: [{ fieldname: "dynamic_k_modified", direction: "desc"}]
						}}
					/>
				</div>
			</div>
		);
	}
}

ModifiedController.propTypes = {
	onSelect: React.PropTypes.func,
	visible: React.PropTypes.bool
};

export default ModifiedController;