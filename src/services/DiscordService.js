import axios from 'axios';

function authenticate(code){
    const params = new URLSearchParams({
        code
    });
    return axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/login`, params);
}

function reauthenticate(token){
    const params = new URLSearchParams({
        token
    });
    return axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/login`, params);
}

export {
    authenticate,
    reauthenticate
};