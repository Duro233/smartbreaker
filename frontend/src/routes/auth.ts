import axios from 'axios';
import { buildPath } from '../utils';

// Build URL path based on whether in prod or dev
const url = buildPath();

export const API = axios.create({
  //baseURL: 'http://134.199.198.51:5000/api',
  baseURL: url + '/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if(token) config.headers.Authorization = `Bearer ${token}`
    //console.log(config)
    return config;
})

export const registerUser = (data: any) =>
  API.post('/users/createUser', data);

export const loginUser = (data: any) =>
  API.post('/users/loginUser', data);

//export const getUser = (data: any) =>
  //API.get('users/getUser', data);



