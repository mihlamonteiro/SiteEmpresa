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

function validarCPF(cpf) {
  if (!cpf) return false;
  const apenasDigitos = cpf.replace(/\D/g, '');
  if (apenasDigitos.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(apenasDigitos)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(apenasDigitos[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(apenasDigitos[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(apenasDigitos[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(apenasDigitos[10])) return false;
  return true;
}

export function CadastroClientePage() {
  const [form, setForm] = useState({
    login: '',
    senha: '',
    confirmacaoSenha: '',
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    estadoCivil: 'solteiro',
    escolaridade: '2grau',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const emailRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.login) return 'E-mail é obrigatório.';
    if (!emailRegex.test(form.login)) return 'E-mail inválido.';
    if (!form.senha || !form.confirmacaoSenha) return 'Senha e confirmação são obrigatórias.';
    if (form.senha !== form.confirmacaoSenha) return 'Senha e confirmação devem ser iguais.';
    if (!validarSenhaForte(form.senha)) {
      return 'Senha deve ter pelo menos 6 caracteres, com número, letra maiúscula e caractere especial permitido, sem caracteres proibidos.';
    }
    if (!form.nome) return 'Nome é obrigatório.';
    const partesNome = form.nome.trim().split(/\s+/);
    if (partesNome.length < 2 || partesNome[0].length < 2) {
      return 'Nome deve ter pelo menos duas palavras e a primeira com 2+ caracteres.';
    }
    const especiais = /[¨{}\[\]´`~^:;<>,"'@#$%&*!?/\\|\-_=+.]/;
    if (especiais.test(form.nome)) return 'Nome não pode conter caracteres especiais.';

    if (!form.cpf) return 'CPF é obrigatório.';
    const mascaraCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!mascaraCpf.test(form.cpf)) return 'CPF deve estar no formato NNN.NNN.NNN-NN.';
    if (!validarCPF(form.cpf)) return 'CPF inválido.';

    if (!form.dataNascimento) return 'Data de nascimento é obrigatória.';
    const hoje = new Date();
    const dn = new Date(form.dataNascimento);
    const diffAno = hoje.getFullYear() - dn.getFullYear();
    const jaFezAniversario =
      hoje.getMonth() > dn.getMonth() ||
      (hoje.getMonth() === dn.getMonth() && hoje.getDate() >= dn.getDate());
    const idade = jaFezAniversario ? diffAno : diffAno - 1;
    if (idade < 18) return 'Cliente deve ser maior de idade.';

    if (form.telefone) {
      const telDigitos = form.telefone.replace(/\D/g, '');
      if (telDigitos.length < 10 || telDigitos.length > 11) {
        return 'Telefone deve ter 10 ou 11 dígitos (com DDD).';
      }
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
      const payload = {
        login: form.login,
        senha: form.senha,
        nome: form.nome,
        cpf: form.cpf,
        dataNascimento: form.dataNascimento,
        telefone: form.telefone || null,
        estadoCivil: form.estadoCivil,
        escolaridade: form.escolaridade,
      };
      const resp = await api.post('/clientes', payload);
      if (resp.data.success) {
        setSuccess('Validação realizada com sucesso.');
        setTimeout(() => navigate('/login'), 700);
      } else {
        setError(resp.data.message || 'Erro ao cadastrar.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar.');
    }
  }

  function handleClear() {
    setForm({
      login: '',
      senha: '',
      confirmacaoSenha: '',
      nome: '',
      cpf: '',
      dataNascimento: '',
      telefone: '',
      estadoCivil: 'solteiro',
      escolaridade: '2grau',
    });
    setError('');
    setSuccess('');
    if (emailRef.current) emailRef.current.focus();
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Cadastro de clientes</h2>
            <span className="card-subtitle">Preencha os dados para criar seu acesso</span>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">E-mail (login)</label>
              <input
                ref={emailRef}
                name="login"
                value={form.login}
                onChange={handleChange}
                placeholder="cliente@empresa.com"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Senha</label>
              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
              />
              <span className="field-hint">
                Mínimo de 6 caracteres, com número, letra maiúscula e caractere especial permitido.
              </span>
            </div>

            <div className="field-group">
              <label className="field-label">Confirmação de senha</label>
              <input
                type="password"
                name="confirmacaoSenha"
                value={form.confirmacaoSenha}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Nome completo</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome e sobrenome"
              />
            </div>

            <div className="field-group">
              <label className="field-label">CPF (NNN.NNN.NNN-NN)</label>
              <input
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Data de nascimento</label>
              <input
                type="date"
                name="dataNascimento"
                value={form.dataNascimento}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Telefone / WhatsApp (opcional)</label>
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(DDD) 99999-9999"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Estado civil</label>
              <div className="radio-row">
                <label>
                  <input
                    type="radio"
                    name="estadoCivil"
                    value="solteiro"
                    checked={form.estadoCivil === 'solteiro'}
                    onChange={handleChange}
                  />{' '}
                  Solteiro(a)
                </label>
                <label>
                  <input
                    type="radio"
                    name="estadoCivil"
                    value="casado"
                    checked={form.estadoCivil === 'casado'}
                    onChange={handleChange}
                  />{' '}
                  Casado(a)
                </label>
                <label>
                  <input
                    type="radio"
                    name="estadoCivil"
                    value="divorciado"
                    checked={form.estadoCivil === 'divorciado'}
                    onChange={handleChange}
                  />{' '}
                  Divorciado(a)
                </label>
                <label>
                  <input
                    type="radio"
                    name="estadoCivil"
                    value="viuvo"
                    checked={form.estadoCivil === 'viuvo'}
                    onChange={handleChange}
                  />{' '}
                  Viúvo(a)
                </label>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Escolaridade</label>
              <select
                name="escolaridade"
                value={form.escolaridade}
                onChange={handleChange}
              >
                <option value="1incompleto">1º grau incompleto</option>
                <option value="1completo">1º grau completo</option>
                <option value="2grau">2º grau completo</option>
                <option value="superior">Nível superior</option>
                <option value="pos">Pós-graduação</option>
              </select>
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div>
              <button type="submit">Incluir</button>
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
