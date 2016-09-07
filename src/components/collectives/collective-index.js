import React from "react";
import cx from "classnames";
import { urls } from "../../router";
import { Link } from "react-router";

import SaveFooter from "../save-footer";

import Links from "../values/links";
import Relation from "../values/relation";
import ModifiedBy from "../values/modified-by";

import StringField from "../form-fields/string";
import SelectField from "../form-fields/select";

class CollectiveIndex extends React.Component {

	componentDidMount() {
		const {entity, onFetchCollective, onNewCollective, params: { id }} = this.props;

		// If the requested id from the route does not match the data, or if there is no data
		if ((!entity.data && id) || (id && entity.data && entity.data._id !== id) ) {
			// Fetch the correct author based on the id.
			onFetchCollective(id);
		} else if (!id) {
			onNewCollective();
		}
	}

	componentWillReceiveProps(nextProps) {
		const { onFetchCollective } = this.props;

		// Triggers fetch data from server based on id from route.
		if (this.props.params.id !== nextProps.params.id) {
			onFetchCollective(nextProps.params.id);
		}
	}

	render() {
		const {
			entity,
			user,
			location: { pathname },
			onChange,
			pagination: { collectivePages }
		} = this.props;

		if (!entity.data || entity.data["@type"] !== "wwcollective") { return null; }

		const loggedIn = user && user.token;

		const editing = !entity.transactionPending && loggedIn && (pathname.match(/\/edit$/) || pathname.match(/\/new$/));

		const metadata = this.props.vre.collections.wwcollectives;
		const id = entity.data._id || null;

		const pageIndex = collectivePages.indexOf(entity.data._id);
		const nextCollective = pageIndex > -1 && pageIndex < collectivePages.length - 1 ?
			<Link className="btn btn-default" to={urls.collectiveIndex(collectivePages[pageIndex + 1])}>Next ▸</Link> : null;

		const prevCollective = pageIndex > -1 && pageIndex > 0 ?
			<Link className="btn btn-default" to={urls.collectiveIndex(collectivePages[pageIndex - 1])}>◂ Previous</Link> : null;

		const saveFooter = editing ?
			(pathname.match(/\/new$/)
			? <SaveFooter onSave={() => this.props.onSaveCollective()}
						  onDelete={() => this.props.onCancelCollective()}
						  onCancel={() => this.props.onCancelCollective()} />
			: <SaveFooter onSave={() => this.props.onSaveCollective()}
					onDelete={() => this.props.onDeleteCollective(id)}
					onCancel={() => this.props.onCancelCollective(id)} />) : null;

		const editButton = loggedIn && id && !editing ?
			<Link className="btn btn-default" to={urls.collectiveEdit(id)}>
				Edit
			</Link> : null;

		const pid = entity.data["^pid"] ? <a className="link" href={entity.data["^pid"]} target="_blank">{entity.data["^pid"]}</a> : "-";

		return (
			<div className={cx("collective", "overview", {"transaction-pending": entity.transactionPending})}>
				<div className="col-md-12 row">
					<div className="col-md-3">
						<Link className="btn btn-default" to={urls.collectiveSearch()}>◂ Results</Link>
					</div>
					<div className="col-md-6">
						<header className="page">
							<h2>{entity.data.name}</h2>
						</header>
					</div>
					<div className="col-md-3">
						<div className="btn-group pull-right">
							{prevCollective}
							{nextCollective}
						</div>
					</div>
				</div>
				<div className="col-md-12 row">
					<div className="col-md-3">
						<ModifiedBy label="Created by" {...entity.data["^created"]} />
						<ModifiedBy label="Modified by" {...entity.data["^modified"]} />
						{editButton}
					</div>
					<div className="col-md-9">
						<ul className="record list-group">
							<li className="list-group-item">
								<label>Name</label>
								{ editing
									? <StringField name="name"  onChange={onChange} entity={this.props.entity}/>
									: <span>{entity.data.name}</span>
								}
							</li>
							<li className="list-group-item">
								<label>Type</label>
								{ editing
									? <SelectField name="type"
													options={metadata.properties.find((p) => p.name === "type").options}
													onChange={onChange} entity={this.props.entity}/>
									: <span>{entity.data.type}</span>
								}
							</li>


							<li className="list-group-item">
								<label>Links</label>
								<span><Links values={entity.data.links}/></span>
							</li>

							<li className="list-group-item">
								<label>Is storage of</label>
								<Relation values={entity.data["@relations"].isStorageOf} linkTo="publicationIndex" />
							</li>

							<li className="list-group-item">
								<label>Is publisher of</label>
								<Relation values={entity.data["@relations"].isPublisherOf} linkTo="publicationIndex" />
							</li>

							<li className="list-group-item">
								<label>Has members</label>
								<Relation values={entity.data["@relations"].hasMember} linkTo="authorIndex" />
							</li>

							<li className="list-group-item">
								<label>Persistent ID</label>
								{pid}
							</li>
						</ul>
						{saveFooter}
					</div>
				</div>
			</div>
		);
	}
}

export default CollectiveIndex;