import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../styles/Home.css'

export default function Home() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    buscarProdutos()
  }, [])

  const buscarProdutos = async () => {
    try {
      const resposta = await api.get('/produtos')
      setProdutos(resposta.data)
    } catch (erro) {
      console.error('Erro ao buscar produtos:', erro)
    } finally {
      setCarregando(false)
    }
  }

  if (carregando) {
    return <div className="loading">Carregando produtos...</div>
  }

  return (
    <div className="home">
      <div className="home-header">
        <h1>💧 Distribuidora de Água</h1>
        <p>Escolha seu produto e faça seu pedido</p>
      </div>

      <div className="produtos-grid">
        {produtos.length === 0 ? (
          <p className="texto-vazio">Nenhum produto disponível no momento.</p>
        ) : (
          produtos.map((produto) => (
            <div key={produto._id} className="produto-card card">
              <div className="produto-imagem">
                <img 
                  src={`http://localhost:3000${produto.imagemUrl}`} 
                  alt={produto.nome}
                />
              </div>
              
              <div className="produto-conteudo">
                <h3>{produto.nome}</h3>
                <p className="produto-descricao">{produto.descricao}</p>
                
                <div className="produto-footer">
                  <span className="produto-preco">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate(`/fazer-pedido/${produto._id}`)}
                  >
                    Pedir agora
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}