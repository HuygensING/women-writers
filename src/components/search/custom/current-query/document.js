import React from "react";
import cx from "classnames";

class CurrentQuery extends React.Component {

	removeListFacetValue(field, values, value, changeFunc) {
		const foundIdx = values.indexOf(value);
		if (foundIdx > -1) {
			changeFunc(field, values.filter((v, i) => i !== foundIdx));
		}
	}

	removeRangeFacetValue(field, changeFunc) {
		changeFunc(field, []);
	}

	removeTextValue(field, changeFunc) {
		changeFunc(field, "");
	}

	renderFieldValues(searchField, changeFunc = this.props.onChange) {
		const { bootstrapCss } = this.props;

		switch (searchField.type) {
			case "list-facet": return searchField.value.map((val, i) => (
					<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})} key={i}
						onClick={() => this.removeListFacetValue(searchField.field, searchField.value, val, changeFunc)}>
						{val}
						<a>{bootstrapCss ? <span className="glyphicon glyphicon-remove-sign"></span> : "❌"}</a>
					</span>
				));

			case "range-facet": return (
				<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})}
					onClick={() => this.removeRangeFacetValue(searchField.field, changeFunc)}>
					{searchField.value[0]} - {searchField.value[1]}
					<a>{bootstrapCss ? <span className="glyphicon glyphicon-remove-sign"></span> : "❌"}</a>
				</span>
			);

			case "text": return (
				<span className={cx({"label": bootstrapCss, "label-default": bootstrapCss})}
					onClick={() => this.removeTextValue(searchField.field, changeFunc)}>
					{searchField.value.replace(/^\(/, "").replace(/\)$/, "")}
					<a>{bootstrapCss ? <span className="glyphicon glyphicon-remove-sign"></span> : "❌"}</a>
				</span>
			);
		}
		return null;
	}

	render() {
		const { bootstrapCss, query, onPersonQueryChange } = this.props;

		const searchFields = query.searchFields
			.filter((searchField) => searchField.value && searchField.value.length > 0);

		const personSearchFields = (query.filters || [])
			.filter((searchField) => searchField.field !== "type_s");

		return (
			<div className={cx("current-query", {"panel-body": bootstrapCss})}>
				<div className={cx({"row": bootstrapCss})}>
					<ul className={cx({"col-md-6": bootstrapCss})}>
						<li className={cx({"list-group-item": bootstrapCss})}>Author filters</li>
						{personSearchFields.map((searchField, i) => (
							<li className={cx({"list-group-item": bootstrapCss})} key={i}>
								<label>{searchField.label}</label>
								{this.renderFieldValues(searchField, onPersonQueryChange)}
							</li>
						))}
					</ul>

					<ul className={cx({"col-md-6": bootstrapCss})}>
						<li className={cx({"list-group-item": bootstrapCss})}>Publication filters</li>
						{searchFields.map((searchField, i) => (
							<li className={cx({"list-group-item": bootstrapCss})} key={i}>
								<label>{searchField.label}</label>
								{this.renderFieldValues(searchField)}
							</li>
						))}

					</ul>
				</div>
			</div>
		);
	}
}

CurrentQuery.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	onChange: React.PropTypes.func,
	onPersonQueryChange: React.PropTypes.func,
	query: React.PropTypes.object
};

export default CurrentQuery;
