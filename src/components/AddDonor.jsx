import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Calendar, HeartHandshake, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import './AddDonor.css';

export default function AddDonor({ onAddDonor, donorToEdit, onCancelEdit }) {
  const isEditMode = !!donorToEdit;

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    email: '',
    city: '',
    lastDonation: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // Pre-fill form if editing a donor
  useEffect(() => {
    if (isEditMode && donorToEdit) {
      setFormData({
        name: donorToEdit.name || '',
        age: donorToEdit.age || '',
        gender: donorToEdit.gender || '',
        bloodGroup: donorToEdit.bloodGroup || '',
        phone: donorToEdit.phone || '',
        email: donorToEdit.email || '',
        city: donorToEdit.city || '',
        lastDonation: donorToEdit.lastDonation || '',
        notes: donorToEdit.notes || '',
      });
    } else {
      setFormData({
        name: '',
        age: '',
        gender: '',
        bloodGroup: '',
        phone: '',
        email: '',
        city: '',
        lastDonation: '',
        notes: '',
      });
    }
    setErrors({});
    setSuccessMsg('');
  }, [donorToEdit, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
        newErrors.age = 'Donor must be between 18 and 65 years old';
      }
    }

    if (!formData.gender) newErrors.gender = 'Gender selection is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.city.trim()) newErrors.city = 'City/Location is required';

    if (formData.lastDonation) {
      const donationDate = new Date(formData.lastDonation);
      const today = new Date();
      if (donationDate > today) {
        newErrors.lastDonation = 'Last donation date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!validate()) {
      return;
    }

    const donorData = {
      ...formData,
      id: isEditMode ? donorToEdit.id : Date.now().toString(),
      createdAt: isEditMode ? donorToEdit.createdAt : new Date().toISOString(),
    };

    onAddDonor(donorData);

    setSuccessMsg(isEditMode ? 'Donor details updated successfully!' : 'Donor registered successfully!');

    // Reset form after 1.5 seconds if registering new
    if (!isEditMode) {
      setTimeout(() => {
        setFormData({
          name: '',
          age: '',
          gender: '',
          bloodGroup: '',
          phone: '',
          email: '',
          city: '',
          lastDonation: '',
          notes: '',
        });
        setSuccessMsg('');
      }, 1500);
    }
  };

  return (
    <div className="add-donor-container animate-fade-in">
      <div className="add-donor-header">
        <div>
          <h2>{isEditMode ? 'Edit Donor Details' : 'Register New Donor'}</h2>
          <p className="subtitle">
            {isEditMode 
              ? 'Update the registration record for this donor' 
              : 'Add a new donor to the YUVA Blood Bank register database'}
          </p>
        </div>
        {isEditMode && (
          <button className="cancel-edit-btn" onClick={onCancelEdit}>
            Back to List
          </button>
        )}
      </div>

      {successMsg && (
        <div className="success-banner">
          <CheckCircle size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="form-card glass-panel">
        <div className="form-section-title">
          <HeartHandshake size={20} className="sec-icon" />
          <span>Donor Information</span>
        </div>

        <form onSubmit={handleSubmit} className="donor-form">
          <div className="form-grid">
            {/* Full Name */}
            <div className="form-item">
              <label htmlFor="name">Full Name <span className="req">*</span></label>
              <div className={`form-input-wrapper ${errors.name ? 'has-error' : ''}`}>
                <User className="form-icon" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Age */}
            <div className="form-item">
              <label htmlFor="age">Age (18 - 65) <span className="req">*</span></label>
              <div className={`form-input-wrapper ${errors.age ? 'has-error' : ''}`}>
                <Calendar className="form-icon" size={18} />
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="25"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>

            {/* Gender */}
            <div className="form-item">
              <label htmlFor="gender">Gender <span className="req">*</span></label>
              <div className={`form-input-wrapper ${errors.gender ? 'has-error' : ''}`}>
                <User className="form-icon" size={18} />
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>

            {/* Blood Group */}
            <div className="form-item">
              <label htmlFor="bloodGroup">Blood Group <span className="req">*</span></label>
              <div className={`form-input-wrapper ${errors.bloodGroup ? 'has-error' : ''}`}>
                <span className="blood-icon-label form-icon">AB</span>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">Select Blood Group</option>
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
              {errors.bloodGroup && <span className="error-text">{errors.bloodGroup}</span>}
            </div>

            {/* Phone */}
            <div className="form-item">
              <label htmlFor="phone">Phone Number <span className="req">*</span></label>
              <div className={`form-input-wrapper ${errors.phone ? 'has-error' : ''}`}>
                <Phone className="form-icon" size={18} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Email */}
            <div className="form-item">
              <label htmlFor="email">Email Address</label>
              <div className={`form-input-wrapper ${errors.email ? 'has-error' : ''}`}>
                <Mail className="form-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* City */}
            <div className="form-item">
              <label htmlFor="city">City / Location <span className="req">*</span></label>
              <div className={`form-input-wrapper ${errors.city ? 'has-error' : ''}`}>
                <MapPin className="form-icon" size={18} />
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Chennai"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            {/* Last Donation Date */}
            <div className="form-item">
              <label htmlFor="lastDonation">Last Donation Date</label>
              <div className={`form-input-wrapper ${errors.lastDonation ? 'has-error' : ''}`}>
                <Calendar className="form-icon" size={18} />
                <input
                  type="date"
                  id="lastDonation"
                  name="lastDonation"
                  value={formData.lastDonation}
                  onChange={handleChange}
                />
              </div>
              {errors.lastDonation && <span className="error-text">{errors.lastDonation}</span>}
            </div>
          </div>

          {/* Notes */}
          <div className="form-item-full">
            <label htmlFor="notes">Medical History Notes / Remarks</label>
            <div className="form-input-wrapper textarea-wrapper">
              <FileText className="form-icon textarea-icon" size={18} />
              <textarea
                id="notes"
                name="notes"
                rows="3"
                placeholder="List any medical condition, regular medication, or allergies if any..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="form-alert-info">
            <AlertTriangle size={16} className="info-icon" />
            <p>
              Please verify that the donor meets all safety standards (weight &gt; 45kg, no fever/flu in the past week, and &gt; 90 days interval from the last donation).
            </p>
          </div>

          <div className="form-actions">
            {isEditMode ? (
              <>
                <button type="button" className="secondary-btn" onClick={onCancelEdit}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn edit">
                  Update Donor Details
                </button>
              </>
            ) : (
              <button type="submit" className="submit-btn">
                Register Donor
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
