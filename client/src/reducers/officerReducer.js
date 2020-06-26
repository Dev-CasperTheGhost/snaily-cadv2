import { GET_CURRENT_OFFICER_STATUS, SET_STATUS, SET_ON_DUTY } from "../actions/types"

const initState = {
    status: "", // On-off duty
    status2: "" // 10-11, 10-7, 10-97 etc
};

export default function (state = initState, action) {
    switch (action.type) {
        case GET_CURRENT_OFFICER_STATUS:
            return {
                ...state,
                status: action.status,
                status2: action.status2
            }
        case SET_ON_DUTY:
            return {
                ...state,
                status: action.status,
                status2: action.status2,
            }
        case SET_STATUS:
            return {
                ...state,
                status2: action.newStatus
            }
        default: return state;
    }
}