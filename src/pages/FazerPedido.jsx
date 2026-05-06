import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import '../styles/FazerPedido.css'

export default function FazerPedido() {
  const { id } = useParams()
  const { usuario } = useContext(AuthContext)
  const navigate = useNavigate()

  const [produto, setProduto] = useState(null)
  const [quantidade, setQuantidade] = useState(1)
  
  // Campos de endereço
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  
  const [formaPagamento, setFormaPagamento] = useState('pix')
  const [precisaTroco, setPrecisaTroco] = useState(false)
  const [valorPagamento, setValorPagamento] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarProduto()
  }, [id])

  useEffect(() => {
    if (usuario && usuario.endereco) {
      setCep(usuario.endereco.cep || '')
      setLogradouro(usuario.endereco.logradouro || '')
      setNumero(usuario.endereco.numero || '')
      setComplemento(usuario.endereco.complemento || '')
      setBairro(usuario.endereco.bairro || '')
      setCidade(usuario.endereco.cidade || '')
      setEstado(usuario.endereco.estado || '')
    }
  }, [usuario])

  const buscarProduto = async () => {
    try {
      const resposta = await api.get('/produtos')
      const produtoEncontrado = resposta.data.find(p => p._id === id)
      
      if (!produtoEncontrado) {
        setErro('Produto não encontrado')
      } else {
        setProduto(produtoEncontrado)
      }
    } catch (erro) {
      setErro('Erro ao buscar produto')
    } finally {
      setCarregando(false)
    }
  }

  const buscarCep = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '')
    
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
      
      setLogradouro(dados.logradouro)
      setBairro(dados.bairro)
      setCidade(dados.localidade)
      setEstado(dados.uf)
      
      document.getElementById('numero-entrega').focus()
    } catch (erro) {
      setErro('Erro ao buscar CEP')
    } finally {
      setBuscandoCep(false)
    }
  }

  const handleCepChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '')
    
    if (valor.length > 5) {
      valor = valor.substring(0, 5) + '-' + valor.substring(5, 8)
    }
    
    setCep(valor)
    
    if (valor.replace(/\D/g, '').length === 8) {
      buscarCep(valor)
    }
  }

  const calcularTotal = () => {
    if (!produto) return 0
    return produto.preco * quantidade
  }

  const calcularTroco = () => {
    if (!precisaTroco || !valorPagamento) return 0
    const total = calcularTotal()
    const troco = parseFloat(valorPagamento) - total
    return troco > 0 ? troco : 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)

    if (precisaTroco) {
      const total = calcularTotal()
      if (!valorPagamento || parseFloat(valorPagamento) < total) {
        setErro('O valor de pagamento deve ser maior ou igual ao total do pedido')
        setEnviando(false)
        return
      }
    }

    try {
      await api.post('/pedidos', {
        produtoId: id,
        quantidade,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        formaPagamento,
        precisaTroco,
        valorPagamento: precisaTroco ? parseFloat(valorPagamento) : 0
      })

      alert('Pedido realizado com sucesso!')
      navigate('/meus-pedidos')
    } catch (erro) {
      setErro(erro.response?.data?.mensagem || 'Erro ao criar pedido')
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return <div className="loading">Carregando...</div>
  }

  if (erro && !produto) {
    return <div className="erro-page">{erro}</div>
  }

  return (
    <div className="fazer-pedido">
      <div className="pedido-container">
        <h1>Fazer Pedido</h1>

        <div className="produto-info-completa card">
          <div className="produto-info-imagem">
            <img 
              src={`http://localhost:3000${produto.imagemUrl}`} 
              alt={produto.nome}
            />
          </div>
          <div className="produto-info-texto">
            <h2>{produto.nome}</h2>
            <p>{produto.descricao}</p>
            <p className="preco-unitario">
              Preço unitário: <strong>R$ {produto.preco.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        {erro && <div className="erro-msg">{erro}</div>}

        <form onSubmit={handleSubmit} className="pedido-form">
          <div className="form-group">
            <label>Quantidade</label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value))}
              required
            />
          </div>

          <h3 className="secao-titulo">Endereço de Entrega</h3>

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
                id="numero-entrega"
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
              placeholder="Apto, bloco, etc"
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

          <h3 className="secao-titulo">Pagamento</h3>

          <div className="form-group">
            <label>Forma de pagamento</label>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
            >
              <option value="pix">PIX</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão</option>
            </select>
          </div>

          {formaPagamento === 'dinheiro' && (
            <>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={precisaTroco}
                    onChange={(e) => setPrecisaTroco(e.target.checked)}
                  />
                  Precisa de troco?
                </label>
              </div>

              {precisaTroco && (
                <div className="form-group">
                  <label>Valor que vai pagar</label>
                  <input
                    type="number"
                    step="0.01"
                    min={calcularTotal()}
                    value={valorPagamento}
                    onChange={(e) => setValorPagamento(e.target.value)}
                    placeholder="Ex: 50.00"
                    required
                  />
                  {valorPagamento && (
                    <small className="troco-info">
                      Troco: R$ {calcularTroco().toFixed(2)}
                    </small>
                  )}
                </div>
              )}
            </>
          )}

          <div className="resumo-pedido card">
            <h3>Resumo do Pedido</h3>
            <div className="resumo-linha">
              <span>Produto:</span>
              <span>{produto.nome}</span>
            </div>
            <div className="resumo-linha">
              <span>Quantidade:</span>
              <span>{quantidade}</span>
            </div>
            <div className="resumo-linha">
              <span>Preço unitário:</span>
              <span>R$ {produto.preco.toFixed(2)}</span>
            </div>
            <div className="resumo-linha total">
              <span>Total:</span>
              <span>R$ {calcularTotal().toFixed(2)}</span>
            </div>
            {precisaTroco && valorPagamento && (
              <div className="resumo-linha">
                <span>Troco:</span>
                <span>R$ {calcularTroco().toFixed(2)}</span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-full"
            disabled={enviando}
          >
            {enviando ? 'Finalizando...' : 'Finalizar Pedido'}
          </button>
        </form>
      </div>
    </div>
  )
}