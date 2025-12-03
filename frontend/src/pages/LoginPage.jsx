import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login: doLogin } = useAuth();
  const loginRef = useRef(null);

  function validate() {
    if (!login) return 'Login é obrigatório.';
    if (!emailRegex.test(login)) return 'Login deve ser um e-mail válido.';
    if (!senha) return 'Senha é obrigatória.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const resp = await api.post('/auth/login', { login, senha });
      if (resp.data.success) {
        doLogin(resp.data.cliente);
        setSuccess('Validação realizada com sucesso.');
        setTimeout(() => navigate('/'), 600);
      } else {
        setError(resp.data.message || 'Falha no login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao autenticar.');
    }
  }

  function handleClear() {
    setLogin('');
    setSenha('');
    setError('');
    setSuccess('');
    if (loginRef.current) loginRef.current.focus();
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Login de clientes</h2>
            <span className="card-subtitle">Acesse a área para solicitar e acompanhar serviços</span>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Login (e-mail)</label>
              <input
                ref={loginRef}
                value={login}
                onChange={e => setLogin(e.target.value)}
                placeholder="cliente@empresa.com"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Sua senha de acesso"
              />
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div>
              <button type="submit">Realizar login</button>
              <button type="button" className="secondary" onClick={handleClear}>
                Limpar
              </button>
            </div>
          </form>

          <p className="muted" style={{ marginTop: '0.8rem' }}>
            <Link to="/troca-senha">Trocar senha</Link> •{' '}
            <Link to="/cadastro-cliente">Cadastrar novo cliente</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
