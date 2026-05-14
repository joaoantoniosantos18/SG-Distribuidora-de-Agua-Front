import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Lê a preferência salva, ou usa a preferência do sistema operacional
  const [tema, setTema] = useState(() => {
    const salvo = localStorage.getItem('tema')
    if (salvo) return salvo
    // Se o SO do usuário já está em dark mode, começa no escuro
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
  })

  // Toda vez que o tema mudar, aplica no <html> e salva no localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    localStorage.setItem('tema', tema)
  }, [tema])

  const alternarTema = () => {
    setTema(t => t === 'claro' ? 'escuro' : 'claro')
  }

  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  )
}