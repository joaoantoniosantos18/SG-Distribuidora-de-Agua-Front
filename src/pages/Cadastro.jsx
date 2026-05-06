import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Auth.css'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [endereco, setEndereco] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const { cadastrar } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const resultado = await cadastrar(nome, email, senha, endereco)

    if (resultado.sucesso) {
      setSucesso(true)
      // Redireciona para o login após 2 segundos
      setTimeout(() => navigate('/login'), 2000)
    } else {
      setErro(resultado.mensagem)
    }

    setCarregando(false)
  }

  if (sucesso) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>✅ Cadastro realizado!</h1>
          <p>Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Cadastro</h1>
        <p className="auth-subtitle">Crie sua conta</p>

        {erro && <div className="erro-msg">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Endereço</label>
            <textarea
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
              rows={3}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-full"
            disabled={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  )
}