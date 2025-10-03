import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contaService, transacaoService } from '../services/api';
import { formatCurrency, formatDateTime, tipoContaLabels, tipoTransacaoLabels, tipoTransacaoColors } from '../utils/formatters';

const ContaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conta, setConta] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para operações
  const [valorOperacao, setValorOperacao] = useState('');
  const [contaDestinoId, setContaDestinoId] = useState('');
  
  // Estados para filtros
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [transacoesFiltradas, setTransacoesFiltradas] = useState([]);

  useEffect(() => {
    carregarDados();
  }, [id]);

  useEffect(() => {
    filtrarTransacoes();
  }, [transacoes, dataInicio, dataFim]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [contaResponse, transacoesResponse, contasResponse] = await Promise.all([
        contaService.buscarPorId(id),
        transacaoService.listar(),
        contaService.listar()
      ]);
      
      setConta(contaResponse.data);
      setTransacoes(transacoesResponse.data.filter(t => t.conta.idConta === parseInt(id)));
      setContas(contasResponse.data.filter(c => c.idConta !== parseInt(id)));
      setError('');
    } catch (err) {
      setError('Erro ao carregar dados: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filtrarTransacoes = () => {
    let transacoesFilt = [...transacoes];
    
    if (dataInicio) {
      transacoesFilt = transacoesFilt.filter(t => 
        new Date(t.dataTransacao) >= new Date(dataInicio + 'T00:00:00')
      );
    }
    
    if (dataFim) {
      transacoesFilt = transacoesFilt.filter(t => 
        new Date(t.dataTransacao) <= new Date(dataFim + 'T23:59:59')
      );
    }
    
    // Ordenar por data mais recente primeiro
    transacoesFilt.sort((a, b) => new Date(b.dataTransacao) - new Date(a.dataTransacao));
    
    setTransacoesFiltradas(transacoesFilt);
  };

  const realizarSaque = async () => {
    if (!valorOperacao || parseFloat(valorOperacao) <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }

    try {
      await transacaoService.saque(id, parseFloat(valorOperacao));
      setSuccess('Saque realizado com sucesso!');
      setValorOperacao('');
      carregarDados();
    } catch (err) {
      setError('Erro ao realizar saque: ' + (err.response?.data?.message || err.message));
    }
  };

  const realizarDeposito = async () => {
    if (!valorOperacao || parseFloat(valorOperacao) <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }

    try {
      await transacaoService.deposito(id, parseFloat(valorOperacao));
      setSuccess('Depósito realizado com sucesso!');
      setValorOperacao('');
      carregarDados();
    } catch (err) {
      setError('Erro ao realizar depósito: ' + (err.response?.data?.message || err.message));
    }
  };

  const realizarTransferencia = async () => {
    if (!valorOperacao || parseFloat(valorOperacao) <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }

    if (!contaDestinoId) {
      setError('Selecione a conta de destino');
      return;
    }

    try {
      await transacaoService.transferencia(contaDestinoId, id, parseFloat(valorOperacao));
      setSuccess('Transferência realizada com sucesso!');
      setValorOperacao('');
      setContaDestinoId('');
      carregarDados();
    } catch (err) {
      setError('Erro ao realizar transferência: ' + (err.response?.data?.message || err.message));
    }
  };

  const limparFiltros = () => {
    setDataInicio('');
    setDataFim('');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (!conta) {
    return (
      <div className="container">
        <div className="alert alert-error">Conta não encontrada</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>Conta #{conta.idConta}</h1>
          <button className="btn btn-primary" onClick={() => navigate('/contas')}>
            Voltar
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Informações da Conta */}
        <div className="balance-info">
          <div className="balance-card">
            <h3>Saldo Atual</h3>
            <div className="amount">{formatCurrency(conta.saldo)}</div>
          </div>
          <div className="balance-card">
            <h3>Limite Diário</h3>
            <div className="amount">{formatCurrency(conta.limiteSaqueDiario)}</div>
          </div>
          <div className="balance-card">
            <h3>Cliente</h3>
            <div>{conta.pessoa?.nome}</div>
          </div>
          <div className="balance-card">
            <h3>Tipo</h3>
            <div>{tipoContaLabels[conta.tipoConta]}</div>
          </div>
        </div>

        {/* Operações */}
        {conta.flagAtivo && (
          <div className="card">
            <h2>Operações</h2>
            
            <div className="form-group">
              <label>Valor da Operação:</label>
              <input
                type="number"
                value={valorOperacao}
                onChange={(e) => setValorOperacao(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
              />
            </div>

            <div className="actions" style={{ marginBottom: '1rem' }}>
              <button 
                className="btn btn-success"
                onClick={realizarDeposito}
                disabled={!valorOperacao}
              >
                Depositar
              </button>
              <button 
                className="btn btn-warning"
                onClick={realizarSaque}
                disabled={!valorOperacao}
              >
                Sacar
              </button>
            </div>

            <div className="form-group">
              <label>Transferir para:</label>
              <select
                value={contaDestinoId}
                onChange={(e) => setContaDestinoId(e.target.value)}
              >
                <option value="">Selecione a conta de destino</option>
                {contas.map((c) => (
                  <option key={c.idConta} value={c.idConta}>
                    Conta #{c.idConta} - {c.pessoa?.nome}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="btn btn-primary"
              onClick={realizarTransferencia}
              disabled={!valorOperacao || !contaDestinoId}
            >
              Transferir
            </button>
          </div>
        )}

        {!conta.flagAtivo && (
          <div className="alert alert-error">
            Esta conta está bloqueada e não permite operações.
          </div>
        )}

        {/* Histórico de Transações */}
        <div className="transactions-section">
          <h2>Histórico de Transações</h2>
          
          <div className="filter-section">
            <h3>Filtrar por Período</h3>
            <div className="filter-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Data Início:</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Data Fim:</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <button className="btn btn-warning" onClick={limparFiltros}>
                Limpar Filtros
              </button>
            </div>
          </div>

          {transacoesFiltradas.length === 0 ? (
            <p>Nenhuma transação encontrada para o período selecionado.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Data/Hora</th>
                </tr>
              </thead>
              <tbody>
                {transacoesFiltradas.map((transacao) => (
                  <tr key={transacao.idTransacao}>
                    <td>{transacao.idTransacao}</td>
                    <td>
                      <span style={{ 
                        color: tipoTransacaoColors[transacao.tipoTransacao],
                        fontWeight: 'bold'
                      }}>
                        {tipoTransacaoLabels[transacao.tipoTransacao]}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        color: ['DEPOSITO', 'TRANSFERENCIA_RECEBIDA'].includes(transacao.tipoTransacao) 
                          ? '#27ae60' : '#e74c3c',
                        fontWeight: 'bold'
                      }}>
                        {['DEPOSITO', 'TRANSFERENCIA_RECEBIDA'].includes(transacao.tipoTransacao) ? '+' : '-'}
                        {formatCurrency(transacao.valor)}
                      </span>
                    </td>
                    <td>{formatDateTime(transacao.dataTransacao)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContaDetails;


