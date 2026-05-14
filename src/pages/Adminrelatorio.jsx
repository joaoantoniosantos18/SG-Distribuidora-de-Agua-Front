import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import api from '../services/api'
import '../styles/AdminRelatorio.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]

const CORES_PIZZA = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

function formatarReais(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// ─── Card de KPI ──────────────────────────────────────────────────────────────
function CardKpi({ label, valor, sub, variacao, corVariacao }) {
  const sinal = variacao > 0 ? '▲' : '▼'
  const cor   = variacao > 0 ? 'var(--verde)' : 'var(--vermelho)'

  return (
    <div className="kpi-card card">
      <span className="kpi-label">{label}</span>
      <span className="kpi-valor">{valor}</span>
      {sub && <span className="kpi-sub">{sub}</span>}
      {variacao !== null && variacao !== undefined && (
        <span className="kpi-variacao" style={{ color: corVariacao || cor }}>
          {sinal} {Math.abs(variacao)}% vs mês anterior
        </span>
      )}
    </div>
  )
}

// ─── Tooltip customizado dos gráficos ─────────────────────────────────────────
function TooltipReais({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="grafico-tooltip">
      <p className="tooltip-label">Dia {label}</p>
      <p className="tooltip-valor">{formatarReais(payload[0].value)}</p>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function AdminRelatorio() {
  const agora = new Date()
  const [mes, setMes]           = useState(agora.getMonth() + 1)
  const [ano, setAno]           = useState(agora.getFullYear())
  const [dados, setDados]       = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro]         = useState(null)

  useEffect(() => {
    buscarRelatorio()
  }, [mes, ano])

  const buscarRelatorio = async () => {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await api.get(`/pedidos/relatorio?mes=${mes}&ano=${ano}`)
      setDados(resposta.data)
    } catch (err) {
      setErro('Não foi possível carregar o relatório.')
    } finally {
      setCarregando(false)
    }
  }

  // Anos disponíveis: ano atual e os 2 anteriores
  const anos = [agora.getFullYear(), agora.getFullYear() - 1, agora.getFullYear() - 2]

  return (
    <div className="relatorio">

      {/* ── Seletor de período ───────────────────────────────────────────── */}
      <div className="relatorio-header">
        <h2>Relatório Financeiro</h2>
        <div className="periodo-seletor">
          <select value={mes} onChange={e => setMes(Number(e.target.value))}>
            {MESES.map((nome, i) => (
              <option key={i} value={i + 1}>{nome}</option>
            ))}
          </select>
          <select value={ano} onChange={e => setAno(Number(e.target.value))}>
            {anos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {carregando && <div className="loading">Carregando relatório...</div>}
      {erro       && <div className="erro-msg">{erro}</div>}

      {!carregando && !erro && dados && (
        <>
          {/* ── KPIs principais ───────────────────────────────────────────── */}
          <div className="kpi-grid">
            <CardKpi
              label="Faturamento Total"
              valor={formatarReais(dados.resumo.faturamentoTotal)}
              sub={`Entregues: ${formatarReais(dados.resumo.faturamentoEntregues)}`}
              variacao={dados.resumo.variacaoFaturamento}
            />
            <CardKpi
              label="Total de Pedidos"
              valor={dados.resumo.totalPedidos}
              sub={`Mês anterior: ${dados.resumo.totalPedidosAnterior}`}
              variacao={dados.resumo.variacaoPedidos}
            />
            <CardKpi
              label="Ticket Médio"
              valor={formatarReais(dados.resumo.ticketMedio)}
            />
            <CardKpi
              label="Taxa de Entrega"
              valor={
                dados.resumo.totalPedidos > 0
                  ? `${Math.round((dados.porStatus.entregue / dados.resumo.totalPedidos) * 100)}%`
                  : '—'
              }
              sub={`${dados.porStatus.entregue} de ${dados.resumo.totalPedidos} pedidos`}
            />
          </div>

          {/* ── Status dos pedidos ────────────────────────────────────────── */}
          <div className="status-resumo">
            <div className="status-item status-pendente-bg">
              <span className="status-item-num">{dados.porStatus.pendente}</span>
              <span className="status-item-label">Pendentes</span>
            </div>
            <div className="status-item status-entrega-bg">
              <span className="status-item-num">{dados.porStatus.em_entrega}</span>
              <span className="status-item-label">Em entrega</span>
            </div>
            <div className="status-item status-entregue-bg">
              <span className="status-item-num">{dados.porStatus.entregue}</span>
              <span className="status-item-label">Entregues</span>
            </div>
          </div>

          {/* ── Gráficos ──────────────────────────────────────────────────── */}
          <div className="graficos-grid">

            {/* Faturamento por dia */}
            <div className="grafico-card card">
              <h3>Faturamento por dia — {MESES[mes - 1]}</h3>
              {dados.faturamentoPorDia.every(d => d.valor === 0) ? (
                <p className="grafico-vazio">Nenhum faturamento neste período.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={dados.faturamentoPorDia} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--cinza-200)" />
                    <XAxis
                      dataKey="dia"
                      tick={{ fontSize: 12, fill: 'var(--texto-secundario)' }}
                      tickLine={false}
                      interval={4}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: 'var(--texto-secundario)' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={v => `R$${v}`}
                      width={60}
                    />
                    <Tooltip content={<TooltipReais />} />
                    <Line
                      type="monotone"
                      dataKey="valor"
                      stroke="var(--azul-principal)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Produtos mais vendidos */}
            <div className="grafico-card card">
              <h3>Produtos mais vendidos</h3>
              {dados.produtosMaisVendidos.length === 0 ? (
                <p className="grafico-vazio">Nenhum produto vendido neste período.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={dados.produtosMaisVendidos}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--cinza-200)" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12, fill: 'var(--texto-secundario)' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="nome"
                      tick={{ fontSize: 12, fill: 'var(--texto-secundario)' }}
                      tickLine={false}
                      width={120}
                    />
                    <Tooltip
                      formatter={(v) => [`${v} unid.`, 'Quantidade']}
                      contentStyle={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--cinza-200)',
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="quantidade" fill="var(--azul-principal)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Formas de pagamento */}
            <div className="grafico-card card">
              <h3>Formas de pagamento</h3>
              {dados.formasPagamento.length === 0 ? (
                <p className="grafico-vazio">Nenhum pedido neste período.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={dados.formasPagamento}
                      dataKey="quantidade"
                      nameKey="nome"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ nome, percent }) =>
                        `${nome} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {dados.formasPagamento.map((_, i) => (
                        <Cell key={i} fill={CORES_PIZZA[i % CORES_PIZZA.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, nome) => [`${v} pedidos`, nome]}
                      contentStyle={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--cinza-200)',
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{ fontSize: 13 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  )
}