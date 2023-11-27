import axios from 'axios';

function fetchServers(){
    return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/servers`);
}

export {
  fetchServers
};