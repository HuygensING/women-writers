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

class PublicationEditTabs extends React.Component {

	render() {
		const { params: { id, tab }, user, location: { pathname } } = this.props;

		const componentId = tab || "basic-info";
		const ChildComponent = components[componentId] || null;

		const inPublicationReceptions = pathname.match(/\/receptions\/publications\//);
		const inAuthorReceptions = pathname.match(/\/receptions\/authors\//);

		const { onSave, onDelete, onCancel } = {
			onSave: inPublicationReceptions
				? () => this.props.onSavePublication(id, componentId, "publicationReception")
				: inAuthorReceptions
				? () => this.props.onSavePublication(id, componentId, "authorReception")
				: () => this.props.onSavePublication(id, componentId),
			onDelete: inPublicationReceptions
				? () => this.props.onDeletePublication(id, componentId, "publicationReception")
				: inAuthorReceptions
				? () => this.props.onDeletePublication(id, componentId, "authorReception")
				: () => this.props.onDeletePublication(id, componentId),
			onCancel: inPublicationReceptions
				? () => this.props.onCancelPublication(id, componentId, "publicationReception")
				: inAuthorReceptions
				? () => this.props.onCancelPublication(id, componentId, "authorReception")
				: () => this.props.onCancelPublication(id, componentId)
		};

		return ChildComponent ? (<div>
				<ChildComponent
					authorized={user && user.token}
					entity={this.props.entity}
					editable={user && user.token}
					linkToView={
						inPublicationReceptions ? "publicationReceptionIndex"
							: inAuthorReceptions ? "authorReceptionIndex"
							: "publicationIndex"
					}
					onChange={this.props.onChange}
					metadata={this.props.vre.collections.wwdocuments}
					otherData={this.props.otherData}

				/>
				{ user && user.token
					? <SaveFooter onSave={onSave} onDelete={onDelete} onCancel={onCancel}/>
					: null
				}
			</div>
		) : null;
	}
}

export default PublicationEditTabs;
