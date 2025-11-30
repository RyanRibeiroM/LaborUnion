import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    ClipboardList, 
    Settings, 
    Menu
} from 'lucide-react';
import '../assets/css/PaginaBase.css';

function PaginaBase() {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    // Definição dos itens do menu para facilitar a renderização
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/agricultores', label: 'Agricultores', icon: Users },
        { path: '/atendimentos', label: 'Atendimento', icon: Calendar },
        { path: '/relatorio', label: 'Relatório', icon: ClipboardList },
        { path: '/configuracao', label: 'Configuração', icon: Settings },
    ];

    return (
        <div className="main-layout">
            {/* MENU LATERAL */}
            <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
                
                {/* Cabeçalho do Menu (Logo + Botão de Colapso) */}
                <div className="sidebar-header">
                    {isExpanded && <h2 className="logo-text">Sindicato</h2>}
                    
                    <button onClick={toggleSidebar} className="toggle-btn">
                        {isExpanded ? <Menu size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Lista de Navegação */}
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
            </aside>

            {/* ÁREA DE CONTEÚDO (Onde as rotas filhas aparecem) */}
            <main className="content-area">
                <Outlet />
            </main>
        </div>
    );
}

export default PaginaBase;