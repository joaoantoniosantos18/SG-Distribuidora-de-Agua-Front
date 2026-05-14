import { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext)
  const { tema, alternarTema } = useContext(ThemeContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const estaNaPaginaAuth = location.pathname === '/login' || location.pathname === '/cadastro'

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={usuario ? '/produtos' : '/login'} className="navbar-logo">
          💧 Distribuidora
        </Link>

        <div className="navbar-menu">
          {!usuario ? (
            <>
              {!estaNaPaginaAuth && (
                <>
                  <Link to="/login" className="navbar-link">Login</Link>
                  <Link to="/cadastro" className="btn-primary">Cadastrar</Link>
                </>
              )}
            </>
          ) : (
            <>
              <span className="navbar-user">Olá, {usuario.nome}</span>

              {usuario.role === 'admin' ? (
                <>
                  <Link to="/admin" className="navbar-link">Pedidos</Link>
                  <Link to="/admin/produtos" className="navbar-link">Produtos</Link>
                </>
              ) : (
                <>
                  <Link to="/produtos" className="navbar-link">Produtos</Link>
                  <Link to="/meus-pedidos" className="navbar-link">Meus Pedidos</Link>
                </>
              )}

              <button onClick={handleLogout} className="btn-secondary">
                Sair
              </button>
            </>
          )}

          {/* Botão de alternar tema — sempre visível */}
          <button
            className="btn-tema"
            onClick={alternarTema}
            title={tema === 'claro' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
            aria-label={tema === 'claro' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            {tema === 'claro' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  )
}