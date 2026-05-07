# 🚰 Distribuidora de Água - Frontend

Interface moderna e responsiva para sistema de gerenciamento de distribuidora de água mineral, com autenticação, catálogo de produtos e acompanhamento de pedidos.

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 📋 Sobre o Projeto

Aplicação frontend completa para distribuidora de água, permitindo que clientes façam pedidos e acompanhem entregas, enquanto administradores gerenciam produtos e pedidos através de um painel administrativo.

**Repositório Backend:** [distribuidora-back](https://github.com/seu-usuario/distribuidora-back)

---

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool moderna e rápida
- **React Router DOM v6** - Navegação entre páginas
- **Axios** - Cliente HTTP para API
- **Context API** - Gerenciamento de estado global
- **ViaCEP API** - Busca automática de endereço por CEP
- **CSS Puro** - Estilização customizada

---

## 📁 Estrutura de Pastas

```
distribuidora-front/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Barra de navegação
│   │   └── RotaProtegida.jsx    # Proteção de rotas
│   ├── context/
│   │   └── AuthContext.jsx      # Context de autenticação
│   ├── pages/
│   │   ├── Home.jsx             # Catálogo de produtos
│   │   ├── Login.jsx            # Página de login
│   │   ├── Cadastro.jsx         # Cadastro de usuário
│   │   ├── FazerPedido.jsx      # Formulário de pedido
│   │   ├── MeusPedidos.jsx      # Pedidos do cliente
│   │   ├── AdminPedidos.jsx     # Painel de pedidos (admin)
│   │   └── AdminProdutos.jsx    # Gerenciar produtos (admin)
│   ├── services/
│   │   └── api.js               # Configuração do Axios
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── Home.css
│   │   ├── Navbar.css
│   │   ├── FazerPedido.css
│   │   ├── MeusPedidos.css
│   │   ├── AdminPedidos.css
│   │   └── AdminProdutos.css
│   ├── App.jsx                  # Componente raiz
│   ├── main.jsx                 # Entrada da aplicação
│   └── index.css                # Estilos globais
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado (versão 16 ou superior)
- Backend rodando em `http://localhost:3000`
- Git instalado

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/seu-usuario/distribuidora-front.git
cd distribuidora-front
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Rodar o projeto

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 🎨 Design

### Paleta de Cores

- **Azul Principal:** `#2563eb`
- **Azul Hover:** `#1d4ed8`
- **Azul Claro:** `#dbeafe`
- **Verde (Entregue):** `#10b981`
- **Amarelo (Pendente):** `#f59e0b`
- **Vermelho (Erro):** `#ef4444`
- **Fundo:** `#ffffff` e `#f8fafc`
- **Texto:** `#0f172a` e `#475569`

### Tipografia

- **Fonte Principal:** Poppins
- **Pesos:** 400, 500, 600, 700, 800

---

## 🧭 Rotas da Aplicação

### Rotas Públicas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | Redirect | Redireciona para `/login` |
| `/login` | Login | Página de login |
| `/cadastro` | Cadastro | Cadastro de novo usuário |

### Rotas Protegidas (Cliente)

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/produtos` | Home | Catálogo de produtos |
| `/fazer-pedido/:id` | FazerPedido | Formulário de pedido |
| `/meus-pedidos` | MeusPedidos | Acompanhar pedidos |

### Rotas Protegidas (Admin)

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/admin` | AdminPedidos | Gerenciar todos os pedidos |
| `/admin/produtos` | AdminProdutos | Gerenciar produtos |

---

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação:

1. Usuário faz login
2. Backend retorna token JWT
3. Token é armazenado no `localStorage`
4. Todas as requisições protegidas enviam o token no header `Authorization`

### Fluxo de Autenticação

```javascript
// Login bem-sucedido
localStorage.setItem('token', token)
localStorage.setItem('usuario', JSON.stringify(usuario))

// Requisições automáticas com token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## 📦 Funcionalidades

### Para Clientes

✅ Cadastro com busca automática de CEP (ViaCEP)  
✅ Login com autenticação JWT  
✅ Visualizar catálogo de produtos com imagens  
✅ Criar pedido com endereço de entrega  
✅ Calcular troco automaticamente (pagamento em dinheiro)  
✅ Acompanhar status dos pedidos (Pendente → Em Entrega → Entregue)  

### Para Administradores

✅ Todas as funcionalidades do cliente  
✅ Dashboard com estatísticas de pedidos  
✅ Gerenciar produtos (criar, editar, deletar)  
✅ Upload de imagens de produtos  
✅ Visualizar todos os pedidos  
✅ Atualizar status dos pedidos  

---

## 🌐 Integração com APIs Externas

### ViaCEP

O sistema utiliza a API do ViaCEP para busca automática de endereço:

```javascript
const buscarCep = async (cep) => {
  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
  const dados = await resposta.json()
  
  setLogradouro(dados.logradouro)
  setBairro(dados.bairro)
  setCidade(dados.localidade)
  setEstado(dados.uf)
}
```

**Exemplo:** Digite `60040-531` no campo de CEP e os campos de endereço são preenchidos automaticamente.

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🎯 Fluxo de Uso

### Fluxo do Cliente

1. Acessa `/login` ou `/cadastro`
2. Após login, é redirecionado para `/produtos`
3. Escolhe um produto e clica em "Pedir agora"
4. Preenche quantidade, endereço e forma de pagamento
5. Confirma o pedido
6. Acompanha o status em `/meus-pedidos`

### Fluxo do Admin

1. Faz login como admin
2. É redirecionado automaticamente para `/admin`
3. Vê dashboard com estatísticas
4. Pode gerenciar produtos em `/admin/produtos`
5. Atualiza status dos pedidos conforme a entrega

---

## 🧪 Como Testar

### Criar Conta de Teste

1. Vá em `/cadastro`
2. Preencha os dados
3. Use um CEP real para testar a busca automática (ex: `60040-531`)

### Criar Admin Manualmente

Para ter acesso ao painel administrativo:

1. Cadastre um usuário normal
2. Acesse o MongoDB Atlas
3. Encontre o usuário na coleção `usuarios`
4. Altere o campo `role` de `"cliente"` para `"admin"`

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

---

## 👨‍💻 Autor

Desenvolvido durante o aprendizado de React e integração com APIs.

**Repositório Backend:** [distribuidora-back](https://github.com/seu-usuario/distribuidora-back)