import React, { useState } from 'react';
import { Search, Filter, Edit2, Trash2, Phone, Mail, MapPin, Eye, Calendar, Award } from 'lucide-react';
import './DonorList.css';

export default function DonorList({ donors = [], onEdit, onDelete, setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [selectedDonor, setSelectedDonor] = useState(null); // For detail view modal
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtering Logic
  const filteredDonors = donors.filter((donor) => {
    const name = donor.name ? String(donor.name).toLowerCase() : '';
    const phone = donor.phone ? String(donor.phone) : '';
    const email = donor.email ? String(donor.email).toLowerCase() : '';
    const city = donor.city ? String(donor.city).toLowerCase() : '';
    
    const search = searchTerm.toLowerCase();

    const matchesSearch = 
      name.includes(search) ||
      phone.includes(search) ||
      email.includes(search) ||
      city.includes(search);

    const matchesBlood = bloodFilter ? donor.bloodGroup === bloodFilter : true;

    return matchesSearch && matchesBlood;
  });

  // Sort filtered donors in descending order (newest first)
  const sortedDonors = [...filteredDonors].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    if (dateB - dateA !== 0) {
      return dateB - dateA;
    }
    return String(b.id).localeCompare(String(a.id));
  });

  // Pagination Calculations
  const totalPages = Math.ceil(sortedDonors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDonors.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete donor: ${name}?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="donor-list-container animate-fade-in">
      <div className="donor-list-header">
        <div>
          <h2>Registered Donors</h2>
          <p className="subtitle">View, search, edit, and manage all blood donor profiles</p>
        </div>
        <div>
          <button className="add-donor-btn-top" onClick={() => setActiveTab('add-donor')}>
            + Register Donor
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-card glass-panel">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search by name, phone, city..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="filter-wrapper">
          <Filter className="filter-icon" size={18} />
          <select
            value={bloodFilter}
            onChange={(e) => { setBloodFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>

      {/* Donors Content */}
      {filteredDonors.length === 0 ? (
        <div className="empty-state glass-panel">
          <div className="empty-illustration">
            <Award size={48} className="empty-award" />
          </div>
          <h3>No Donors Found</h3>
          <p>We couldn't find any donor matching your search criteria.</p>
          {donors.length === 0 ? (
            <button className="empty-action-btn" onClick={() => setActiveTab('add-donor')}>
              Add Your First Donor
            </button>
          ) : (
            <button 
              className="empty-action-btn secondary"
              onClick={() => {
                setSearchTerm('');
                setBloodFilter('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive glass-panel">
          <table className="donors-table">
            <thead>
              <tr>
                <th>Donor Name</th>
                <th>Blood Group</th>
                <th>Contact Info</th>
                <th>Location</th>
                <th>Last Donation</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((donor) => (
                <tr key={donor.id} className="donor-row">
                  {/* Name and Gender */}
                  <td>
                    <div className="donor-identity">
                      <div className="donor-letter-avatar">
                        {donor.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="donor-name-cell">{donor.name}</span>
                        <span className="donor-subtitle-cell">{donor.gender}, Age: {donor.age}</span>
                      </div>
                    </div>
                  </td>
                  {/* Blood Group */}
                  <td>
                    <span className="blood-tag">{donor.bloodGroup}</span>
                  </td>
                  {/* Contact */}
                  <td>
                    <div className="donor-contact-cell">
                      <span className="contact-item">
                        <Phone size={12} />
                        {donor.phone}
                      </span>
                      {donor.email && (
                        <span className="contact-item">
                          <Mail size={12} />
                          {donor.email}
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Location */}
                  <td>
                    <div className="location-cell">
                      <MapPin size={14} className="loc-icon" />
                      <span>{donor.city}</span>
                    </div>
                  </td>
                  {/* Last Donation */}
                  <td>
                    <span className="donation-cell">
                      {donor.lastDonation ? (
                        <>
                          <Calendar size={12} />
                          {new Date(donor.lastDonation).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </>
                      ) : (
                        <span className="never-donated">Never Donated</span>
                      )}
                    </span>
                  </td>
                  {/* Actions */}
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="action-icon-btn view" 
                        title="View Details"
                        onClick={() => setSelectedDonor(donor)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-icon-btn edit" 
                        title="Edit Profile"
                        onClick={() => onEdit(donor)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-icon-btn delete" 
                        title="Delete Donor"
                        onClick={() => handleDelete(donor.id, donor.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-bar">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className="pagination-pages">
              {Array.from({ length: totalPages || 1 }, (_, idx) => idx + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
              disabled={currentPage === (totalPages || 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal View */}
      {selectedDonor && (
        <div className="modal-overlay" onClick={() => setSelectedDonor(null)}>
          <div className="modal-card glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-avatar">{selectedDonor.bloodGroup}</div>
              <div>
                <h3>{selectedDonor.name}</h3>
                <span className="modal-role">Donor Profile</span>
              </div>
              <button className="close-modal-btn" onClick={() => setSelectedDonor(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="m-label">Age</span>
                  <span className="m-val">{selectedDonor.age} years</span>
                </div>
                <div className="modal-info-item">
                  <span className="m-label">Gender</span>
                  <span className="m-val">{selectedDonor.gender}</span>
                </div>
                <div className="modal-info-item">
                  <span className="m-label">Phone</span>
                  <span className="m-val">{selectedDonor.phone}</span>
                </div>
                <div className="modal-info-item">
                  <span className="m-label">Email</span>
                  <span className="m-val">{selectedDonor.email || 'Not provided'}</span>
                </div>
                <div className="modal-info-item">
                  <span className="m-label">Location (City)</span>
                  <span className="m-val">{selectedDonor.city}</span>
                </div>
                <div className="modal-info-item">
                  <span className="m-label">Last Donation</span>
                  <span className="m-val">
                    {selectedDonor.lastDonation 
                      ? new Date(selectedDonor.lastDonation).toLocaleDateString()
                      : 'Never Donated'}
                  </span>
                </div>
              </div>

              {selectedDonor.notes && (
                <div className="modal-notes-section">
                  <span className="m-label">Medical History Notes</span>
                  <p className="m-notes-box">{selectedDonor.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="modal-action-btn edit-btn" 
                onClick={() => {
                  onEdit(selectedDonor);
                  setSelectedDonor(null);
                }}
              >
                Edit Profile
              </button>
              <button className="modal-action-btn close-btn" onClick={() => setSelectedDonor(null)}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
