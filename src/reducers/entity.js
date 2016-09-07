import setIn from "../util/set-in";

let initialState = {
	data: null,
	domain: null,
	errorMessage: null,
	transactionPending: false
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "RECEIVE_ENTITY":
			return {...state, ...{
				data: action.data,
				domain: action.domain,
				errorMessage: action.errorMessage || null
			}};

		case "SET_ENTITY_FIELD_VALUE":
			return {...state, ...{
				data: setIn(action.fieldPath, action.value, state.data)
			}};

		case "RECEIVE_ENTITY_FAILURE":
			return {...state, ...{
				data: null,
				errorMessage: action.errorMessage
			}};

		case "TRANSACTION_PENDING":
			return {...state, transactionPending: true };

		case "TRANSACTION_COMPLETE":
			return {...state, transactionPending: false };

		case "SET_VRE": {
			return initialState;
		}

	}

	return state;
}