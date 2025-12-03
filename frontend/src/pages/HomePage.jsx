import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import office1 from '../assets/escritorio1.jpg';
import office2 from '../assets/escritorio2.png';
import office3 from '../assets/escritorio3.jpeg';
import office4 from '../assets/escritorio4.webp';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <section className="page-hero">
          <div className="page-hero-main">
            <div className="hero-badge">Empresa de serviços de TI • Recife</div>
            <h1 className="hero-title">Infraestrutura estável, suporte humano e segurança de dados.</h1>
            <p className="hero-subtitle">
              Atuamos como o time de TI das pequenas e médias empresas: monitoramos, prevenimos incidentes
              e garantimos disponibilidade para que o seu negócio não pare.
            </p>
          </div>
          <aside className="page-hero-kpi">
            <div>
              <div className="hero-kpi-label">Clientes ativos</div>
              <div className="hero-kpi-value">+120</div>
              <div className="muted">empresas atendidas em todo o Brasil</div>
            </div>
            <div>
              <div className="hero-kpi-label">SLA médio</div>
              <div className="hero-kpi-value">97,3%</div>
              <div className="muted">chamados resolvidos no primeiro atendimento</div>
            </div>
            <div>
              <div className="hero-kpi-label">Monitoramento</div>
              <div className="muted">24/7 de servidores, links e serviços críticos</div>
            </div>
          </aside>
        </section>

        <section className="page-content">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">História</h2>
              <span className="card-subtitle">Quem somos e como começamos</span>
            </div>
            <p>
              Fundada em 2010 por três engenheiros de software, nossa empresa nasceu com o propósito de
              simplificar o uso de tecnologia para negócios que não possuem equipe própria de TI. Começamos
              atendendo escritórios locais e, hoje, acompanhamos empresas de diversos segmentos em todo o país.
            </p>
          </div>

          <div className="section-grid">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Vídeo institucional</h2>
                <span className="card-subtitle">Visão geral em 1 minuto</span>
              </div>
              <p className="muted">Assista ao vídeo institucional da empresa hospedado no YouTube.</p>
              <iframe
                width="100%"
                height="260"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Vídeo institucional"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Galeria de fotos</h2>
                <span className="card-subtitle">Ambiente de trabalho e equipe</span>
              </div>
              <div className="gallery-grid">
                <img src={office1} className="gallery-img" alt="Escritório 1" />
                <img src={office2} className="gallery-img" alt="Escritório 2" />
                <img src={office3} className="gallery-img" alt="Escritório 3" />
                <img src={office4} className="gallery-img" alt="Escritório 4" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Principais serviços de TI</h2>
              <span className="card-subtitle">O que entregamos no dia a dia</span>
            </div>
            <ul>
              <li>Suporte técnico remoto e presencial para usuários e estações de trabalho.</li>
              <li>Monitoramento de servidores, links de internet e ativos de rede.</li>
              <li>Projetos e operação de backup e recuperação de desastres.</li>
              <li>Implantação de políticas de segurança, firewall e controle de acesso.</li>
            </ul>
            <div className="tag-list">
              <span className="tag">Help desk</span>
              <span className="tag">Monitoramento 24/7</span>
              <span className="tag">Cloud</span>
              <span className="tag">Segurança da informação</span>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Fundadores</h2>
              <span className="card-subtitle">Quem está por trás da operação</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Cargo</th>
                  <th>Nome</th>
                  <th>Mini CV</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CEO</td>
                  <td>Ana Silva</td>
                  <td>Engenheira de Computação, 15 anos de experiência em gestão de TI corporativa.</td>
                </tr>
                <tr>
                  <td>CTO</td>
                  <td>Bruno Santos</td>
                  <td>Especialista em arquitetura de redes, cloud e segurança da informação.</td>
                </tr>
                <tr>
                  <td>COO</td>
                  <td>Carla Oliveira</td>
                  <td>Analista de sistemas com foco em governança, processos e atendimento ao cliente.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Contatos & pagamento</h2>
              <span className="card-subtitle">Canais oficiais e formas de contratação</span>
            </div>
            <ul className="contact-list">
              <li>Telefone fixo: (81) 3333-0000</li>
              <li>WhatsApp: (81) 98888-0000</li>
              <li>E-mail: contato@empresa-ti.com</li>
            </ul>
            <p>Endereço: Rua da Tecnologia, 123 – Recife – PE</p>
            <p className="muted">
              Atendemos em modelo remoto e presencial para Recife e região metropolitana.
            </p>
            <div className="pill-row">
              <span className="pill">Visa</span>
              <span className="pill">MasterCard</span>
              <span className="pill">Pix</span>
              <span className="pill">Boleto bancário</span>
            </div>
          </div>

          {user && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Área do cliente</h2>
              </div>
              <p>
                Você está logado como <strong>{user.login}</strong>. Use o menu superior para acessar o carrinho
                de serviços e acompanhar suas solicitações.
              </p>
            </div>
          )}
        </section>

        <footer className="app-footer">
          <div className="app-footer-inner">
            <span>© {new Date().getFullYear()} Serviços de TI. Todos os direitos reservados.</span>
            <span className="muted">Infraestrutura, suporte e segurança para empresas em crescimento.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
