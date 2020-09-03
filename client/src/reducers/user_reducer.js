
const initialState = {
    user: {},
    followers:[],
    following:[],
    show: true,
    info:{},
    like:false
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
        case "GET_USER_INFO":
            return {...state,info: action.payload}
        case "STYLE_LIKE":
            return {...state,like: !state.like}
        default:
            return state;
    }
}