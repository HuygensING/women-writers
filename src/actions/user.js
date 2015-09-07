// import dispatcher from "../dispatcher";
// import API from "../stores/api";

// let userActions = {
// 	receive(data) {
// 		dispatcher.handleViewAction({
// 			actionType: "USER_RECEIVE",
// 			data: data
// 		});
// 	}
// };

// export default userActions;

export function setUser(response) {
	return {
		type: "SET_USER",
		user: response
	};
}