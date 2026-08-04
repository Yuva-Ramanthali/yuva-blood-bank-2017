import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddDonor from './components/AddDonor';
import DonorList from './components/DonorList';
import { Loader2 } from 'lucide-react';
import './App.css';

const API_URL = 'https://script.google.com/macros/s/AKfycbyxUIF5TAxHQ3dUPzrUcTm8hv5d7Lwv4iB8EMt7LUqeFwBIE1LAlpIvSSdS5MLfe3QJ/exec';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('blood_bank_auth') === 'true';
  });

  // Active View Tab State: 'dashboard' | 'add-donor' | 'donor-list'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Donors State
  const [donors, setDonors] = useState([]);
  
  // Loading & Saving States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Track the donor being edited (null if adding a new donor)
  const [donorToEdit, setDonorToEdit] = useState(null);

  // Fetch all donors from Google Sheets on load
  const fetchDonors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        // Reverse array so bottom rows of Google Sheets (newest) show at index 0 (descending order)
        setDonors(data.reverse());
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Unexpected data format received from API');
      }
    } catch (err) {
      console.error('Failed to fetch donors from Google Sheets:', err);
      setError('Could not connect to Yuva Blood Bank. Showing offline cached data.');
      // Load fallback local storage if API fails
      const savedDonors = localStorage.getItem('blood_bank_donors');
      if (savedDonors) {
        setDonors(JSON.parse(savedDonors));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchDonors();
    }
  }, [isLoggedIn]);

  // Sync donors with localStorage (as offline cache fallback)
  useEffect(() => {
    if (donors.length > 0) {
      localStorage.setItem('blood_bank_donors', JSON.stringify(donors));
    }
  }, [donors]);

  // Auth actions
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('blood_bank_auth', 'true');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('blood_bank_auth');
  };

  // Donor Actions (API write operations)
  const handleAddDonor = async (donor) => {
    setSaving(true);
    const action = donorToEdit ? 'edit' : 'add';
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: action,
          donor: donor
        })
      });

      const result = await response.json();
      if (result.success) {
        if (donorToEdit) {
          // Edit local state
          setDonors((prev) =>
            prev.map((d) => (String(d.id) === String(donor.id) ? donor : d))
          );
          setDonorToEdit(null);
        } else {
          // Add local state
          setDonors((prev) => [donor, ...prev]);
        }
        setActiveTab('donor-list');
      } else {
        throw new Error(result.error || 'Failed to save to Yuva Blood Bank');
      }
    } catch (err) {
      console.error('Error saving donor:', err);
      alert(`API Error: ${err.message}. Saving offline locally instead.`);
      
      // Local fallback in case of errors
      if (donorToEdit) {
        setDonors((prev) => prev.map((d) => (String(d.id) === String(donor.id) ? donor : d)));
        setDonorToEdit(null);
      } else {
        setDonors((prev) => [donor, ...prev]);
      }
      setActiveTab('donor-list');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDonor = async (id) => {
    setSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'delete',
          donor: { id: id }
        })
      });

      const result = await response.json();
      if (result.success) {
        setDonors((prev) => prev.filter((d) => String(d.id) !== String(id)));
      } else {
        throw new Error(result.error || 'Failed to delete from Yuva Blood Bank');
      }
    } catch (err) {
      console.error('Error deleting donor:', err);
      alert(`API Error: ${err.message}. Removing locally instead.`);
      setDonors((prev) => prev.filter((d) => String(d.id) !== String(id)));
    } finally {
      setSaving(false);
    }
  };

  const handleEditDonorClick = (donor) => {
    setDonorToEdit(donor);
    setActiveTab('add-donor');
  };

  const handleCancelEdit = () => {
    setDonorToEdit(null);
    setActiveTab('donor-list');
  };

  // Guard routing - show login if not authenticated
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-shell">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Clear edit states when switching screens
          if (tab !== 'add-donor') {
            setDonorToEdit(null);
          }
        }} 
        onLogout={handleLogout}
        donorsCount={donors.length}
      />

      <main className="main-content">
        {/* API Connection Warning Banner */}
        {error && (
          <div className="api-warning-banner">
            <span>⚠️ {error}</span>
            <button className="retry-btn" onClick={fetchDonors}>Retry</button>
          </div>
        )}

        {/* Global Action Saving Overlay Loader */}
        {saving && (
          <div className="loading-overlay">
            <div className="overlay-content">
              <Loader2 className="spinner-icon animate-spin" size={32} />
              <span>Saving changes to Yuva Blood Bank...</span>
            </div>
          </div>
        )}

        <div className="main-content-wrapper">
          {loading ? (
            <div className="global-loader-container">
              <Loader2 className="spinner-icon animate-spin" size={48} />
              <h4>Connecting to Yuva Blood Bank...</h4>
              <p>Fetching active blood donor records</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard 
                  donors={donors} 
                  setActiveTab={setActiveTab} 
                />
              )}
              {activeTab === 'add-donor' && (
                <AddDonor 
                  onAddDonor={handleAddDonor} 
                  donorToEdit={donorToEdit}
                  onCancelEdit={handleCancelEdit}
                />
              )}
              {activeTab === 'donor-list' && (
                <DonorList 
                  donors={donors} 
                  onEdit={handleEditDonorClick} 
                  onDelete={handleDeleteDonor}
                  setActiveTab={setActiveTab}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
