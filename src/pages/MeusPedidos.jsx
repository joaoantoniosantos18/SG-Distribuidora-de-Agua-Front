import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../services/api'
import '../styles/MeusPedidos.css'

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemSucesso, setMensagemSucesso] = useState(null)
  const location = useLocation()

  useEffect(() => {
    buscarMeusPedidos()
    if (location.state?.sucesso) {
      setMensagemSucesso(location.state.sucesso)
      setTimeout(() => setMensagemSucesso(null), 4000)
    }
  }, [])

  const buscarMeusPedidos = async () => {
    try {
      const resposta = await api.get('/pedidos/meus')
      setPedidos(resposta.data)
    } catch (erro) {
      console.error('Erro ao buscar pedidos:', erro)
    } finally {
      setCarregando(false)
    }
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const traduzirStatus = (status) => {
    const traducoes = {
      'pendente': 'Pendente',
      'em_entrega': 'Em entrega',
      'entregue': 'Entregue'
    }
    return traducoes[status] || status
  }

  const traduzirFormaPagamento = (forma) => {
    const traducoes = {
      'pix': 'PIX',
      'dinheiro': 'Dinheiro',
      'cartao': 'Cartão'
    }
    return traducoes[forma] || forma
  }

  if (carregando) {
    return <div className="loading">Carregando seus pedidos...</div>
  }

  return (
    <div className="meus-pedidos">
      {mensagemSucesso && (
        <div className="toast toast-sucesso">
          <span>{mensagemSucesso}</span>
          <button className="toast-fechar" onClick={() => setMensagemSucesso(null)}>×</button>
        </div>
      )}
      <h1>Meus Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="texto-vazio card">
          <p>Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="pedido-card card">
              <div className="pedido-header">
                <h3>{pedido.produto.nome}</h3>
                <span className={`status status-${pedido.status}`}>
                  {traduzirStatus(pedido.status)}
                </span>
              </div>

              <div className="pedido-detalhes">
                <div className="detalhe-linha">
                  <span className="label">Data do pedido:</span>
                  <span>{formatarData(pedido.createdAt)}</span>
                </div>

                <div className="detalhe-linha">
                  <span className="label">Quantidade:</span>
                  <span>{pedido.quantidade}</span>
                </div>

                <div className="detalhe-linha">
                  <span className="label">Endereço:</span>
                  <span>{pedido.enderecoEntrega}</span>
                </div>

                <div className="detalhe-linha">
                  <span className="label">Pagamento:</span>
                  <span>{traduzirFormaPagamento(pedido.formaPagamento)}</span>
                </div>

                {pedido.precisaTroco && (
                  <>
                    <div className="detalhe-linha">
                      <span className="label">Valor pago:</span>
                      <span>R$ {pedido.valorPagamento.toFixed(2)}</span>
                    </div>
                    <div className="detalhe-linha">
                      <span className="label">Troco:</span>
                      <span>R$ {pedido.troco.toFixed(2)}</span>
                    </div>
                  </>
                )}

                <div className="detalhe-linha total">
                  <span className="label">Valor Total:</span>
                  <span>R$ {pedido.valorTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}