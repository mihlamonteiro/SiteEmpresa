import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function CarrinhoPage() {
  const { user } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const respServ = await api.get('/servicos');
        setServicos(respServ.data.servicos || []);
        if (user?.login) {
          const respSol = await api.get(`/solicitacoes/${encodeURIComponent(user.login)}`);
          setSolicitacoes(respSol.data.solicitacoes || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    carregar();
  }, [user]);

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="page-inner">
          <div className="card">
            <p>Você precisa estar logado para acessar o carrinho de serviços.</p>
          </div>
        </div>
      </div>
    );
  }

  const servicoAtual = servicos.find(s => String(s.id) === String(servicoSelecionado));

  function handleAdicionar() {
    setErro('');
    setMensagem('');
    if (!servicoAtual) {
      setErro('Selecione um serviço de TI para incluir na solicitação.');
      return;
    }
    const hoje = new Date();
    const dataPedido = hoje.toISOString().substring(0, 10);
    const prazoDias = servicoAtual.prazoDias;
    const dataPrevista = new Date(hoje.getTime() + prazoDias * 24 * 60 * 60 * 1000)
      .toISOString()
      .substring(0, 10);

    const nova = {
      id: Math.random().toString(36).slice(2),
      servicoId: servicoAtual.id,
      servicoNome: servicoAtual.nome,
      dataPedido,
      status: 'EM ELABORAÇÃO',
      precoCobrado: servicoAtual.preco,
      dataPrevista,
    };
    setSolicitacoes(prev => [...prev, nova]);
  }

  function handleExcluir(idx) {
    setSolicitacoes(prev => prev.filter((_, index) => index !== idx));
  }

  async function handleSalvar() {
    setErro('');
    setMensagem('');
    try {
      const payload = {
        solicitacoes: solicitacoes.map(s => ({
          servicoId: s.servicoId,
          dataPedido: s.dataPedido,
          status: s.status,
          precoCobrado: s.precoCobrado,
          dataPrevista: s.dataPrevista,
        })),
      };
      const resp = await api.put(`/solicitacoes/${encodeURIComponent(user.login)}`, payload);
      if (resp.data.success) {
        setMensagem('Solicitações atualizadas com sucesso.');
      } else {
        setErro(resp.data.message || 'Erro ao salvar solicitações.');
      }
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar solicitações.');
    }
  }

  const total = solicitacoes.reduce((sum, s) => sum + (s.precoCobrado || 0), 0);

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Carrinho de solicitação de serviços de TI</h2>
            <span className="card-subtitle">Monte e atualize suas demandas de TI</span>
          </div>

          <div className="section-grid">
            <div>
              <p className="muted">
                Cliente logado: <strong>{user.nome || user.login}</strong> ({user.login})
              </p>

              <h3 style={{ fontSize: '0.9rem', marginTop: '0.6rem' }}>Solicitações já cadastradas</h3>
              {solicitacoes.length === 0 ? (
                <p className="muted">Nenhuma solicitação encontrada para este cliente.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Data</th>
                      <th>Serviço de TI</th>
                      <th>Status</th>
                      <th>Preço</th>
                      <th>Previsto para</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitacoes.map((s, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{s.dataPedido}</td>
                        <td>{s.servicoNome}</td>
                        <td>
                          <span className="badge-status">{s.status}</span>
                        </td>
                        <td>R$ {s.precoCobrado.toFixed(2)}</td>
                        <td>{s.dataPrevista}</td>
                        <td>
                          <div className="table-actions">
                            <button type="button" className="secondary" onClick={() => handleExcluir(idx)}>
                              Remover
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <p className="muted" style={{ marginTop: '0.4rem' }}>
                Total previsto: <strong>R$ {total.toFixed(2)}</strong>
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>Nova solicitação</h3>

              <div className="field-group">
                <label className="field-label">Serviço de TI</label>
                <select
                  value={servicoSelecionado}
                  onChange={e => setServicoSelecionado(e.target.value)}
                >
                  <option value="">Selecione um serviço...</option>
                  {servicos.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nome}
                    </option>
                  ))}
                </select>
              </div>

              {servicoAtual && (
                <p className="muted" style={{ marginTop: '0.3rem' }}>
                  Preço: <strong>R$ {servicoAtual.preco.toFixed(2)}</strong> • Prazo de atendimento:{' '}
                  <strong>{servicoAtual.prazoDias} dia(s)</strong>
                </p>
              )}

              {erro && <div className="error">{erro}</div>}
              {mensagem && <div className="success">{mensagem}</div>}

              <div style={{ marginTop: '0.4rem' }}>
                <button type="button" onClick={handleAdicionar}>
                  Incluir solicitação na tabela
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={handleSalvar}
                  style={{ marginLeft: '0.4rem' }}
                >
                  Atualizar solicitações no servidor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
