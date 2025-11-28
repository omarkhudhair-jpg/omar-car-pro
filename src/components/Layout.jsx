import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import {
    FiHome,
    FiDroplet,
    FiTool,
    FiDollarSign,
    FiTruck,
    FiMenu,
    FiX,
    FiMoon,
    FiSun,
    FiSettings
} from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Layout.css';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const { t, language } = useLanguage();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
    };

    const navItems = [
        { path: '/', icon: FiHome, label: t('dashboard') },
        { path: '/fuel', icon: FiDroplet, label: t('fuel') },
        { path: '/maintenance', icon: FiTool, label: t('maintenance') },
        { path: '/expenses', icon: FiDollarSign, label: t('expenses') },
        { path: '/vehicles', icon: FiTruck, label: t('vehicles') },
        { path: '/settings', icon: FiSettings, label: t('settings') },
    ];

    return (
        <div className={`layout ${language === 'ar' ? 'rtl' : ''}`}>
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <button className="btn-icon" onClick={toggleSidebar}>
                        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                    <h1 className="app-title">{t('appTitle')}</h1>
                    <button className="btn-icon" onClick={toggleDarkMode}>
                        {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <a
                            key={item.path}
                            href={item.path}
                            className="nav-item"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="bottom-nav">
                {navItems.slice(0, 5).map((item) => (
                    <a key={item.path} href={item.path} className="bottom-nav-item">
                        <item.icon size={22} />
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
        </div>
    );
};

export default Layout;
