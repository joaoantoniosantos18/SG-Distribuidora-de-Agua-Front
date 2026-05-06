import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/AdminPedidos.css'

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarTodosPedidos()
  }, [])

  const buscarTodosPedidos = async () => {
    try {
      const resposta = await api.get('/pedidos')
      setPedidos(resposta.data)
    } catch (erro) {
      console.error('Erro ao buscar pedidos:', erro)
    } finally {
      setCarregando(false)
    }
  }

  const atualizarStatus = async (pedidoId, novoStatus) => {
    try {
      await api.put(`/pedidos/${pedidoId}/status`, { status: novoStatus })
      // Atualiza a lista
      buscarTodosPedidos()
    } catch (erro) {
      alert('Erro ao atualizar status')
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

  // Cards de estatísticas
  const estatisticas = {
    total: pedidos.length,
    pendentes: pedidos.filter(p => p.status === 'pendente').length,
    emEntrega: pedidos.filter(p => p.status === 'em_entrega').length,
    entregues: pedidos.filter(p => p.status === 'entregue').length
  }

  if (carregando) {
    return <div className="loading">Carregando pedidos...</div>
  }

  return (
    <div className="admin-pedidos">
      <h1>Gerenciar Pedidos</h1>

      <div className="stats-grid">
        <div className="stat-card card">
          <span className="stat-label">Total de Pedidos</span>
          <span className="stat-valor">{estatisticas.total}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Pendentes</span>
          <span className="stat-valor status-pendente">{estatisticas.pendentes}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Em Entrega</span>
          <span className="stat-valor status-em_entrega">{estatisticas.emEntrega}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Entregues</span>
          <span className="stat-valor status-entregue">{estatisticas.entregues}</span>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <div className="texto-vazio card">
          <p>Nenhum pedido registrado ainda.</p>
        </div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="pedido-card card">
              <div className="pedido-header">
                <div>
                  <h3>{pedido.cliente.nome}</h3>
                  <p className="cliente-email">{pedido.cliente.email}</p>
                </div>
                <span className={`status status-${pedido.status}`}>
                  {traduzirStatus(pedido.status)}
                </span>
              </div>

              <div className="pedido-corpo">
                <div className="pedido-info">
                  <div className="info-linha">
                    <span className="label">Produto:</span>
                    <span>{pedido.produto.nome}</span>
                  </div>
                  <div className="info-linha">
                    <span className="label">Quantidade:</span>
                    <span>{pedido.quantidade}</span>
                  </div>
                  <div className="info-linha">
                    <span className="label">Endereço:</span>
                    <span>{pedido.enderecoEntrega}</span>
                  </div>
                  <div className="info-linha">
                    <span className="label">Pagamento:</span>
                    <span>{traduzirFormaPagamento(pedido.formaPagamento)}</span>
                  </div>
                  {pedido.precisaTroco && (
                    <>
                      <div className="info-linha">
                        <span className="label">Valor pago:</span>
                        <span>R$ {pedido.valorPagamento.toFixed(2)}</span>
                      </div>
                      <div className="info-linha">
                        <span className="label">Troco:</span>
                        <span className="troco-destaque">
                          R$ {pedido.troco.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="info-linha total">
                    <span className="label">Total:</span>
                    <span>R$ {pedido.valorTotal.toFixed(2)}</span>
                  </div>
                  <div className="info-linha">
                    <span className="label">Data:</span>
                    <span>{formatarData(pedido.createdAt)}</span>
                  </div>
                </div>

                <div className="pedido-acoes">
                  <button
                    className="btn-secondary"
                    onClick={() => atualizarStatus(pedido._id, 'pendente')}
                    disabled={pedido.status === 'pendente'}
                  >
                    Pendente
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => atualizarStatus(pedido._id, 'em_entrega')}
                    disabled={pedido.status === 'em_entrega'}
                  >
                    Em Entrega
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => atualizarStatus(pedido._id, 'entregue')}
                    disabled={pedido.status === 'entregue'}
                  >
                    Entregue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}