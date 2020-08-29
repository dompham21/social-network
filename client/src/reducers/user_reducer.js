
const initialState = {
    user: {},followers:[],following:[],show: false
}   

export default function (state=initialState,action){
    switch (action.type) {
        case "LOGIN_USER":
            return {...state,user: action.payload}
        case "LOGOUT_USER":
            return {...state,user:{}}
        case "UPDATE_FOLLOW":
            return {...state,followers:action.payload.followers,following:action.payload.following}
        case "SHOW_FOLLOW":
            return {...state,show: !state.show}
        default:
            return state;
    }
}