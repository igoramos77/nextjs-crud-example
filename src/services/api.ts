import axios from 'axios';

//const token = localStorage.getItem('@token'); //change token key
const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    //'Authorization': `Bearer ${token}`,
  },
});

export default api;