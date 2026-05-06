import { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario')
    const tokenSalvo = localStorage.getItem('token')

    if (usuarioSalvo && tokenSalvo) {
      setUsuario(JSON.parse(usuarioSalvo))
    }

    setCarregando(false)
  }, [])

  const login = async (email, senha) => {
    try {
      const resposta = await api.post('/auth/login', { email, senha })
      
      localStorage.setItem('token', resposta.data.token)
      localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario))
      
      setUsuario(resposta.data.usuario)
      
      return { sucesso: true }
    } catch (erro) {
      return { 
        sucesso: false, 
        mensagem: erro.response?.data?.mensagem || 'Erro ao fazer login' 
      }
    }
  }

  const cadastrar = async (nome, email, senha, cep, logradouro, numero, complemento, bairro, cidade, estado) => {
    try {
      await api.post('/auth/cadastro', { 
        nome, 
        email, 
        senha, 
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      })
      return { sucesso: true }
    } catch (erro) {
      return { 
        sucesso: false, 
        mensagem: erro.response?.data?.mensagem || 'Erro ao cadastrar' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, cadastrar, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}