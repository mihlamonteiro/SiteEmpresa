import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { TrocaSenhaPage } from './pages/TrocaSenhaPage.jsx';
import { CadastroClientePage } from './pages/CadastroClientePage.jsx';
import { CarrinhoPage } from './pages/CarrinhoPage.jsx';
import { CadastroServicoPage } from './pages/CadastroServicoPage.jsx';
import { NavBar } from './components/NavBar.jsx';
import { AppShell } from './components/AppShell.jsx';

export default function App() {
  return (
    <AppShell>
      <NavBar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/troca-senha" element={<TrocaSenhaPage />} />
          <Route path="/cadastro-cliente" element={<CadastroClientePage />} />
          <Route path="/carrinho" element={<CarrinhoPage />} />
          <Route path="/cadastro-servico" element={<CadastroServicoPage />} />
        </Routes>
      </main>
    </AppShell>
  );
}
