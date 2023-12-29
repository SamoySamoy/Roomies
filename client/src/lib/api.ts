import axios from 'axios';
import { SERVER_API_URL } from './constants';

export const api = axios.create({
  baseURL: SERVER_API_URL,
  withCredentials: true,
});
