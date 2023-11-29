import axios from 'axios';

function fetchServers(){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/servers`);
}

function fetchServer(server){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/servers/${server}`);
}

function fetchServerLog(server){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/server/log/${server}`);
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
    fetchServer,
    fetchServerLog,
    fetchServerVersions,
    validateServerCreation,
    createServer
};