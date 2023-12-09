import axios from 'axios';

function postForToken(code){
    const params = new URLSearchParams({
        code
    });
    return axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/login`, params);
}

function reauthenticate(token, refresh){
    return axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/verify/${token}/${refresh}`);
}

function getUserData(token, refresh) {
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/auth/user/${token}/${refresh}`);
}

export {
    postForToken,
    getUserData,
    reauthenticate
};