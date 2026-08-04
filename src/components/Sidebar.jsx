import React from 'react';
import { LayoutDashboard, UserPlus, Users, LogOut, User } from 'lucide-react';
import logo from '../assets/logo.png';
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab, onLogout, donorsCount = 0 }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-donor', label: 'Add Donor', icon: UserPlus },
    { id: 'donor-list', label: 'Donor List', icon: Users },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <img src={logo} className="sidebar-logo-img" alt="YUVA Logo" />
        </div>
        <div className="brand-name">
          <h3>YUVA</h3>
          <span>BLOOD BANK</span>
        </div>
      </div>

      <div className="user-profile-badge">
        <div className="user-avatar">
          <User size={18} />
        </div>
        <div className="user-info">
          <span className="user-role">Administrator</span>
          <span className="user-email">yuva@gmail.com</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={20} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {item.id === 'donor-list' && donorsCount > 0 && (
                    <span className="badge">{donorsCount}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={20} className="logout-icon" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
