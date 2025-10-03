import React, { useState, useEffect } from 'react';
import { pessoaService } from '../services/api';
import { formatCPF, formatDate } from '../utils/formatters';
import PessoaForm from './PessoaForm';

const PessoasList = () => {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      setLoading(true);
      const response = await pessoaService.listar();
      setPessoas(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar pessoas: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta pessoa?')) {
      try {
        await pessoaService.deletar(id);
        setSuccess('Pessoa deletada com sucesso!');
        carregarPessoas();
      } catch (err) {
        setError('Erro ao deletar pessoa: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEdit = (pessoa) => {
    setEditingPessoa(pessoa);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPessoa(null);
    carregarPessoas();
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setSearchResult(null);
      return;
    }

    try {
      const response = await pessoaService.buscarPorId(searchId);
      setSearchResult(response.data);
      setError('');
    } catch (err) {
      setError('Pessoa não encontrada');
      setSearchResult(null);
    }
  };

  const clearSearch = () => {
    setSearchId('');
    setSearchResult(null);
  };

  if (showForm) {
    return (
      <PessoaForm 
        pessoa={editingPessoa} 
        onClose={handleFormClose} 
      />
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Gerenciamento de Pessoas</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="search-box">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Buscar por ID:</label>
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Digite o ID da pessoa"
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch}>
            Buscar
          </button>
          {searchResult && (
            <button className="btn btn-warning" onClick={clearSearch}>
              Limpar
            </button>
          )}
        </div>

        {searchResult && (
          <div className="card">
            <h3>Resultado da Busca:</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Data Nascimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchResult.idPessoa}</td>
                  <td>{searchResult.nome}</td>
                  <td>{formatCPF(searchResult.cpf)}</td>
                  <td>{formatDate(searchResult.dataNascimento)}</td>
                  <td>
                    <div className="actions">
                      <button 
                        className="btn btn-warning btn-small"
                        onClick={() => handleEdit(searchResult)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(searchResult.idPessoa)}
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <button 
          className="btn btn-success"
          onClick={() => setShowForm(true)}
        >
          Nova Pessoa
        </button>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div>
            <h2>Lista de Pessoas</h2>
            {pessoas.length === 0 ? (
              <p>Nenhuma pessoa cadastrada.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Data Nascimento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pessoas.map((pessoa) => (
                    <tr key={pessoa.idPessoa}>
                      <td>{pessoa.idPessoa}</td>
                      <td>{pessoa.nome}</td>
                      <td>{formatCPF(pessoa.cpf)}</td>
                      <td>{formatDate(pessoa.dataNascimento)}</td>
                      <td>
                        <div className="actions">
                          <button 
                            className="btn btn-warning btn-small"
                            onClick={() => handleEdit(pessoa)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn btn-danger btn-small"
                            onClick={() => handleDelete(pessoa.idPessoa)}
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

export default PessoasList;

