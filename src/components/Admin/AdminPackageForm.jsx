import { useState, useEffect } from 'react';
import { trackingService } from '../../services/trackingService';
import './Admin.css';

const AdminPackageForm = ({ packageData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    recipient: '',
    destination: '',
    weight: '',
    status: 'Processing',
    progress: 0,
    origin: 'Main Warehouse',
    estimatedDelivery: ''
  });

  useEffect(() => {
    if (packageData) {
      setFormData({
        trackingNumber: packageData.trackingNumber,
        recipient: packageData.recipient,
        destination: packageData.destination,
        weight: packageData.weight,
        status: packageData.status,
        progress: packageData.progress || 0,
        origin: packageData.history[0]?.location || 'Main Warehouse',
        estimatedDelivery: packageData.estimatedDelivery.toISOString().split('T')[0]
      });
    }
  }, [packageData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      estimatedDelivery: formData.estimatedDelivery ? new Date(formData.estimatedDelivery) : null,
      progress: parseInt(formData.progress) || 0
    });
  };

  return (
    <div className="admin-form-modal">
      <div className="admin-form-content">
        <h3>{packageData ? 'Edit Package' : 'Add New Package'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tracking Number</label>
            <input
              type="text"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              placeholder="Leave blank to auto-generate"
              disabled={!!packageData}
            />
          </div>
          
          <div className="form-group">
            <label>Recipient</label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {trackingService.getStatusOptions().map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Progress (%)</label>
            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Origin Location</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Estimated Delivery</label>
            <input
              type="date"
              name="estimatedDelivery"
              value={formData.estimatedDelivery}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {packageData ? 'Update Package' : 'Add Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPackageForm;