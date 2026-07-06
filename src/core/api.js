import axios from 'axios';

// 🌐 Identifica onde o app está rodando e ajusta a rota base da API automaticamente
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080/api'
  : 'https://sistema-uvz-backend.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL, 
  headers: { 'Content-Type': 'application/json' }
});

export default api;