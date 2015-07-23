import React from "react";
import form from "hire-forms-form";
import Input from "hire-forms-input";

/*
 * URLs are hard to validate, see: http://stackoverflow.com/a/1411800/997941
 * That's why we check simply for:
 * * whitespace
 * * two consecutive dots (..)
 * * double quotes (")
 * * at least one dot (.)
 * * not starting or ending with a dot
 *
 * @param {String} value
 * @returns {Object} A validator object with `isValid` and `message` properties.
 */
let validateURL = function(value) {
	let re = /\s+|\.\.|"/;
	let oneDot = value.indexOf(".") > 0;
	let noEndDot = value.charAt(value.length - 1) !== ".";
	let isValid = !re.test(value) && oneDot && noEndDot;

	return {
		isValid: isValid,
		message: isValid ? "" : "Please enter a valid email address."
	};
};

class LinkForm {
	render() {
		let model = this.props.value;

		return (
			<ul>
				<li>
					<Input
						onChange={this.props.handleChange.bind(this, "label")}
						placeholder="Label"
						value={model.get("label")} />
				</li>
				<li>
					<Input
						onChange={this.props.handleChange.bind(this, "url")}
						placeholder="http://"
						validate={validateURL}
						value={model.get("url")} />
				</li>
			</ul>
		);
	}
}

export default form(LinkForm, "hire-forms-link-form");