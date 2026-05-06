import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/AdminProdutos.css'

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [disponivel, setDisponivel] = useState(true)

  useEffect(() => {
    buscarProdutos()
  }, [])

  const buscarProdutos = async () => {
    try {
      const resposta = await api.get('/produtos/todos')
      setProdutos(resposta.data)
    } catch (erro) {
      console.error('Erro ao buscar produtos:', erro)
    } finally {
      setCarregando(false)
    }
  }

  const limparForm = () => {
    setNome('')
    setDescricao('')
    setPreco('')
    setDisponivel(true)
    setEditando(null)
    setMostrarForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dados = {
      nome,
      descricao,
      preco: parseFloat(preco),
      disponivel
    }

    try {
      if (editando) {
        await api.put(`/produtos/${editando}`, dados)
        alert('Produto atualizado com sucesso!')
      } else {
        await api.post('/produtos', dados)
        alert('Produto criado com sucesso!')
      }
      limparForm()
      buscarProdutos()
    } catch (erro) {
      alert('Erro ao salvar produto')
    }
  }

  const editarProduto = (produto) => {
    setNome(produto.nome)
    setDescricao(produto.descricao || '')
    setPreco(produto.preco.toString())
    setDisponivel(produto.disponivel)
    setEditando(produto._id)
    setMostrarForm(true)
  }

  const deletarProduto = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return

    try {
      await api.delete(`/produtos/${id}`)
      alert('Produto deletado com sucesso!')
      buscarProdutos()
    } catch (erro) {
      alert('Erro ao deletar produto')
    }
  }

  if (carregando) {
    return <div className="loading">Carregando produtos...</div>
  }

  return (
    <div className="admin-produtos">
      <div className="header-acoes">
        <h1>Gerenciar Produtos</h1>
        <button
          className="btn-primary"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? 'Cancelar' : '+ Novo Produto'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-container card">
          <h2>{editando ? 'Editar Produto' : 'Novo Produto'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome do produto</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={disponivel}
                  onChange={(e) => setDisponivel(e.target.checked)}
                />
                Produto disponível
              </label>
            </div>

            <div className="form-acoes">
              <button type="submit" className="btn-primary">
                {editando ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={limparForm}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="produtos-lista">
        {produtos.length === 0 ? (
          <div className="texto-vazio card">
            <p>Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          produtos.map((produto) => (
            <div key={produto._id} className="produto-card card">
              <div className="produto-header">
                <div>
                  <h3>{produto.nome}</h3>
                  {produto.descricao && <p>{produto.descricao}</p>}
                </div>
                <span className={produto.disponivel ? 'badge-disponivel' : 'badge-indisponivel'}>
                  {produto.disponivel ? 'Disponível' : 'Indisponível'}
                </span>
              </div>

              <div className="produto-footer">
                <span className="preco">R$ {produto.preco.toFixed(2)}</span>
                <div className="produto-acoes">
                  <button
                    className="btn-secondary"
                    onClick={() => editarProduto(produto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => deletarProduto(produto._id)}
                  >
                    Deletar
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