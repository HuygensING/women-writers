import React from "react";
import { Link } from "react-router";
import { urls } from "../../router";

const genderMap = {
	"FEMALE": " ♀",
	"MALE": " ♂"
};

class RelationList extends React.Component {
	render() {
		return (
			<li className="list-group-item">
				<label>{this.props.label}</label>
				<span>
					<ul>
						{this.props.relations.map((relation, i) => (
							<li className="list-group-item" key={i}>
								<div>
									<Link to={urls[this.props.linkTo](relation.id)}>
										{i + 1}. {relation.displayName}
									</Link>
								</div>
								{(relation.authors || []).map((author, j) => <span className="relation-author" key={j}>
									{author.displayName}{author.gender ? genderMap[author.gender] : ""}
								</span> )}
							</li>
						))}
					</ul>
				</span>
			</li>
		);
	}
}

export default RelationList;