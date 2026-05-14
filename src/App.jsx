import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import RotaProtegida from './components/RotaProtegida'

import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import FazerPedido from './pages/FazerPedido'
import MeusPedidos from './pages/MeusPedidos'
import AdminPainel from './pages/AdminPainel'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />

              <Route path="/produtos" element={
                <RotaProtegida><Home /></RotaProtegida>
              } />
              <Route path="/fazer-pedido/:id" element={
                <RotaProtegida><FazerPedido /></RotaProtegida>
              } />
              <Route path="/meus-pedidos" element={
                <RotaProtegida><MeusPedidos /></RotaProtegida>
              } />

              {/* Painel admin — tudo numa página só com abas */}
              <Route path="/admin" element={
                <RotaProtegida apenasAdmin={true}><AdminPainel /></RotaProtegida>
              } />

              {/* Redireciona /admin/produtos para /admin (a aba está lá dentro) */}
              <Route path="/admin/produtos" element={<Navigate to="/admin" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}