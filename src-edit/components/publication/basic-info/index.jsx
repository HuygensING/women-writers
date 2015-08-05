import React from "react";

import StringComponent from "../../values/string";
import PersonRelation from "../../values/relation-person";
import Relation from "../../values/relation";

class BasicInfoForm {
	render() {
		let model = this.props.value;

		return (
			<ul className="record">
				<li>
					<label>Author</label>
					<PersonRelation values={model.getIn(["@relations", "isCreatedBy"]).toJS()} />
				</li>
				<li>
					<label>Title</label>
					<StringComponent value={model.get("title")} />
				</li>
				<li>
					<label>Document type</label>
					<StringComponent value={model.get("documentType")} />
				</li>
				<li>
					<label>Genre</label>
					<Relation values={model.getIn(["@relations", "hasGenre"]).toJS()} />
				</li>
				<li>
					<label>Language</label>
					<Relation values={model.getIn(["@relations", "hasWorkLanguage"]).toJS()} />
				</li>
				{/*
					<li>
						<label>First editor</label>
						<Relation values={model.getIn(["@relations", "firstEditor"]).toJS()} />
					</li>
				*/}
				<li>
					<label>Publish location</label>
					<Relation values={model.getIn(["@relations", "hasPublishLocation"]).toJS()} />
				</li>
				<li>
					<label>Date</label>
					<StringComponent value={model.get("date")} />
				</li>
				{/* source */}
				<li>
					<label>Reference</label>
					<StringComponent value={model.get("reference")} />
				</li>
				<li>
					<label>Notes</label>
					<StringComponent value={model.get("notes")} />
				</li>
			</ul>
		);
	}
}

export default BasicInfoForm;