import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function NavLink({ to, children, primary }) {
  const location = useLocation();
  const active = location.pathname === to;
  const baseClass = primary ? 'nav-link nav-link-primary' : 'nav-link';
  return (
    <Link className={active && !primary ? baseClass + ' active' : baseClass} to={to}>
      {children}
    </Link>
  );
}

export function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="brand">
          <div className="brand-logo">TI</div>
          <div>
            <div className="brand-text-main">Serviços de TI</div>
            <div className="brand-text-sub">Infraestrutura • Suporte • Segurança</div>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/cadastro-cliente">Cadastro</NavLink>
          {user && <NavLink to="/carrinho">Solicitar serviços</NavLink>}
          {user && <NavLink to="/cadastro-servico">Serviços de TI</NavLink>}
          {!user && <NavLink to="/login" primary>Área do cliente</NavLink>}
          {user && (
            <div className="user-pill">
              <span>{user.login}</span>
              <button type="button" className="secondary" onClick={logout}>
                Sair
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
