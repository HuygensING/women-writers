import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import Input from "hire-forms-input";
import Textarea from "hire-forms-textarea";
import Autocomplete from "hire-forms-autocomplete";
import AutocompleteList from "hire-forms-autocomplete-list";

import API from "../../../api";

class BasicInfoForm {
	render() {
		let model = this.props.value;

		return (
			<ul>
				<li>
					<label>Author</label>
					<AutocompleteList
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, ["@relations", "isCreatedBy"])}
						values={model.getIn(["@relations", "isCreatedBy"]).toJS()} />
				</li>
				<li>
					<label>Title</label>
					<Input
						onChange={this.props.onChange.bind(this, "title")}
						value={model.get("title")} />
				</li>
				<li>
					<label>Document type</label>
					<Select
						async={API.getDocSourceType}
						onChange={this.props.onChange.bind(this, ["@relations", "documentType"])}
						sort={true}
						value={model.getIn(["@relations", "documentType"]).toJS()} />
				</li>
				<li>
					<label>Genre</label>
					<AutocompleteList
						async={API.getGenre}
						onChange={this.props.onChange.bind(this, ["@relations", "hasGenre"])}
						sort={true}
						values={model.getIn(["@relations", "hasGenre"]).toJS()} />
				</li>
				<li>
					<label>Language</label>
					<AutocompleteList
						async={API.getLanguages}
						onChange={this.props.onChange.bind(this, ["@relations", "hasWorkLanguage"])}
						values={model.getIn(["@relations", "hasWorkLanguage"]).toJS()} />
				</li>
				<li>
					<label>First editor</label>
					<Autocomplete
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, ["@relations", "firstEditor"])}
						value={model.getIn(["@relations", "firstEditor"]).toJS()} />
				</li>
				<li>
					<label>Publish location</label>
					<AutocompleteList
						async={API.getLocations}
						onChange={this.props.onChange.bind(this, ["@relations", "hasPublishLocation"])}
						values={model.getIn(["@relations", "hasPublishLocation"]).toJS()} />
				</li>
				<li>
					<label>Date</label>
					<Input
						onChange={this.props.onChange.bind(this, "date")}
						value={model.get("date")} />
				</li>
				{/* source */}
				<li>
					<label>Reference</label>
					<Input
						onChange={this.props.onChange.bind(this, "reference")}
						value={model.get("reference")} />
				</li>
				<li>
					<label>Notes</label>
					<Textarea
						onChange={this.props.onChange.bind(this, "notes")}
						value={model.get("notes")} />
				</li>
			</ul>
		);
	}
}

export default form(BasicInfoForm);