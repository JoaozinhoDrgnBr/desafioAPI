import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contaService } from '../services/api';
import { formatCurrency, formatDateTime, tipoContaLabels } from '../utils/formatters';
import ContaForm from './ContaForm';

const ContasList = () => {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingConta, setEditingConta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarContas();
  }, []);

  const carregarContas = async () => {
    try {
      setLoading(true);
      const response = await contaService.listar();
      setContas(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar contas: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta conta?')) {
      try {
        await contaService.deletar(id);
        setSuccess('Conta deletada com sucesso!');
        carregarContas();
      } catch (err) {
        setError('Erro ao deletar conta: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEdit = (conta) => {
    setEditingConta(conta);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingConta(null);
    carregarContas();
  };

  const handleAccessConta = (conta) => {
    navigate(`/contas/${conta.idConta}`);
  };

  if (showForm) {
    return (
      <ContaForm 
        conta={editingConta} 
        onClose={handleFormClose} 
      />
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Gerenciamento de Contas</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button 
          className="btn btn-success"
          onClick={() => setShowForm(true)}
        >
          Nova Conta
        </button>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div>
            <h2>Lista de Contas</h2>
            {contas.length === 0 ? (
              <p>Nenhuma conta cadastrada.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Saldo</th>
                    <th>Limite Saque</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Data Criação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contas.map((conta) => (
                    <tr key={conta.idConta}>
                      <td>{conta.idConta}</td>
                      <td>{conta.pessoa?.nome}</td>
                      <td>{formatCurrency(conta.saldo)}</td>
                      <td>{formatCurrency(conta.limiteSaqueDiario)}</td>
                      <td>{tipoContaLabels[conta.tipoConta] || 'Indefinido'}</td>
                      <td>
                        <span style={{ 
                          color: conta.flagAtivo ? '#27ae60' : '#e74c3c',
                          fontWeight: 'bold'
                        }}>
                          {conta.flagAtivo ? 'Ativa' : 'Bloqueada'}
                        </span>
                      </td>
                      <td>{formatDateTime(conta.dataCriacao)}</td>
                      <td>
                        <div className="actions">
                          <button 
                            className="btn btn-primary btn-small"
                            onClick={() => handleAccessConta(conta)}
                          >
                            Acessar
                          </button>
                          <button 
                            className="btn btn-warning btn-small"
                            onClick={() => handleEdit(conta)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn btn-danger btn-small"
                            onClick={() => handleDelete(conta.idConta)}
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContasList;


