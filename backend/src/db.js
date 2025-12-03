import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'ti_services.db');
export const db = new sqlite3.Database(dbPath);

export function initDb() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL,
      dataNascimento TEXT NOT NULL,
      telefone TEXT,
      estadoCivil TEXT,
      escolaridade TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL,
      preco REAL NOT NULL,
      prazoDias INTEGER NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS solicitacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clienteId INTEGER NOT NULL,
      servicoId INTEGER NOT NULL,
      dataPedido TEXT NOT NULL,
      status TEXT NOT NULL,
      precoCobrado REAL NOT NULL,
      dataPrevista TEXT NOT NULL,
      FOREIGN KEY (clienteId) REFERENCES clientes(id),
      FOREIGN KEY (servicoId) REFERENCES servicos(id)
    )`);

    db.get('SELECT COUNT(*) as count FROM servicos', (err, row) => {
      if (!err && row.count === 0) {
        const stmt = db.prepare('INSERT INTO servicos (nome, descricao, preco, prazoDias) VALUES (?, ?, ?, ?)');
        stmt.run('Suporte Nível 1', 'Atendimento remoto para incidentes básicos', 150.0, 2);
        stmt.run('Backup em Nuvem', 'Configuração e monitoramento de backups', 320.0, 5);
        stmt.run('Monitoramento 24/7', 'Monitoramento contínuo de infraestrutura', 890.0, 1);
        stmt.run('Projeto de Segurança', 'Análise e reforço de segurança da informação', 1200.0, 7);
        stmt.finalize();
      }
    });
  });
}
