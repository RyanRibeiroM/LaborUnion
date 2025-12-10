import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    ClipboardList, 
    Settings, 
    Menu, 
    LogOut, CircleUser
} from 'lucide-react';
import '../assets/css/PaginaBase.css';

function PaginaBase() {
    const [isExpanded, setIsExpanded] = useState(true);

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleLogout = () => {
        const confirmacao = window.confirm("Deseja realmente sair e desconectar sua conta?");
        
        if (confirmacao) {
            navigate('/');
        }
    };

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/agricultores', label: 'Agricultores', icon: Users },
        { path: '/atendimentos', label: 'Atendimento', icon: Calendar },
        { path: '/relatorio', label: 'Relatório', icon: ClipboardList },
        { path: '/configuracao', label: 'Configuração', icon: Settings },
    ];

    return (
        <div className="main-layout">
            <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
                
                <div className="sidebar-header">
                    {isExpanded && <h2 className="logo-text">Sindicato</h2>}
                    
                    <button onClick={toggleSidebar} className="toggle-btn">
                        {isExpanded ? <Menu size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink 
                                    to={item.path}
                                    className={({ isActive }) => 
                                        `nav-item ${isActive ? 'active' : ''}`
                                    }
                                >
                                    <item.icon size={24} className="nav-icon" />
                                    <span className="nav-label">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <footer>
                    <Link to="/profile" className="footer-item profile-link">
                        <CircleUser size={24} />
                        <span className="footer-text">Perfil</span>
                    </Link>

                    <div onClick={handleLogout} className="footer-item logout-btn">
                        <span className="footer-text">Sair</span>
                        <LogOut size={24} />
                    </div>
                </footer>
            </aside>

            <main className="content-area">
                <Outlet />
            </main>
        </div>
    );
}

export default PaginaBase;