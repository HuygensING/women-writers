import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import Input from "hire-forms-input";
import Textarea from "hire-forms-textarea";
import Autocomplete from "hire-forms-autocomplete";

import API from "../../api";

class BasicInfoForm {
	render() {
		let model = this.props.value;
		console.log("m", model.toJS());
		return (
			<ul>
				<li>
					<label>Author</label>
					<Autocomplete
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, ["@relations", "author"])}
						value={model.getIn(["@relations", "author"]).toJS()} />
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
					<Select
						async={API.getGenre}
						onChange={this.props.onChange.bind(this, ["@relations", "genre"])}
						sort={true}
						value={model.getIn(["@relations", "genre"]).toJS()} />
				</li>
				<li>
					<label>Language</label>
					<Autocomplete
						async={API.getLanguages}
						onChange={this.props.onChange.bind(this, ["@relations", "language"])}
						value={model.getIn(["@relations", "language"]).toJS()} />
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
					<Autocomplete
						async={API.getLocations}
						onChange={this.props.onChange.bind(this, ["@relations", "publishLocation"])}
						value={model.getIn(["@relations", "publishLocation"]).toJS()} />
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