// import { LOGIN_USER, LOGOUT_USER, UPDATE_FOLLOW } from "./types"

  

export const loginUser = (data) => {
    return {
        type:"LOGIN_USER",
        payload: data
    }
}

export const logoutUser = () => {
    return {
        type: "LOGOUT_USER"
    }
}

export const updateFollow = (data) => {
    return {
        type: "UPDATE_FOLLOW",
        payload: data
    }
}

export const showFollow = () => {
    return {
        type: "SHOW_FOLLOW"
    }
}

export const userInfoAction = (data) => {
    return {
        type: "GET_USER_INFO",
        payload: data
    }
}

export const handleLike = () => {
    return {
        type : "STYLE_LIKE"
    }
}
