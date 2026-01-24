import axios from 'axios';

const API = axios.create({
  baseURL: 'http://134.199.198.51:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const registerUser = (data: any) =>
  API.post('/auth/register', data);

export const loginUser = (data: any) =>
  API.post('/auth/login', data);
