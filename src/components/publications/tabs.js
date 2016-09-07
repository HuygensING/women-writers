import React from "react";
import SaveFooter from "../save-footer";
import BasicInfo from "./tabs/basic-info";
import Receptions from "./tabs/receptions";
import Links from "./tabs/links";

const components = {
	"basic-info": BasicInfo,
	"receptions": Receptions,
	"links": Links
};

class PublicationTabs extends React.Component {

	render() {
		if (this.props.children) { return (<div>{this.props.children}</div>); }

		const { params: { id, tab }, user, location: { pathname } } = this.props;
		const componentId = tab || "basic-info";
		const ChildComponent = components[componentId] || null;

		const inPublicationReceptions = pathname.match(/\/receptions\/publications\//);
		const inAuthorReceptions = pathname.match(/\/receptions\/authors\//);

		const saveFooter = this.props.editable
			? (<SaveFooter
					onSave={this.props.onSaveNewPublication}
					onDelete={() => this.props.onCancelPublication()}
					onCancel={() => this.props.onCancelPublication()}
		/>) : null;

		if (ChildComponent) {
			return (
				<div>
					<ChildComponent
						authorized={user && user.token}
						entity={this.props.entity}
						editable={this.props.editable}
						linkToView={
							inPublicationReceptions ? "publicationReceptionIndex"
								: inAuthorReceptions ? "authorReceptionIndex"
								: "publicationIndex"
						}
						onChange={this.props.onChange}
						metadata={this.props.vre.collections.wwdocuments}
						otherData={this.props.otherData}

					/>
					{saveFooter}
				</div>
			);
		}

		return (<div>{componentId} for {id || "new"} {}</div>);
	}
}

export default PublicationTabs;