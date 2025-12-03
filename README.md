# Projeto AV2 – Sistema de Serviços de TI  
Aplicação completa (Frontend + Backend) desenvolvida para atender todos os requisitos da AV2, incluindo autenticação, cadastro de clientes, gerenciamento de serviços, carrinho de solicitações e área institucional completa.

---

## 📌 Estrutura Geral do Projeto

O projeto é dividido em duas partes principais:

```
projeto_av2/
│
├── backend/        → API Node.js + Express + SQLite
└── frontend/       → Interface Web em React + Vite
```

---

# 🖥️ BACKEND

### ✔️ Tecnologias utilizadas
- Node.js
- Express
- SQLite3
- CORS + body‑parser

### ✔️ Como rodar o backend

```bash
cd backend
npm install
npm start
```

Servidor iniciará em:  
👉 **http://localhost:4000**  

### ✔️ Endpoints principais

| Método | Rota | Descrição |
|--------|-------|-----------|
| POST | `/auth/login` | Login de cliente |
| POST | `/auth/change-password` | Troca de senha |
| POST | `/clientes` | Cadastro de cliente |
| POST | `/servicos` | Cadastro de novo serviço de TI |
| GET | `/servicos` | Lista de serviços |
| GET | `/solicitacoes/:login` | Solicitações de um cliente |
| PUT | `/solicitacoes/:login` | Atualiza solicitações |

O banco `ti_services.db` é criado automaticamente no primeiro uso.

---

# 🌐 FRONTEND

### ✔️ Tecnologias utilizadas
- React + Vite
- React Router
- Context API (auth global)
- Axios
- CSS estilizado (tema escuro)

### ✔️ Como rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend iniciará em:  
👉 **http://localhost:5173**

---

# 📄 Páginas implementadas

### 🏠 **HomePage**
- História da empresa  
- Vídeo institucional (YouTube)  
- Galeria de fotos (4 imagens)  
- Serviços oferecidos  
- Fundadores  
- Contatos e formas de pagamento  

### 🔐 **LoginPage**
- Validação de e-mail  
- Erros e mensagens de sucesso  
- Retorna cliente autenticado pelo backend  

### 🔄 **TrocaSenhaPage**
- Valida regras obrigatórias de senha (complexidade)  
- Confirmação obrigatória  
- Integra com `/auth/change-password`  

### 🧍 **CadastroClientePage**
- Validação completa:
  - e-mail
  - senha forte + confirmação
  - nome completo
  - CPF (com máscara + validação real)
  - maioridade (18+)
  - telefone (opcional)
  - estado civil (radio)
  - escolaridade (select)

### 🛒 **CarrinhoPage**
- Usuário logado
- Carrega serviços do backend  
- Carrega solicitações já existentes  
- Adiciona novos serviços  
- Remove serviços  
- Salva tudo via `/solicitacoes/:login`  
- Exibe total em reais  

### 🧩 **CadastroServicoPage**
- Cadastra novos serviços usados no carrinho

---

# 🧭 Navegação (NavBar)
- Início  
- Login  
- Cadastro de Cliente  
- Troca de Senha  
- Carrinho (somente logado)  
- Cadastro de Serviço  
- Badge com usuário logado + botão Sair

---

# 🖼️ Imagens da Galeria
Arquivos armazenados em:
```
frontend/src/assets/
  escritorio1.jpeg
  escritorio2.jpg
  escritorio3.jpg
  escritorio4.jpg
```

---

# ✔️ Requisitos da AV2 atendidos
- Tela institucional completa (história, vídeo, galeria)
- Login com validação  
- Cadastro de cliente com regras obrigatórias  
- Troca de senha com validação forte  
- Cadastro de serviços  
- Solicitação de serviços (carrinho)  
- Banco de dados persistente  
- Código organizado e modular  
- Layout visual moderno (tema escuro)  

---

# 📦 Como executar tudo

1️⃣ Rodar o **backend**  
```bash
cd backend
npm install
npm start
```

2️⃣ Rodar o **frontend**  
```bash
cd frontend
npm install
npm run dev
```

3️⃣ Acessar em:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:4000

---

# 📘 Observações finais
- O projeto está pronto para entrega.  
- Todo o código foi construído para ser facilmente avaliado e expandido.  
- Pode ser usado em produção local, faculdade ou testes.
