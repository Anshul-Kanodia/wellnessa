import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('hospital');
  const [showAddPatient, setShowAddPatient] = useState(false);

  const patients = [
    { id: 1, name: 'John Doe', age: 45, condition: 'Hypertension', status: 'Stable', lastVisit: '2024-01-15' },
    { id: 2, name: 'Jane Smith', age: 32, condition: 'Diabetes', status: 'Monitoring', lastVisit: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', age: 67, condition: 'Heart Disease', status: 'Critical', lastVisit: '2024-01-13' },
    { id: 4, name: 'Alice Brown', age: 29, condition: 'Anxiety', status: 'Improving', lastVisit: '2024-01-12' },
    { id: 5, name: 'Charlie Wilson', age: 54, condition: 'Depression', status: 'Stable', lastVisit: '2024-01-11' }
  ];

  const renderHospitalHomepage = () => (
    <div className="hospital-homepage">
      <div className="dashboard-header">
        <div className="hospital-info">
          <h1>Care Hospitals Gachibowli</h1>
          <p>Hospital Dashboard</p>
        </div>
        <button 
          className="btn btn-primary add-patient-btn"
          onClick={() => setShowAddPatient(true)}
        >
          + Add Patient
        </button>
      </div>
      
      <div className="patients-table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.condition}</td>
                <td>
                  <span className={`status-badge ${patient.status.toLowerCase()}`}>
                    {patient.status}
                  </span>
                </td>
                <td>{patient.lastVisit}</td>
                <td>
                  <button className="btn-small btn-outline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPatientDashboardAdmin = () => (
    <div className="patient-dashboard admin-view">
      <div className="dashboard-header">
        <div className="patient-info">
          <h1>Akhil Voora</h1>
          <p>At Care Hospitals Gachibowli</p>
        </div>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView('admin')}
          >
            Admin View
          </button>
          <button 
            className={`toggle-btn ${currentView === 'patient' ? 'active' : ''}`}
            onClick={() => setCurrentView('patient')}
          >
            Patient View
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <a href="#" className="nav-item active">Dashboard</a>
            <a href="#" className="nav-item">Tests</a>
            <a href="#" className="nav-item">Reports</a>
            <a href="#" className="nav-item">Medications</a>
          </nav>
        </div>

        <div className="dashboard-main">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Patient Overview</h3>
              <div className="chart-placeholder">
                <div className="chart-line"></div>
                <div className="chart-data">
                  <span>Heart Rate: 72 BPM</span>
                  <span>Blood Pressure: 120/80</span>
                  <span>Temperature: 98.6°F</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Recent Tests</h3>
              <div className="test-list">
                <div className="test-item">
                  <span>Blood Test</span>
                  <span className="test-date">Jan 15, 2024</span>
                </div>
                <div className="test-item">
                  <span>X-Ray</span>
                  <span className="test-date">Jan 12, 2024</span>
                </div>
                <div className="test-item">
                  <span>ECG</span>
                  <span className="test-date">Jan 10, 2024</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Upcoming Appointments</h3>
              <div className="appointment-list">
                <div className="appointment-item">
                  <span>Dr. Smith - Cardiology</span>
                  <span className="appointment-date">Jan 20, 2024</span>
                </div>
                <div className="appointment-item">
                  <span>Dr. Johnson - General</span>
                  <span className="appointment-date">Jan 25, 2024</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Medications</h3>
              <div className="medication-list">
                <div className="medication-item">
                  <span>Lisinopril 10mg</span>
                  <span className="medication-frequency">Once daily</span>
                </div>
                <div className="medication-item">
                  <span>Metformin 500mg</span>
                  <span className="medication-frequency">Twice daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientDashboardPatient = () => (
    <div className="patient-dashboard patient-view">
      <div className="dashboard-header">
        <div className="patient-info">
          <h1>Akhil Voora</h1>
          <p>At Care Hospitals Gachibowli</p>
        </div>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView('admin')}
          >
            Admin View
          </button>
          <button 
            className={`toggle-btn ${currentView === 'patient' ? 'active' : ''}`}
            onClick={() => setCurrentView('patient')}
          >
            Patient View
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <a href="#" className="nav-item active">Dashboard</a>
            <a href="#" className="nav-item">Tests</a>
            <a href="#" className="nav-item">Appointments</a>
            <a href="#" className="nav-item">Messages</a>
          </nav>
        </div>

        <div className="dashboard-main">
          <div className="patient-welcome">
            <h2>Welcome back, Akhil!</h2>
            <p>Here's your health summary for today</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Health Metrics</h3>
              <div className="health-metrics">
                <div className="metric">
                  <span className="metric-label">Heart Rate</span>
                  <span className="metric-value">72 BPM</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Blood Pressure</span>
                  <span className="metric-value">120/80</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Weight</span>
                  <span className="metric-value">75 kg</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Next Appointment</h3>
              <div className="next-appointment">
                <div className="appointment-details">
                  <h4>Dr. Smith - Cardiology</h4>
                  <p>January 20, 2024 at 2:00 PM</p>
                  <button className="btn btn-primary btn-small">Reschedule</button>
                </div>
              </div>
            </div>

            <div className="dashboard-card full-width">
              <h3>My Health Journey</h3>
              <div className="health-journey">
                <p>No health issues detected</p>
                <p>You are on track with your health goals!</p>
                <div className="journey-chart">
                  <div className="chart-placeholder-simple">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '75%'}}></div>
                    </div>
                    <span>75% Health Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddPatientModal = () => (
    <div className="modal-overlay" onClick={() => setShowAddPatient(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Patient</h2>
          <button 
            className="close-btn"
            onClick={() => setShowAddPatient(false)}
          >
            ×
          </button>
        </div>
        
        <form className="add-patient-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="Enter first name" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Enter last name" />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input type="number" placeholder="Enter age" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select>
                <option>Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Condition</label>
            <input type="text" placeholder="Enter medical condition" />
          </div>
          
          <div className="form-group">
            <label>Contact Number</label>
            <input type="tel" placeholder="Enter contact number" />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowAddPatient(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-nav-tabs">
        <button 
          className={`tab-btn ${currentView === 'hospital' ? 'active' : ''}`}
          onClick={() => setCurrentView('hospital')}
        >
          Hospital Homepage
        </button>
        <button 
          className={`tab-btn ${currentView === 'admin' ? 'active' : ''}`}
          onClick={() => setCurrentView('admin')}
        >
          Patient Dashboard (Admin)
        </button>
        <button 
          className={`tab-btn ${currentView === 'patient' ? 'active' : ''}`}
          onClick={() => setCurrentView('patient')}
        >
          Patient Dashboard (Patient)
        </button>
      </div>

      {currentView === 'hospital' && renderHospitalHomepage()}
      {currentView === 'admin' && renderPatientDashboardAdmin()}
      {currentView === 'patient' && renderPatientDashboardPatient()}
      
      {showAddPatient && renderAddPatientModal()}
    </div>
  );
};

export default Dashboard;
