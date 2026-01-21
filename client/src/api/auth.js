import axios from 'axios';

const API = axios.create({
  baseURL: 'http://thesmartbuilder.xyz/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const registerUser = (data) =>
  API.post('/auth/register', data);

export const loginUser = (data) =>
  API.post('/auth/login', data);
