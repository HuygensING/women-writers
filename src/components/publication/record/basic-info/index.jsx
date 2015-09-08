import React from "react";

import StringComponent from "../../../values/string";
import PersonRelation from "../../../values/relation-person";
import Relation from "../../../values/relation";

class BasicInfoForm {
	render() {
		let model = this.props.value;

		return (
			<ul className="record">
				<li>
					<label>Author</label>
					<PersonRelation
						onNavigate={this.props.onNavigate}
						values={model["@relations"].isCreatedBy} />
				</li>
				<li>
					<label>Title</label>
					<StringComponent value={model.title} />
				</li>
				<li>
					<label>Document type</label>
					<StringComponent value={model.documentType} />
				</li>
				<li>
					<label>Genre</label>
					<Relation values={model["@relations"].hasGenre} />
				</li>
				<li>
					<label>Language</label>
					<Relation values={model["@relations"].hasWorkLanguage} />
				</li>
				{/*
					<li>
						<label>First editor</label>
						<Relation values={model["@relations"].firstEditor} />
					</li>
				*/}
				<li>
					<label>Publish location</label>
					<Relation values={model["@relations"].hasPublishLocation} />
				</li>
				<li>
					<label>Date</label>
					<StringComponent value={model.date} />
				</li>
				{/* source */}
				<li>
					<label>Reference</label>
					<StringComponent value={model.reference} />
				</li>
				<li>
					<label>Notes</label>
					<StringComponent value={model.notes} />
				</li>
			</ul>
		);
	}
}

export default BasicInfoForm;