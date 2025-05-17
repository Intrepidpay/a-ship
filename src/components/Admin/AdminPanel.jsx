import { useState, useEffect } from 'react';
import { trackingService } from '../../services/trackingService';
import AdminPackageForm from './AdminPackageForm';
import './Admin.css';

const AdminPanel = ({ onLogout }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({
    trackingNumber: '',
    newStatus: '',
    location: '',
    progress: ''
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const allPackages = await trackingService.getAllPackages();
      setPackages(allPackages);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (trackingNumber, newStatus, location, progress) => {
    try {
      await trackingService.updatePackageStatus(
        trackingNumber, 
        newStatus, 
        location,
        progress ? parseInt(progress) : undefined
      );
      await loadPackages();
    } catch (error) {
      alert(`Update failed: ${error.message}`);
    }
  };

  const handleDelete = async (trackingNumber) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await trackingService.deletePackage(trackingNumber);
        await loadPackages();
      } catch (error) {
        alert(`Delete failed: ${error.message}`);
      }
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPackage) {
        await trackingService.deletePackage(editingPackage.trackingNumber);
        await trackingService.addNewPackage(formData);
      } else {
        await trackingService.addNewPackage(formData);
      }
      setShowForm(false);
      setEditingPackage(null);
      await loadPackages();
    } catch (error) {
      alert(`Operation failed: ${error.message}`);
    }
  };

  if (loading) return <div className="loading">Loading packages...</div>;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add New Package
          </button>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <AdminPackageForm
          packageData={editingPackage}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPackage(null);
          }}
        />
      )}

      <div className="status-update-section">
        <h3>Quick Status Update</h3>
        <div className="status-update-form">
          <select
            value={statusUpdate.trackingNumber}
            onChange={(e) => setStatusUpdate({...statusUpdate, trackingNumber: e.target.value})}
          >
            <option value="">Select Package</option>
            {packages.map(pkg => (
              <option key={pkg.trackingNumber} value={pkg.trackingNumber}>
                {pkg.trackingNumber} - {pkg.recipient}
              </option>
            ))}
          </select>
          
          <select
            value={statusUpdate.newStatus}
            onChange={(e) => setStatusUpdate({...statusUpdate, newStatus: e.target.value})}
          >
            <option value="">Select Status</option>
            {trackingService.getStatusOptions().map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Location"
            value={statusUpdate.location}
            onChange={(e) => setStatusUpdate({...statusUpdate, location: e.target.value})}
          />
          
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Progress %"
            value={statusUpdate.progress}
            onChange={(e) => setStatusUpdate({...statusUpdate, progress: e.target.value})}
          />
          
          <button
            onClick={() => {
              if (statusUpdate.trackingNumber && statusUpdate.newStatus) {
                handleStatusUpdate(
                  statusUpdate.trackingNumber,
                  statusUpdate.newStatus,
                  statusUpdate.location,
                  statusUpdate.progress
                );
                setStatusUpdate({ 
                  trackingNumber: '', 
                  newStatus: '', 
                  location: '',
                  progress: ''
                });
              }
            }}
            className="btn-primary"
          >
            Update Status
          </button>
        </div>
      </div>

      <div className="package-list">
        <h3>All Packages ({packages.length})</h3>
        {packages.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Tracking #</th>
                <th>Recipient</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.trackingNumber}>
                  <td>{pkg.trackingNumber}</td>
                  <td>{pkg.recipient}</td>
                  <td>
                    <span className={`status-badge ${pkg.status.toLowerCase().replace(' ', '-')}`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td>
                    <div className="progress-container">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${pkg.progress}%` }}
                      ></div>
                      <span>{pkg.progress}%</span>
                    </div>
                  </td>
                  <td className="actions">
                    <button onClick={() => handleEdit(pkg)} className="btn-edit">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(pkg.trackingNumber)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No packages found</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;