import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import MenuLateral from './pages/MenuLateral'
import Dashboard from './pages/Dashboard'
import Agricultores from './pages/Agricultores'
import Atendimentos from './pages/Atendimentos'
import Relatorio from './pages/Relatorio'
import Configuracao from './pages/Configuracao'

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MenuLateral />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agricultores" element={<Agricultores />} />
          <Route path="/atendimentos" element={<Atendimentos />} />
          <Route path="/relatorio" element={<Relatorio />} />
          <Route path="/configuracao" element={<Configuracao />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
