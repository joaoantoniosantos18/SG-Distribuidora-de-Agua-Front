import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          💧 Distribuidora
        </Link>

        <div className="navbar-menu">
          {!usuario ? (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/cadastro" className="btn-primary">Cadastrar</Link>
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
                <Link to="/meus-pedidos" className="navbar-link">Meus Pedidos</Link>
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