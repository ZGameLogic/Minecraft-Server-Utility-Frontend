import axios from 'axios';

function authenticate(code){
    const params = new URLSearchParams({
        code
    });
    return axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/login`, params);
}

function reauthenticate(id){
    const params = new URLSearchParams({
        id
    });
    return axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/login`, params);
}

export {
    authenticate,
    reauthenticate
};