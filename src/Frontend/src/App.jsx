import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import PaginaBase from './pages/PaginaBase'
import Dashboard from './pages/Dashboard'
import Agricultores from './pages/Agricultores'
import Atendimentos from './pages/Atendimentos'
import Relatorio from './pages/Relatorio'
import Configuracao from './pages/Configuracao'
import RecuperarSenha from './pages/RecuperarSenha'

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route element={<PaginaBase />}>
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
