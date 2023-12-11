import axios from 'axios';

function fetchServers(){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/servers`);
}

function fetchServer(server){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/servers/${server}`,{withCredentials: true});
}

function fetchServerLog(server, uid){
    const headers = {user: uid};
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/server/log/${server}`,{headers});
}

function fetchServerVersions(uid){
    const headers = {user: uid};
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/server/versions`,{headers});
}

function validateServerCreation(data, uid){
    const headers = {user: uid};
    return axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/server/create/check`,
        data,
        {headers}
    );
}

function createServer(data, uid){
    const headers = {user: uid};
    return axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/server/create`,
        data,
        {headers}
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