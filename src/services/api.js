import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    return Promise.reject(error);
  }
);

// Serviços para Pessoas
export const pessoaService = {
  listar: () => api.get('/pessoas/listar'),
  buscarPorId: (id) => api.get(`/pessoas/buscarPorId/${id}`),
  criar: (pessoa) => api.post('/pessoas/criar', pessoa),
  atualizar: (id, pessoa) => api.put(`/pessoas/atualizar/${id}`, pessoa),
  deletar: (id) => api.delete(`/pessoas/deletar/${id}`),
};

// Serviços para Contas
export const contaService = {
  listar: () => api.get('/contas/listar'),
  buscarPorId: (id) => api.get(`/contas/buscarPorId/${id}`),
  criar: (conta) => api.post('/contas/criar', conta),
  atualizar: (id, conta) => api.put(`/contas/atualizar/${id}`, conta),
  deletar: (id) => api.delete(`/contas/deletar/${id}`),
};

// Serviços para Transações
export const transacaoService = {
  listar: () => api.get('/transacoes/listar'),
  buscarPorId: (id) => api.get(`/transacoes/buscarPorId/${id}`),
  deletar: (id) => api.delete(`/transacoes/deletar/${id}`),
  saque: (idConta, valor) => api.post(`/transacoes/saque/${idConta}/${valor}`),
  deposito: (idConta, valor) => api.post(`/transacoes/deposito/${idConta}/${valor}`),
  transferencia: (idRecebe, idEnvia, valor) => 
    api.post(`/transacoes/transferencia/${idRecebe}/${idEnvia}/${valor}`),
};

export default api;
