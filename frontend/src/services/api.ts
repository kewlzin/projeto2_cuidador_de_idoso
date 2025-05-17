import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@CuidarBem:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  role: 'patient' | 'caregiver' | 'doctor';
  phone: string;
  // Outros dados de perfil específicos
  [key: string]: any;
}

export const userService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/users/register', {
      email: data.email,
      password: data.password,
      role: data.role,
      full_name: data.full_name,
      phone: data.phone,
      // Enviando o resto dos dados como profileData
      ...data
    });
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
};

export default api; 