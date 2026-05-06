import { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Verifica se está na página de login ou cadastro
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
              {/* Só mostra os botões se NÃO estiver na página de login/cadastro */}
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
        </div>
      </div>
    </nav>
  )
}