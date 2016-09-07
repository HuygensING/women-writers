import React from "react";
import SaveFooter from "../save-footer";
import BasicInfo from "./tabs/basic-info";
import PersonalSituation from "./tabs/personal-situation";
import ProfessionalSituation from "./tabs/professional-situation";
import Publications from "./tabs/publications";
import Receptions from "./tabs/receptions";
import Links from "./tabs/links";

const components = {
	"basic-info": BasicInfo,
	"personal-situation": PersonalSituation,
	"professional-situation": ProfessionalSituation,
	"publications": Publications,
	"receptions": Receptions,
	"links": Links
};

class AuthorEditTabs extends React.Component {

	render() {
		const { params: { id, tab }, user } = this.props;

		const componentId = tab || "basic-info";
		const ChildComponent = components[componentId] || null;

		return ChildComponent ? (<div>
				<ChildComponent
					authorized={user && user.token}
					entity={this.props.entity}
					editable={user && user.token}
					onChange={this.props.onChange}
					metadata={this.props.vre.collections.wwpersons}
					otherData={this.props.otherData}
				/>
				{ user && user.token
					? <SaveFooter onSave={() => this.props.onSaveAuthor(id, componentId)}
						onDelete={() => this.props.onDeleteAuthor(id, componentId)}
						onCancel={() => this.props.onCancelAuthor(id, componentId)} />
					: null
				}
			</div>
		) : null;
	}
}

export default AuthorEditTabs;
