import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const senhaPermitidos = /[@#$%&*!?/\\|\-_=+.]/;
const senhaNaoPermitidos = /[¨{}\[\]´`~^:;<>,"']/;

function validarSenhaForte(s) {
  if (!s || s.length < 6) return false;
  if (!/[0-9]/.test(s)) return false;
  if (!/[A-Z]/.test(s)) return false;
  if (!senhaPermitidos.test(s)) return false;
  if (senhaNaoPermitidos.test(s)) return false;
  return true;
}

export function TrocaSenhaPage() {
  const [login, setLogin] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const loginRef = useRef(null);

  function validate() {
    if (!login) return 'Login é obrigatório.';
    if (!emailRegex.test(login)) return 'Login deve ser e-mail válido.';
    if (!senhaAtual) return 'Senha atual é obrigatória.';
    if (!novaSenha) return 'Nova senha é obrigatória.';
    if (!confirmacao) return 'Confirmação é obrigatória.';
    if (novaSenha !== confirmacao) return 'Senha e confirmação devem ser iguais.';
    if (!validarSenhaForte(novaSenha)) {
      return 'Senha deve ter pelo menos 6 caracteres, com número, letra maiúscula e caractere especial permitido, sem caracteres proibidos.';
    }
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
      const resp = await api.post('/auth/change-password', { login, senhaAtual, novaSenha });
      if (resp.data.success) {
        setSuccess('Validação realizada com sucesso.');
        setTimeout(() => navigate(-1), 700);
      } else {
        setError(resp.data.message || 'Erro na troca de senha.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro na troca de senha.');
    }
  }

  function handleClear() {
    setLogin('');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmacao('');
    setError('');
    setSuccess('');
    if (loginRef.current) loginRef.current.focus();
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Troca de senha de clientes</h2>
            <span className="card-subtitle">Refaça sua senha seguindo as regras de segurança</span>
          </div>
          <p className="field-hint">
            Regra: senha com pelo menos 6 caracteres, incluindo número, letra maiúscula e um caractere especial
            permitido (@ # $ % & * ! ? / \ | - _ + . =). Não são permitidos: ¨ &#123; &#125; [ ] ´ ` ~ ^ : ; &lt;
            &gt; , " '.
          </p>

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
              <label className="field-label">Senha atual</label>
              <input
                type="password"
                value={senhaAtual}
                onChange={e => setSenhaAtual(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Nova senha</label>
              <input
                type="password"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Confirmação da nova senha</label>
              <input
                type="password"
                value={confirmacao}
                onChange={e => setConfirmacao(e.target.value)}
              />
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div>
              <button type="submit">Trocar senha</button>
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
