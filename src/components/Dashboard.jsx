import React from 'react';
import { Users, Droplets, AlertTriangle, Calendar, Award, MapPin, Activity } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ donors = [], setActiveTab }) {
  // Compute Stats
  const totalDonors = donors.length;
  
  // Calculate inventory based on donors
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const inventory = bloodGroups.reduce((acc, group) => {
    // Each donor counts as 1 unit (450ml) for simplicity
    acc[group] = donors.filter(d => d.bloodGroup === group).length;
    return acc;
  }, {});

  const totalUnits = Object.values(inventory).reduce((a, b) => a + b, 0);

  // Critical groups are those with 0 or 1 units available
  const criticalGroups = bloodGroups.filter(g => inventory[g] <= 1);

  // Get recent 3 donors
  const recentDonors = [...donors]
    .sort((a, b) => new Date(b.createdAt || b.lastDonation) - new Date(a.createdAt || a.lastDonation))
    .slice(0, 4);

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p className="subtitle">Real-time blood stock levels and donor activity metrics</p>
        </div>
        <div className="header-actions">
          <button className="add-quick-btn" onClick={() => setActiveTab('add-donor')}>
            + Quick Add Donor
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <span className="stat-title">Total Donors</span>
            <div className="stat-icon-wrapper blue">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h3>{totalDonors}</h3>
            <span className="stat-trend positive">Active Donors</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <span className="stat-title">Blood Units (Stock)</span>
            <div className="stat-icon-wrapper red">
              <Droplets size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h3>{totalUnits} <span className="unit-label">Units</span></h3>
            <span className="stat-trend positive">1 Unit = 450ml</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <span className="stat-title">Critical Shortage</span>
            <div className="stat-icon-wrapper yellow">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h3>{criticalGroups.length} <span className="unit-label">Groups</span></h3>
            <span className="stat-trend warning-trend">Stock below 2 units</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <span className="stat-title">Recent Registrations</span>
            <div className="stat-icon-wrapper green">
              <Calendar size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h3>{recentDonors.length}</h3>
            <span className="stat-trend positive">Last 7 Days</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Stock and Recent Activity */}
      <div className="dashboard-content-grid">
        {/* Blood Stock Card */}
        <div className="stock-card glass-panel">
          <div className="panel-header">
            <Activity className="panel-icon" size={20} />
            <h4>Blood Stock Levels (by Group)</h4>
          </div>
          <div className="stock-list">
            {bloodGroups.map((group) => {
              const count = inventory[group];
              // Map count to percentage for representation. Max is set to 8 units.
              const percentage = Math.min((count / 8) * 100, 100);
              
              // Set progress bar colors
              let progressColor = 'var(--primary)';
              if (count === 0) progressColor = '#3a3f50';
              else if (count <= 1) progressColor = 'var(--warning)';
              else if (count >= 5) progressColor = 'var(--success)';

              return (
                <div key={group} className="stock-item">
                  <div className="stock-info">
                    <span className="blood-badge">{group}</span>
                    <span className="stock-count">
                      {count === 0 ? 'Out of stock' : `${count} ${count === 1 ? 'Unit' : 'Units'}`}
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${percentage || 4}%`, 
                        backgroundColor: progressColor 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="recent-card glass-panel">
          <div className="panel-header">
            <Award className="panel-icon" size={20} />
            <h4>Recent Registrations</h4>
          </div>
          <div className="recent-list">
            {recentDonors.length === 0 ? (
              <div className="empty-recent">
                <Users size={40} className="empty-icon" />
                <p>No donors registered yet</p>
                <button className="add-btn-inline" onClick={() => setActiveTab('add-donor')}>
                  Register First Donor
                </button>
              </div>
            ) : (
              recentDonors.map((donor) => (
                <div key={donor.id} className="recent-donor-item">
                  <div className="recent-donor-avatar">
                    {donor.bloodGroup}
                  </div>
                  <div className="recent-donor-info">
                    <h5>{donor.name}</h5>
                    <div className="donor-meta-row">
                      <span className="donor-meta-item">
                        <MapPin size={12} />
                        {donor.city || 'N/A'}
                      </span>
                      <span className="donor-meta-item">
                        Age: {donor.age}
                      </span>
                    </div>
                  </div>
                  <div className="recent-donor-status">
                    <span className="phone-num">{donor.phone}</span>
                    <span className="date-added">
                      {new Date(donor.createdAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
