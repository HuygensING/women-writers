import store from "./store";

export default function(err, response, body) {
	if(err) {
		console.warn("Serious XHR problem", err);
		store.dispatch({
			type: "SERVER_ERROR",
			message: null,
			statusCode: -1,
			localMessage: "Failed to perform request"
		});
		return true;
	}
	if(response.statusCode >= 400) {
		// TODO handle cases and dispatch message
		let message = null, localMessage;
		try {
			message = JSON.parse(body).message;
		} catch(e) {
			console.warn("Failed to parse JSON error message from server");
		}

		switch (response.statusCode) {
			case 400: localMessage = "Bad request"; break;
			case 401: localMessage = "Unauthorized"; break;
			case 403: localMessage = "Forbidden"; break;
			case 404: localMessage = "Not found"; break;
			case 409: localMessage = "Conflict"; break;
			case 500: localMessage = "Internal server error"; break;
			default: localMessage = "Unknown error"; break;
		}
		store.dispatch({
			type: "SERVER_ERROR",
			message: message,
			statusCode: response.statusCode,
			localMessage: localMessage
		});
		setTimeout(() => store.dispatch({type: "CLEAR_SERVER_ERROR"}), 5000);
		return true;
	}

	return false;
}