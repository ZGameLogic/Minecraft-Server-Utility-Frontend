import axios from 'axios';
import {PermissionType} from '../constants/Types';

function fetchServers(){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/servers`);
}

function fetchServer(server: string){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/servers/${server}`,{withCredentials: true});
}

function fetchServerLog(server: string, uid: string){
    const headers = {user: uid};
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/server/log/${server}`,{headers});
}

function fetchServerVersions(uid: string){
    const headers = {user: uid};
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/server/versions`,{headers});
}

function validateServerCreation(data, uid: string){
    const headers = {user: uid};
    return axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/server/create/check`,
        data,
        {headers}
    );
}

function createServer(data, uid: string){
    const headers = {user: uid};
    return axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/server/create`,
        data,
        {headers}
    );
}

function getUserPermissions(uid: string){
    const headers = {user: uid};
    return axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/user/permissions`,
        {headers}
    );
}

function updateUserPermission(authUid: string, id: string, data: PermissionType, add: boolean){
    const headers = {user: authUid};
    return axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/user/permissions/${add ? 'add' : 'remove'}/${id}`,
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
    createServer,
    getUserPermissions,
    updateUserPermission
};