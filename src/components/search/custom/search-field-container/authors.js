import React from "react";
import cx from "classnames";


// React.Children.toArray(this.props.children).filter((child) => child.props.field === "name_t")

const fieldTypes = {
	default: ["name_t", "types_ss", "gender_s"],
	basic: ["relatedLocations_ss", "language_ss", "birthDate_i", "deathDate_i", "birthPlace_ss", "deathPlace_ss", "notes_t"],
	personal: ["maritalStatus_ss", "children_s", "socialClass_ss", "education_ss", "religion_ss"],
	professional: [ "profession_ss", "financialSituation_ss", "memberships_ss"]
};

class SearchFieldContainer extends React.Component {

	constructor(props) {
		super(props);

		const basicOpen = props.children
			.filter((child) => fieldTypes.basic.indexOf(child.props.field) > -1)
			.filter((child) => child.props.value && child.props.value.length).length;

		const personalOpen = props.children
			.filter((child) => fieldTypes.personal.indexOf(child.props.field) > -1)
			.filter((child) => child.props.value && child.props.value.length).length;

		const professionalOpen = props.children
			.filter((child) => fieldTypes.professional.indexOf(child.props.field) > -1)
			.filter((child) => child.props.value && child.props.value.length).length;

		this.state = {
			basicOpen: basicOpen,
			personalOpen: personalOpen,
			professionalOpen: professionalOpen
		};
	}

	toggleOpen(entry) {
		const payload = {};
		payload[entry] = !this.state[entry];
		this.setState(payload);
	}

	render() {
		const { bootstrapCss, onNewSearch } = this.props;
		const { basicOpen, personalOpen, professionalOpen } = this.state;


		return (
			<div className={cx({"col-md-3": bootstrapCss})}>
				<div className={cx({"panel": bootstrapCss, "panel-default": bootstrapCss})}>
					<header className={cx({"panel-heading": bootstrapCss})}>
						<button className={cx({"btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, "pull-right": bootstrapCss})}
								onClick={onNewSearch}>
							New search
						</button>
						<label>Search</label>
					</header>

					<ul className={cx("solr-search-fields", {"list-group": bootstrapCss})}>
												{React.Children.toArray(this.props.children).filter((child) => fieldTypes.default.indexOf(child.props.field) > -1)}

						<li className="list-group-item">
							<header onClick={() => this.toggleOpen("basicOpen")}>
								<h4>
									Basic info
									<span className="pull-right">
										<span className={cx("glyphicon", { "glyphicon-collapse-down": basicOpen, "glyphicon-collapse-up": !basicOpen})} />
									</span>
								</h4>
							</header>
						</li>
						{basicOpen ? React.Children.toArray(this.props.children).filter((child) => fieldTypes.basic.indexOf(child.props.field) > -1) : null}


						<li className="list-group-item">
							<header onClick={() => this.toggleOpen("personalOpen")}>
								<h4>
									Personal situation
									<span className="pull-right">
										<span className={cx("glyphicon", { "glyphicon-collapse-down": personalOpen, "glyphicon-collapse-up": !personalOpen})} />
									</span>
								</h4>
							</header>
						</li>
						{personalOpen ? React.Children.toArray(this.props.children).filter((child) => fieldTypes.personal.indexOf(child.props.field) > -1) : null}

						<li className="list-group-item">
							<header onClick={() => this.toggleOpen("professionalOpen")}>
								<h4>
									Professional situation
									<span className="pull-right">
										<span className={cx("glyphicon", { "glyphicon-collapse-down": professionalOpen, "glyphicon-collapse-up": !professionalOpen})} />
									</span>
								</h4>
							</header>
						</li>
						{professionalOpen ? React.Children.toArray(this.props.children).filter((child) => fieldTypes.professional.indexOf(child.props.field) > -1) : null}

					</ul>
				</div>
			</div>
		);
	}
}

SearchFieldContainer.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	children: React.PropTypes.array,
	onNewSearch: React.PropTypes.func
};

export default SearchFieldContainer;