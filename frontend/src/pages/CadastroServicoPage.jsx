import React, { useState } from 'react';
import api from '../api.js';

export function CadastroServicoPage() {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    prazoDias: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.nome || !form.descricao || !form.preco || !form.prazoDias) {
      return 'Todos os campos são obrigatórios.';
    }
    const preco = Number(form.preco);
    const prazo = Number(form.prazoDias);
    if (Number.isNaN(preco) || preco <= 0) return 'Preço deve ser numérico e maior que zero.';
    if (!Number.isInteger(prazo) || prazo <= 0) return 'Prazo deve ser um número inteiro em dias.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    try {
      const payload = {
        nome: form.nome,
        descricao: form.descricao,
        preco: Number(form.preco),
        prazoDias: Number(form.prazoDias),
      };
      const resp = await api.post('/servicos', payload);
      if (resp.data.success) {
        setSuccess('Serviço cadastrado com sucesso.');
        setForm({ nome: '', descricao: '', preco: '', prazoDias: '' });
      } else {
        setError(resp.data.message || 'Erro ao cadastrar serviço.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar serviço.');
    }
  }

  function handleClear() {
    setForm({ nome: '', descricao: '', preco: '', prazoDias: '' });
    setError('');
    setSuccess('');
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Cadastro de serviços de TI</h2>
            <span className="card-subtitle">Inclua novos serviços disponíveis no carrinho</span>
          </div>
          <p className="field-hint">
            Esta tela é usada para cadastrar os serviços de TI que poderão ser selecionados pelo cliente na
            página de solicitações.
          </p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Nome do serviço</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex.: Suporte Nível 1"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Descrição</label>
              <input
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Breve descrição do serviço prestado"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Preço (R$)</label>
              <input
                name="preco"
                value={form.preco}
                onChange={handleChange}
                placeholder="Ex.: 300"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Prazo de atendimento (dias)</label>
              <input
                name="prazoDias"
                value={form.prazoDias}
                onChange={handleChange}
                placeholder="Ex.: 3"
              />
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div>
              <button type="submit">Cadastrar serviço</button>
              <button type="button" className="secondary" onClick={handleClear}>
                Limpar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
