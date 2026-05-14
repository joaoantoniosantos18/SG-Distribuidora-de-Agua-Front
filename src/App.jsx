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
import AdminPedidos from './pages/AdminPedidos'
import AdminProdutos from './pages/AdminProdutos'

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
              <Route path="/admin" element={
                <RotaProtegida apenasAdmin={true}><AdminPedidos /></RotaProtegida>
              } />
              <Route path="/admin/produtos" element={
                <RotaProtegida apenasAdmin={true}><AdminProdutos /></RotaProtegida>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}