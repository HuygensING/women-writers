import xhr from "xhr";
import store from "../reducers/store";

export default {
	performXhr: function (options, accept, reject = () => { console.warn("Undefined reject callback! "); (console.trace || () => {})(); }, operation = "Server request") {
		xhr(options, (err, resp, body) => {
			if(resp.statusCode >= 400 || resp.statusCode === 0) {
				try {
					const { message } = JSON.parse(resp.body);
					store.dispatch({
						type: "ERROR_MESSAGE",
						message: `${operation} failed: ${message}`,
						ts: new Date().getTime()
					});
				} catch (e) {
					store.dispatch({
						type: "ERROR_MESSAGE",
						message: `${operation} failed${resp.body ? ": " + resp.body : ""}`,
						ts: new Date().getTime()
					});
				}
				reject(err, resp, body);
			} else {
				accept(err, resp, body);
			}
		});
	},

	fastXhr: function(options, accept) {
		xhr(options, accept);
	},

	makeHeaders: function(token, vreId) {
		return {
			"Accept": "application/json",
			"Content-type": "application/json",
			"Authorization": token,
			"VRE_ID": vreId
		};
	}
};
