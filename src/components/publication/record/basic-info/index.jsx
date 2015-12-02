import React from "react";

import StringComponent from "../../../values/string";
import TextComponent from "../../../values/text";

import PersonRelation from "../../../values/relation-person";
import Relation from "../../../values/relation";

class BasicInfoForm extends React.Component {
	render() {
		let model = this.props.value;

		let pid = model["^pid"] ? <a className="link" href={model["^pid"]} target="_blank">{model["^pid"]}</a> : "-";
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
					<label>Genres</label>
					<Relation values={model["@relations"].hasGenre} />
				</li>
				<li>
					<label>Language</label>
					<Relation values={model["@relations"].hasWorkLanguage} />
				</li>
{/*				<li>
					<label>First publisher</label>
					<Relation values={model["@relations"].isPublishedBy} />
				</li>*/}
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
					<TextComponent value={model.notes} />
				</li>
				<li>
					<label>Persistent ID</label>
					{pid}
				</li>
			</ul>
		);
	}
}

BasicInfoForm.propTypes = {
	onNavigate: React.PropTypes.func,
	value: React.PropTypes.object
};

export default BasicInfoForm;