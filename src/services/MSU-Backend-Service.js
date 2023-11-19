import axios from 'axios';

function fetchServers(){
    return axios.get('http://localhost:8080/servers');
}

export {
  fetchServers
};