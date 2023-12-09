import axios from 'axios';

function postForToken(code){
    const params = new URLSearchParams({
        code
    });
    return axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/login`, params);
}

function getUserData(token) {
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/auth/user/${token}`);
}

export {
    postForToken,
    getUserData
};