import axios from 'axios';

const api = axios.create({
  // Adicione o /api no final da URL do Render!
  baseURL: 'https://sistema-uvz-backend.onrender.com/api', 
  headers: {'Content-Type': 'application/json'}
});

export default api;