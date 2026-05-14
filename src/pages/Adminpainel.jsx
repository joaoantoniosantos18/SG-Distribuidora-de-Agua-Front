import { useState } from 'react'
import AdminPedidos from './AdminPedidos'
import AdminRelatorio from './AdminRelatorio'
import AdminProdutos from './AdminProdutos'
import '../styles/AdminPainel.css'

const ABAS = [
  { id: 'pedidos',    label: '📋 Pedidos'    },
  { id: 'relatorio',  label: '📊 Relatórios' },
  { id: 'produtos',   label: '📦 Produtos'   },
]

export default function AdminPainel() {
  const [abaAtiva, setAbaAtiva] = useState('pedidos')

  return (
    <div className="admin-painel">
      {/* ── Abas ─────────────────────────────────────────────────────────── */}
      <div className="abas-container">
        <nav className="abas-nav">
          {ABAS.map(aba => (
            <button
              key={aba.id}
              className={`aba-btn ${abaAtiva === aba.id ? 'aba-ativa' : ''}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              {aba.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Conteúdo da aba ───────────────────────────────────────────────── */}
      <div className="aba-conteudo">
        {abaAtiva === 'pedidos'   && <AdminPedidos />}
        {abaAtiva === 'relatorio' && <AdminRelatorio />}
        {abaAtiva === 'produtos'  && <AdminProdutos />}
      </div>
    </div>
  )
}