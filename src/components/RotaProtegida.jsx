import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function RotaProtegida({ children, apenasAdmin = false }) {
  const { usuario, carregando } = useContext(AuthContext)

  if (carregando) {
    return <div className="loading">Carregando...</div>
  }

  if (!usuario) {
    return <Navigate to="/login" />
  }

  if (apenasAdmin && usuario.role !== 'admin') {
    return <Navigate to="/" />
  }

  return children
}