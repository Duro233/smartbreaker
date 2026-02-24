import axios from 'axios';
//import { buildPath } from '../utils';

// Build URL path based on whether in prod or dev
//onst url = buildPath();
//const url = buildPath();

export const API = axios.create({
  baseURL: 'http://thesmartbuilder.xyz/api',
  //baseURL: url + '/api', 
  //baseURL: 'http://localhost:5000/api',
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



