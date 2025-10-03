import React, { useState, useEffect } from 'react';
import { pessoaService } from '../services/api';
import { unformatCPF, isValidCPF } from '../utils/formatters';

const PessoaForm = ({ pessoa, onClose }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pessoa) {
      setFormData({
        nome: pessoa.nome,
        cpf: pessoa.cpf,
        dataNascimento: pessoa.dataNascimento
      });
    }
  }, [pessoa]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCPFChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    // Aplica a máscara
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
    }
    
    setFormData(prev => ({
      ...prev,
      cpf: value
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    
    if (!formData.cpf.trim()) {
      setError('CPF é obrigatório');
      return false;
    }
    
    if (!isValidCPF(formData.cpf)) {
      setError('CPF inválido');
      return false;
    }
    
    if (!formData.dataNascimento) {
      setError('Data de nascimento é obrigatória');
      return false;
    }
    
    // Verifica se a data não é futura
    const today = new Date().toISOString().split('T')[0];
    if (formData.dataNascimento > today) {
      setError('Data de nascimento não pode ser futura');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const dadosParaEnviar = {
        nome: formData.nome.trim(),
        cpf: unformatCPF(formData.cpf),
        dataNascimento: formData.dataNascimento
      };
      
      if (pessoa) {
        await pessoaService.atualizar(pessoa.idPessoa, dadosParaEnviar);
      } else {
        await pessoaService.criar(dadosParaEnviar);
      }
      
      onClose();
    } catch (err) {
      setError('Erro ao salvar pessoa: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>{pessoa ? 'Editar Pessoa' : 'Nova Pessoa'}</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Digite o nome completo"
              required
            />
          </div>
          
          <div className="form-group">
            <label>CPF *</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength="14"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Data de Nascimento *</label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="actions">
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PessoaForm;


