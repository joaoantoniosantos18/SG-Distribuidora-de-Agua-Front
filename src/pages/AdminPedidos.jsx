import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/AdminPedidos.css'

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ mensagem, tipo, onFechar }) {
  useEffect(() => {
    const timer = setTimeout(onFechar, 3500)
    return () => clearTimeout(timer)
  }, [onFechar])

  return (
    <div className={`toast toast-${tipo}`}>
      <span>{mensagem}</span>
      <button className="toast-fechar" onClick={onFechar}>×</button>
    </div>
  )
}

// ─── Card accordion de pedido ─────────────────────────────────────────────────
function PedidoCard({ pedido, onAtualizarStatus, traduzirStatus, traduzirFormaPagamento, formatarData }) {
  const [aberto, setAberto] = useState(false)

  return (
    <div className={`pedido-card card ${aberto ? 'aberto' : ''}`}>

      {/* Linha sempre visível — clicável para abrir/fechar */}
      <button className="pedido-linha" onClick={() => setAberto(a => !a)}>

        <div className="pedido-linha-info">
          <span className="pedido-cliente-nome">{pedido.cliente.nome}</span>
          <span className="pedido-linha-sep">·</span>
          <span className="pedido-linha-produto">{pedido.produto.nome}</span>
          <span className="pedido-linha-sep">·</span>
          <span className="pedido-linha-qtd">{pedido.quantidade}x</span>
        </div>

        <div className="pedido-linha-direita">
          <span className="pedido-linha-total">R$ {pedido.valorTotal.toFixed(2)}</span>
          <span className={`status status-${pedido.status}`}>
            {traduzirStatus(pedido.status)}
          </span>
          <span className={`seta ${aberto ? 'seta-aberta' : ''}`}>▾</span>
        </div>

      </button>

      {/* Detalhes expansíveis */}
      {aberto && (
        <div className="pedido-detalhes">
          <div className="pedido-detalhes-grid">

            <div className="detalhe-grupo">
              <span className="detalhe-label">Cliente</span>
              <span>{pedido.cliente.nome}</span>
              <span className="detalhe-sub">{pedido.cliente.email}</span>
            </div>

            <div className="detalhe-grupo">
              <span className="detalhe-label">Endereço de entrega</span>
              <span>{pedido.enderecoEntrega || '—'}</span>
            </div>

            <div className="detalhe-grupo">
              <span className="detalhe-label">Pagamento</span>
              <span>{traduzirFormaPagamento(pedido.formaPagamento)}</span>
              {pedido.precisaTroco && (
                <span className="detalhe-sub troco-destaque">
                  Troco: R$ {pedido.troco.toFixed(2)}
                </span>
              )}
            </div>

            <div className="detalhe-grupo">
              <span className="detalhe-label">Total</span>
              <span className="detalhe-total">R$ {pedido.valorTotal.toFixed(2)}</span>
              <span className="detalhe-sub">{formatarData(pedido.createdAt)}</span>
            </div>

          </div>

          <div className="pedido-acoes">
            <span className="acoes-label">Alterar status:</span>
            <button
              className="btn-secondary"
              onClick={() => onAtualizarStatus(pedido._id, 'pendente')}
              disabled={pedido.status === 'pendente'}
            >
              Pendente
            </button>
            <button
              className="btn-primary"
              onClick={() => onAtualizarStatus(pedido._id, 'em_entrega')}
              disabled={pedido.status === 'em_entrega'}
            >
              Em Entrega
            </button>
            <button
              className="btn-secondary"
              onClick={() => onAtualizarStatus(pedido._id, 'entregue')}
              disabled={pedido.status === 'entregue'}
            >
              Entregue
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [toast, setToast] = useState(null)

  const mostrarToast = (mensagem, tipo = 'sucesso') => setToast({ mensagem, tipo })
  const fecharToast = () => setToast(null)

  useEffect(() => { buscarTodosPedidos() }, [])

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
      mostrarToast(`Status atualizado para "${traduzirStatus(novoStatus)}"`)
      buscarTodosPedidos()
    } catch (erro) {
      mostrarToast('Erro ao atualizar status', 'erro')
    }
  }

  const formatarData = (data) =>
    new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

  const traduzirStatus = (s) => ({ pendente: 'Pendente', em_entrega: 'Em entrega', entregue: 'Entregue' }[s] || s)
  const traduzirFormaPagamento = (f) => ({ pix: 'PIX', dinheiro: 'Dinheiro', cartao: 'Cartão' }[f] || f)

  const estatisticas = {
    total:     pedidos.length,
    pendentes: pedidos.filter(p => p.status === 'pendente').length,
    emEntrega: pedidos.filter(p => p.status === 'em_entrega').length,
    entregues: pedidos.filter(p => p.status === 'entregue').length,
  }

  if (carregando) return <div className="loading">Carregando pedidos...</div>

  return (
    <div className="admin-pedidos">
      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onFechar={fecharToast} />}

      <h1>Gerenciar Pedidos</h1>

      <div className="stats-grid">
        <div className="stat-card card">
          <span className="stat-label">Total de Pedidos</span>
          <span className="stat-valor">{estatisticas.total}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Pendentes</span>
          <span className="stat-valor">{estatisticas.pendentes}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Em Entrega</span>
          <span className="stat-valor">{estatisticas.emEntrega}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Entregues</span>
          <span className="stat-valor">{estatisticas.entregues}</span>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <div className="texto-vazio card"><p>Nenhum pedido registrado ainda.</p></div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
            <PedidoCard
              key={pedido._id}
              pedido={pedido}
              onAtualizarStatus={atualizarStatus}
              traduzirStatus={traduzirStatus}
              traduzirFormaPagamento={traduzirFormaPagamento}
              formatarData={formatarData}
            />
          ))}
        </div>
      )}
    </div>
  )
}