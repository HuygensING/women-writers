import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import Input from "hire-forms-input";
import Textarea from "hire-forms-textarea";

class BasicInfoForm {
	render() {
		let model = this.props.value;

		return (
			<ul>
				{/* author */}
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
					<Select
						onChange={this.props.onChange.bind(this, "language")}
						options={["Esperanto", "Occitan (post 1500)", "Ukrainian", "Ancient Hebrew", "Romanian", "Armenian", "Arabic", "Ottoman Turkish (1500-1928)", "Western Frisian", "Persian", "Lithuanian", "Icelandic", "Estonian", "Croatian", "Chinese", "Japanese", "Uzbek", "Portuguese", "Norwegian Nynorsk", "Swedish", "Russian", "Galician", "Catalan", "Basque", "Breton", "Serbian", "Spanish", "Irish", "Modern Greek (1453-)", "Polish", "Finnish", "Turkish", "Bulgarian", "Slovak", "German", "Hungarian", "English", "Latin", "Slovenian", "Albanian", "Italian", "Danish", "Czech", "Dutch", "French"]}
						value={model.get("language")} />
				</li>
				{/* firstEditor */}
				{/* publishLocation */}
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