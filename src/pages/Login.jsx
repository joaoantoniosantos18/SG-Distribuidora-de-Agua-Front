import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const resultado = await login(email, senha)

    if (resultado.sucesso) {
      // Redireciona baseado no role do usuário
      const usuario = JSON.parse(localStorage.getItem('usuario'))
      if (usuario.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/meus-pedidos')
      }
    } else {
      setErro(resultado.mensagem)
    }

    setCarregando(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Login</h1>
        <p className="auth-subtitle">Entre na sua conta</p>

        {erro && <div className="erro-msg">{erro}</div>}

        <form onSubmit={handleSubmit}>
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
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-full"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}