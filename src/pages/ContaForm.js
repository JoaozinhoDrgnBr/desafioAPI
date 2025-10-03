import React, { useState, useEffect } from 'react';
import { contaService, pessoaService } from '../services/api';
import { tipoContaLabels } from '../utils/formatters';

const ContaForm = ({ conta, onClose }) => {
  const [formData, setFormData] = useState({
    idPessoa: '',
    saldo: '',
    limiteSaqueDiario: '',
    flagAtivo: true,
    tipoConta: 1
  });
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPessoas, setLoadingPessoas] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarPessoas();
    
    if (conta) {
      setFormData({
        idPessoa: conta.pessoa?.idPessoa || '',
        saldo: conta.saldo || '',
        limiteSaqueDiario: conta.limiteSaqueDiario || '',
        flagAtivo: conta.flagAtivo,
        tipoConta: conta.tipoConta || 1
      });
    }
  }, [conta]);

  const carregarPessoas = async () => {
    try {
      setLoadingPessoas(true);
      const response = await pessoaService.listar();
      setPessoas(response.data);
    } catch (err) {
      setError('Erro ao carregar pessoas: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingPessoas(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.idPessoa) {
      setError('Pessoa é obrigatória');
      return false;
    }
    
    if (!formData.saldo || parseFloat(formData.saldo) < 0) {
      setError('Saldo deve ser um valor positivo');
      return false;
    }
    
    if (!formData.limiteSaqueDiario || parseFloat(formData.limiteSaqueDiario) <= 0) {
      setError('Limite de saque diário deve ser maior que zero');
      return false;
    }
    
    if (!formData.tipoConta) {
      setError('Tipo de conta é obrigatório');
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
      const pessoaSelecionada = pessoas.find(p => p.idPessoa === parseInt(formData.idPessoa));
      
      const dadosParaEnviar = {
        pessoa: pessoaSelecionada,
        saldo: parseFloat(formData.saldo),
        limiteSaqueDiario: parseFloat(formData.limiteSaqueDiario),
        flagAtivo: formData.flagAtivo,
        tipoConta: parseInt(formData.tipoConta)
      };
      
      if (conta) {
        await contaService.atualizar(conta.idConta, dadosParaEnviar);
      } else {
        await contaService.criar(dadosParaEnviar);
      }
      
      onClose();
    } catch (err) {
      setError('Erro ao salvar conta: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>{conta ? 'Editar Conta' : 'Nova Conta'}</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pessoa *</label>
            {loadingPessoas ? (
              <div>Carregando pessoas...</div>
            ) : (
              <select
                name="idPessoa"
                value={formData.idPessoa}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione uma pessoa</option>
                {pessoas.map((pessoa) => (
                  <option key={pessoa.idPessoa} value={pessoa.idPessoa}>
                    {pessoa.nome} - CPF: {pessoa.cpf}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="form-group">
            <label>Saldo Inicial *</label>
            <input
              type="number"
              name="saldo"
              value={formData.saldo}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Limite Saque Diário *</label>
            <input
              type="number"
              name="limiteSaqueDiario"
              value={formData.limiteSaqueDiario}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Tipo de Conta *</label>
            <select
              name="tipoConta"
              value={formData.tipoConta}
              onChange={handleInputChange}
              required
            >
              {Object.entries(tipoContaLabels).map(([valor, label]) => (
                <option key={valor} value={valor}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="flagAtivo"
                checked={formData.flagAtivo}
                onChange={handleInputChange}
                style={{ marginRight: '0.5rem' }}
              />
              Conta Ativa
            </label>
          </div>
          
          <div className="actions">
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={loading || loadingPessoas}
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

export default ContaForm;


