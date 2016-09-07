import React from "react";
import BasicInfo from "./tabs/basic-info";
import PersonalSituation from "./tabs/personal-situation";
import ProfessionalSituation from "./tabs/professional-situation";
import Publications from "./tabs/publications";
import Receptions from "./tabs/receptions";
import Links from "./tabs/links";
import SaveFooter from "../save-footer";


const components = {
	"basic-info": BasicInfo,
	"personal-situation": PersonalSituation,
	"professional-situation": ProfessionalSituation,
	"publications": Publications,
	"receptions": Receptions,
	"links": Links
};

class AuthorTabs extends React.Component {

	render() {
		if (this.props.children) { return (<div>{this.props.children}</div>); }

		const { params: { id, tab }, user } = this.props;
		const componentId = tab || "basic-info";
		const ChildComponent = components[componentId] || null;

		const saveFooter = this.props.editable
			? (<SaveFooter
				onSave={this.props.onSaveNewAuthor}
				onDelete={() => this.props.onCancelAuthor()}
				onCancel={() => this.props.onCancelAuthor()}
			/>) : null;

		if (ChildComponent) {
			return (
				<div>
					<ChildComponent
						authorized={user && user.token}
						entity={this.props.entity}
						editable={this.props.editable}
						onChange={this.props.onChange}
						metadata={this.props.vre.collections.wwpersons}
						otherData={this.props.otherData}
					/>
					{saveFooter}
			</div>
			);
		}

		return (<div>{componentId} for {id || "new"} {}</div>);
	}
}

export default AuthorTabs;