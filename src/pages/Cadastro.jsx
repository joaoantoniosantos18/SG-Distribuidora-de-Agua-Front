import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Auth.css'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  
  // Campos de endereço
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const { cadastrar } = useContext(AuthContext)
  const navigate = useNavigate()

  // Busca o CEP na API do ViaCEP
  const buscarCep = async (cepDigitado) => {
    // Remove tudo que não é número
    const cepLimpo = cepDigitado.replace(/\D/g, '')
    
    // CEP tem que ter 8 dígitos
    if (cepLimpo.length !== 8) return
    
    setBuscandoCep(true)
    setErro('')
    
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const dados = await resposta.json()
      
      if (dados.erro) {
        setErro('CEP não encontrado')
        return
      }
      
      // Preenche os campos automaticamente
      setLogradouro(dados.logradouro)
      setBairro(dados.bairro)
      setCidade(dados.localidade)
      setEstado(dados.uf)
      
      // Foca no campo de número
      document.getElementById('numero').focus()
    } catch (erro) {
      setErro('Erro ao buscar CEP')
    } finally {
      setBuscandoCep(false)
    }
  }

  const handleCepChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '')
    
    // Formata o CEP: 12345-678
    if (valor.length > 5) {
      valor = valor.substring(0, 5) + '-' + valor.substring(5, 8)
    }
    
    setCep(valor)
    
    // Se tiver 8 números, busca automaticamente
    if (valor.replace(/\D/g, '').length === 8) {
      buscarCep(valor)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const resultado = await cadastrar(nome, email, senha, cep, logradouro, numero, complemento, bairro, cidade, estado)

    if (resultado.sucesso) {
      setSucesso(true)
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
            <label>CEP</label>
            <input
              type="text"
              value={cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              maxLength={9}
              required
            />
            {buscandoCep && <small className="info-text">Buscando CEP...</small>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{flex: 3}}>
              <label>Logradouro</label>
              <input
                type="text"
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{flex: 1}}>
              <label>Número</label>
              <input
                id="numero"
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Complemento (opcional)</label>
            <input
              type="text"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{flex: 2}}>
              <label>Bairro</label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{flex: 2}}>
              <label>Cidade</label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{flex: 1}}>
              <label>UF</label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value.toUpperCase())}
                maxLength={2}
                required
              />
            </div>
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