import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import SelectList from "hire-forms-select-list";
import Input from "hire-forms-input";
import Textarea from "hire-forms-textarea";
import AutocompleteList from "hire-forms-autocomplete-list";

import FirstPublisherForm from "./first-publisher";

import {validateDate} from "../../../../validation";
import API from "../../../../stores/api";

class BasicInfoForm extends React.Component {
	render() {
		let model = this.props.publication;

		let isCreatedBy = (model._id == null) ?
			null :
			<li>
				<label>Author</label>
				<AutocompleteList
					async={API.getPersons}
					onChange={this.props.onChange.bind(this, ["@relations", "isCreatedBy"])}
					values={model["@relations"].isCreatedBy} />
			</li>;

		let hasGenre = (model._id == null) ?
			null :
			<li>
				<label>Genres</label>
				<SelectList
					async={API.getGenre}
					onChange={this.props.onChange.bind(this, ["@relations", "hasGenre"])}
					sort={true}
					values={model["@relations"].hasGenre} />
			</li>;

		let hasWorkLanguage = (model._id == null) ?
			null :
			<li>
				<label>Language</label>
				<AutocompleteList
					async={API.getLanguages}
					onChange={this.props.onChange.bind(this, ["@relations", "hasWorkLanguage"])}
					values={model["@relations"].hasWorkLanguage} />
			</li>;


		let hasPublishLocation = (model._id == null) ?
			null :
			<li>
				<label>Publish location</label>
				<AutocompleteList
					async={API.getLocations}
					onChange={this.props.onChange.bind(this, ["@relations", "hasPublishLocation"])}
					values={model["@relations"].hasPublishLocation} />
			</li>;

		let firstPublisher = (model._id === null) ?
			null :
			<li>
				<label>First publisher</label>
				<FirstPublisherForm
					async={API.getCollectives}
					onChange={this.props.onChange.bind(this, ["@relations", "isPublishedBy"])}
					values={model["@relations"].isPublishedBy}
					/>
			</li>;

		return (
			<ul>
				{isCreatedBy}
				<li>
					<label>Title</label>
					<Input
						onChange={this.props.onChange.bind(this, "title")}
						value={model.title} />
				</li>
				<li>
					<label>Document type</label>
					<Select
						onChange={this.props.onChange.bind(this, "documentType")}
						options={["Unknown", "Anthology", "Article", "Award", "Catalogue", "Compilation", "Diary", "Letter", "List", "Monograph", "Periodical", "Picture", "Publicity", "Sheetmusic", "Theaterscript", "Work"]}
						value={model.documentType} />
				</li>
				{hasGenre}
				{hasWorkLanguage}
				{firstPublisher}
				{hasPublishLocation}
				<li>
					<label>Date</label>
					<Input
						onChange={this.props.onChange.bind(this, "date")}
						validate={validateDate}
						value={model.date} />
				</li>
				{/* source */}
				<li>
					<label>Reference</label>
					<Input
						onChange={this.props.onChange.bind(this, "reference")}
						value={model.reference} />
				</li>
				<li>
					<label>Notes</label>
					<Textarea
						onChange={this.props.onChange.bind(this, "notes")}
						value={model.notes} />
				</li>
			</ul>
		);
	}
}

BasicInfoForm.propTypes = {
	onChange: React.PropTypes.func,
	publication: React.PropTypes.object
};
export default form(BasicInfoForm);