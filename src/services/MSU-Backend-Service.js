import axios from 'axios';

function fetchServers(){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/servers`);
}

function fetchServerVersions(){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/server/versions`);
}

function validateServerCreation(data){
    return axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/server/create/check`,
        data
    );
}

function createServer(data){
    return axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/server/create`,
        data
    );
}

export {
    fetchServers,
    fetchServerVersions,
    validateServerCreation,
    createServer
};