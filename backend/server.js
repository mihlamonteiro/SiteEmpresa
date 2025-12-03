import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initDb, db } from './src/db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

initDb();

function requireFields(fields, body) {
  const missing = fields.filter(f => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length > 0) {
    return `Campos obrigatórios faltando: ${missing.join(', ')}`;
  }
  return null;
}

// -------- Autenticação --------
app.post('/auth/login', (req, res) => {
  const { login, senha } = req.body;
  const errMsg = requireFields(['login', 'senha'], req.body);
  if (errMsg) return res.status(400).json({ success: false, message: errMsg });

  db.get('SELECT * FROM clientes WHERE login = ?', [login], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro de banco de dados' });
    if (!row || row.senha !== senha) {
      return res.status(401).json({ success: false, message: 'Login ou senha inválidos' });
    }
    return res.json({
      success: true,
      message: 'Autenticação realizada com sucesso',
      cliente: { id: row.id, nome: row.nome, login: row.login }
    });
  });
});

// -------- Troca senha --------
app.post('/auth/change-password', (req, res) => {
  const { login, senhaAtual, novaSenha } = req.body;
  const errMsg = requireFields(['login', 'senhaAtual', 'novaSenha'], req.body);
  if (errMsg) return res.status(400).json({ success: false, message: errMsg });

  db.get('SELECT * FROM clientes WHERE login = ?', [login], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro de banco de dados' });
    if (!row || row.senha !== senhaAtual) {
      return res.status(401).json({ success: false, message: 'Autenticação inválida' });
    }
    db.run('UPDATE clientes SET senha = ? WHERE id = ?', [novaSenha, row.id], function (err2) {
      if (err2) return res.status(500).json({ success: false, message: 'Erro ao atualizar senha' });
      return res.json({ success: true, message: 'Senha atualizada com sucesso' });
    });
  });
});

// -------- Cadastro cliente --------
app.post('/clientes', (req, res) => {
  const { login, senha, nome, cpf, dataNascimento, telefone, estadoCivil, escolaridade } = req.body;
  const errMsg = requireFields(['login', 'senha', 'nome', 'cpf', 'dataNascimento'], req.body);
  if (errMsg) return res.status(400).json({ success: false, message: errMsg });

  db.get('SELECT id FROM clientes WHERE login = ?', [login], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro de banco de dados' });
    if (row) return res.status(400).json({ success: false, message: 'Login já existente' });

    db.run(
      `INSERT INTO clientes (login, senha, nome, cpf, dataNascimento, telefone, estadoCivil, escolaridade)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [login, senha, nome, cpf, dataNascimento, telefone || null, estadoCivil || null, escolaridade || null],
      function (err2) {
        if (err2) return res.status(500).json({ success: false, message: 'Erro ao cadastrar cliente' });
        return res.json({ success: true, message: 'Cliente cadastrado com sucesso' });
      }
    );
  });
});

// -------- Cadastro serviço TI --------
app.post('/servicos', (req, res) => {
  const { nome, descricao, preco, prazoDias } = req.body;
  const errMsg = requireFields(['nome', 'descricao', 'preco', 'prazoDias'], req.body);
  if (errMsg) return res.status(400).json({ success: false, message: errMsg });

  db.run(
    `INSERT INTO servicos (nome, descricao, preco, prazoDias)
     VALUES (?, ?, ?, ?)`,
    [nome, descricao, preco, prazoDias],
    function (err) {
      if (err) return res.status(500).json({ success: false, message: 'Erro ao cadastrar serviço' });
      return res.json({ success: true, message: 'Serviço cadastrado com sucesso', id: this.lastID });
    }
  );
});

// -------- Consulta serviços --------
app.get('/servicos', (req, res) => {
  db.all('SELECT * FROM servicos', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao consultar serviços' });
    return res.json({ success: true, servicos: rows });
  });
});

// -------- Consulta solicitações de um usuário --------
app.get('/solicitacoes/:login', (req, res) => {
  const { login } = req.params;
  db.get('SELECT id FROM clientes WHERE login = ?', [login], (err, cliente) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro de banco de dados' });
    if (!cliente) return res.status(404).json({ success: false, message: 'Cliente não encontrado' });

    db.all(
      `SELECT s.id, s.dataPedido, s.status, s.precoCobrado, s.dataPrevista,
              sv.nome as servicoNome, sv.id as servicoId
       FROM solicitacoes s
       JOIN servicos sv ON s.servicoId = sv.id
       WHERE s.clienteId = ?
       ORDER BY s.dataPedido ASC`,
      [cliente.id],
      (err2, rows) => {
        if (err2) return res.status(500).json({ success: false, message: 'Erro ao consultar solicitações' });
        return res.json({ success: true, solicitacoes: rows });
      }
    );
  });
});

// -------- Atualização de solicitações --------
app.put('/solicitacoes/:login', (req, res) => {
  const { login } = req.params;
  const { solicitacoes } = req.body;
  if (!Array.isArray(solicitacoes)) {
    return res.status(400).json({ success: false, message: 'Lista de solicitações inválida' });
  }

  db.get('SELECT id FROM clientes WHERE login = ?', [login], (err, cliente) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro de banco de dados' });
    if (!cliente) return res.status(404).json({ success: false, message: 'Cliente não encontrado' });

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      db.run('DELETE FROM solicitacoes WHERE clienteId = ?', [cliente.id]);

      const stmt = db.prepare(
        `INSERT INTO solicitacoes (clienteId, servicoId, dataPedido, status, precoCobrado, dataPrevista)
         VALUES (?, ?, ?, ?, ?, ?)`
      );

      for (const s of solicitacoes) {
        stmt.run([
          cliente.id,
          s.servicoId,
          s.dataPedido,
          s.status || 'EM ELABORAÇÃO',
          s.precoCobrado,
          s.dataPrevista
        ]);
      }

      stmt.finalize(err2 => {
        if (err2) {
          db.run('ROLLBACK');
          return res.status(500).json({ success: false, message: 'Erro ao salvar solicitações' });
        }
        db.run('COMMIT', err3 => {
          if (err3) return res.status(500).json({ success: false, message: 'Erro ao finalizar transação' });
          return res.json({ success: true, message: 'Solicitações atualizadas com sucesso' });
        });
      });
    });
  });
});

app.get('/', (req, res) => {
  res.send('Backend de Serviços de TI rodando');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
