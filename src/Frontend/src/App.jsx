import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import RecuperarSenha from './pages/RecuperarSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import PaginaBase from './pages/PaginaBase'
import Dashboard from './pages/Dashboard'
import Agricultores from './pages/Agricultores'
import Atendimentos from './pages/Atendimentos'
import Relatorio from './pages/Relatorio'
import Configuracao from './pages/Configuracao'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route element={
            <ProtectedRoute>
              <PaginaBase />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agricultores" element={<Agricultores />} />
            <Route path="/atendimentos" element={<Atendimentos />} />
            <Route path="/relatorio" element={<Relatorio />} />
            <Route path="/configuracao" element={<Configuracao />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App


