import React from "react";
import Links from "../../values/links";
import LinksField from "../../form-fields/links";

class LinksTab extends React.Component {
	render() {

		const { editable, onChange } = this.props;

		return (
			<ul className="list-group">
				<li className="list-group-item">
					<label>Links</label>
					{ editable
						? <LinksField name="links" onChange={onChange} entity={this.props.entity}/>
						: <span><Links values={this.props.entity.data.links}/></span>
					}
				</li>
			</ul>
		);
	}
}

export default LinksTab;