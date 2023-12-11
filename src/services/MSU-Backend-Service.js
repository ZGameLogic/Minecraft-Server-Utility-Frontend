import axios from 'axios';

function fetchServers(){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/servers`,{withCredentials: true});
}

function fetchServer(server){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/servers/${server}`,{withCredentials: true});
}

function fetchServerLog(server){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/server/log/${server}`,{withCredentials: true});
}

function fetchServerVersions(){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/server/versions`,{withCredentials: true});
}

function validateServerCreation(data){
    return axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/server/create/check`,
        data,
        {withCredentials: true}
    );
}

function createServer(data){
    return axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/server/create`,
        data,
        {withCredentials: true}
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