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

		return (
			<ul>
				<li>
					<label>Author</label>
					<Autocomplete
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, "author")}
						value={model.get("author").toJS()} />
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
						onChange={this.props.onChange.bind(this, "documentType")}
						options={["Unknown", "Anthology", "Article", "Award", "Catalogue", "Compilation", "Diary", "Letter", "List", "Monograph", "Periodical", "Picture", "Publicity", "Sheetmusic", "Theaterscript", "Work"]}
						value={model.get("documentType")} />
				</li>
				<li>
					<label>Genre</label>
					<Select
						onChange={this.props.onChange.bind(this, "genre")}
						options={["Religious", "Biography: diary", "Novel", "Literary criticism", "Short story", "Short story: conte", "Travel writing", "Educational", "Drama", "Short story: novella", "Feminist writing", "Poetry", "Essay", "Novel: historical", "Children's literature", "Scholarship", "Religious: mystical", "Biography: memoir", "TBD", "Cookery book", "Conduct book", "Essay: tract", "Irrelevant", "Drama: closet", "Poetry: folk song", "Novel: epistolary", "Essay: lecture", "Poetry: occasional", "Embroidery", "Medical", "Novel: robinsonade", "Textbook", "Poetry: prose", "Religious monastic rule", "Philosophy", "Novel: fictional diary", "Short story: sketch", "Short story: moral tale", "Short story: oriental", "Biography", "Biography: autobiography", "Biography: letter(s)", "Biography: obituary", "Periodical press: contribution", "Periodical press: editorial", "Scholarship: history", "Scholarship: BBC"]}
						value={model.get("genre")} />
				</li>
				<li>
					<label>Language</label>
					<Autocomplete
						async={API.getLanguages}
						onChange={this.props.onChange.bind(this, "language")}
						value={model.get("language").toJS()} />
				</li>
				<li>
					<label>First editor</label>
					<Autocomplete
						async={API.getPersons}
						onChange={this.props.onChange.bind(this, "firstEditor")}
						value={model.get("firstEditor").toJS()} />
				</li>
				<li>
					<label>Publish location</label>
					<Autocomplete
						async={API.getLocations}
						onChange={this.props.onChange.bind(this, "publishLocation")}
						value={model.get("publishLocation").toJS()} />
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