// Formatador de moeda brasileira
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Formatador de data
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Formatador de data e hora
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
};

// Formatador de CPF
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Formatador para remover formatação do CPF
export const unformatCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
};

// Validador de CPF
export const isValidCPF = (cpf) => {
  cpf = unformatCPF(cpf);
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
};

// Tipos de conta
export const tipoContaLabels = {
  1: 'Conta Corrente',
  2: 'Conta Poupança',
  3: 'Conta Salário'
};

// Tipos de transação
export const tipoTransacaoLabels = {
  'DEPOSITO': 'Depósito',
  'SAQUE': 'Saque',
  'TRANSFERENCIA_ENVIADA': 'Transferência Enviada',
  'TRANSFERENCIA_RECEBIDA': 'Transferência Recebida'
};

// Cores para tipos de transação
export const tipoTransacaoColors = {
  'DEPOSITO': '#27ae60',
  'SAQUE': '#e74c3c',
  'TRANSFERENCIA_ENVIADA': '#f39c12',
  'TRANSFERENCIA_RECEBIDA': '#3498db'
};

