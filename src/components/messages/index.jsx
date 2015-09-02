import React from "react";
import cx from "classnames";

import messagesStore from "../../stores/messages";

class Messages extends React.Component {
	constructor(props) {
		super(props);

		this.onStoreChange = this.onStoreChange.bind(this);

		this.state = {
			active: false,
			message: null
		};
	}

	componentDidMount() {
		messagesStore.listen(this.onStoreChange);
	}

	componentWillUnmount() {
		messagesStore.stopListening(this.onStoreChange);
	}

	onStoreChange() {
		let messages = messagesStore.getState().messages;

		if (messages.length) {
			this.setState({
				active: true,
				message: messages[messages.length - 1]
			});
		}
	}

	render() {
		if (this.timer == null) {
			this.timer = setTimeout(() => {
				clearTimeout(this.timer);
				this.timer = null;

				if (this.state.active) {
					this.setState({
						active: false
					});
				}

			}, 5000);
		}

		return (
			<div className={cx(
				"message",
				{active: this.state.active}
			)}>
				{this.state.message}
			</div>
		);
	}
}

export default Messages;