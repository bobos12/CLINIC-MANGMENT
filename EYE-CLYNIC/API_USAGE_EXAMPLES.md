# API Usage Examples for Frontend

This document provides practical examples of how to use the API client in your React components.

## Setup

First, import the API client:

```javascript
import {
  login,
  getAllPatients,
  createPatient,
  getPatientWithVisits,
  createVisit,
  // ... other functions
} from './services/apiClient';
```

## Authentication Examples

### Login Component

```jsx
import { useState } from 'react';
import { login } from '../services/apiClient';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await login(email, password);
      // Token and user are automatically stored in localStorage
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Get Current User

```jsx
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/apiClient';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

## Patient Examples

### Patients List Component

```jsx
import { useEffect, useState } from 'react';
import { getAllPatients } from '../services/apiClient';

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getAllPatients();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Loading patients...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Patients</h1>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td>{patient.code}</td>
              <td>{patient.name}</td>
              <td>{patient.phone}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Create Patient Component

```jsx
import { useState } from 'react';
import { createPatient } from '../services/apiClient';
import { useNavigate } from 'react-router-dom';

function CreatePatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'other',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const patient = await createPatient({
        ...formData,
        age: parseInt(formData.age),
      });
      // Redirect to patient details
      navigate(`/patients/${patient._id}`);
    } catch (err) {
      if (err.status === 409) {
        setError('A patient with this phone number already exists');
      } else {
        setError(err.message || 'Failed to create patient');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Patient Name"
        required
      />
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
        required
        min="1"
      />
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Patient'}
      </button>
    </form>
  );
}
```

### Search Patients Component

```jsx
import { useState } from 'react';
import { searchPatientsByName } from '../services/apiClient';

function PatientSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await searchPatientsByName(searchQuery);
      setResults(data.patients);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {results.length > 0 && (
        <div>
          <h3>Found {results.length} patient(s)</h3>
          <ul>
            {results.map((patient) => (
              <li key={patient._id}>
                {patient.code} - {patient.name} - {patient.phone}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Patient Details with Visits

```jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPatientWithVisits } from '../services/apiClient';

function PatientDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPatientWithVisits(id);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  const { patient, visits } = data;

  return (
    <div>
      <h1>Patient: {patient.name}</h1>
      <p>Code: {patient.code}</p>
      <p>Phone: {patient.phone}</p>
      <p>Age: {patient.age}</p>
      <p>Gender: {patient.gender}</p>

      <h2>Visits ({visits.length})</h2>
      {visits.length === 0 ? (
        <p>No visits recorded</p>
      ) : (
        <ul>
          {visits.map((visit) => (
            <li key={visit._id}>
              <strong>Date:</strong> {new Date(visit.visitDate).toLocaleDateString()}
              <br />
              <strong>Doctor:</strong> {visit.doctorId.name}
              <br />
              <strong>Recommendations:</strong> {visit.recommendations || 'None'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Visit Examples

### Create Visit Component

```jsx
import { useState, useEffect } from 'react';
import { createVisit, getAllPatients } from '../services/apiClient';
import { useNavigate } from 'react-router-dom';

function CreateVisit() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    eyeExam: {
      visualAcuity: { OD: '', OS: '' },
      oldGlasses: {
        OD: { sphere: '', cylinder: '', axis: '' },
        OS: { sphere: '', cylinder: '', axis: '' },
      },
      refraction: {
        OD: { sphere: '', cylinder: '', axis: '' },
        OS: { sphere: '', cylinder: '', axis: '' },
      },
      // ... other eye exam fields
    },
    recommendations: '',
    followUpDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load patients for dropdown
    getAllPatients()
      .then(setPatients)
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEyeExamChange = (path, value) => {
    const keys = path.split('.');
    setFormData({
      ...formData,
      eyeExam: {
        ...formData.eyeExam,
        [keys[0]]: {
          ...formData.eyeExam[keys[0]],
          [keys[1]]: value,
        },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const visit = await createVisit({
        ...formData,
        followUpDate: formData.followUpDate || undefined,
      });
      navigate(`/visits/${visit._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create visit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        name="patientId"
        value={formData.patientId}
        onChange={handleChange}
        required
      >
        <option value="">Select Patient</option>
        {patients.map((patient) => (
          <option key={patient._id} value={patient._id}>
            {patient.code} - {patient.name}
          </option>
        ))}
      </select>

      <h3>Visual Acuity</h3>
      <input
        placeholder="OD"
        value={formData.eyeExam.visualAcuity.OD}
        onChange={(e) => handleEyeExamChange('visualAcuity.OD', e.target.value)}
      />
      <input
        placeholder="OS"
        value={formData.eyeExam.visualAcuity.OS}
        onChange={(e) => handleEyeExamChange('visualAcuity.OS', e.target.value)}
      />

      <h3>Old Glasses - OD</h3>
      <input
        placeholder="Sphere"
        value={formData.eyeExam.oldGlasses.OD.sphere}
        onChange={(e) => handleEyeExamChange('oldGlasses.OD.sphere', e.target.value)}
      />
      <input
        placeholder="Cylinder"
        value={formData.eyeExam.oldGlasses.OD.cylinder}
        onChange={(e) => handleEyeExamChange('oldGlasses.OD.cylinder', e.target.value)}
      />
      <input
        placeholder="Axis"
        value={formData.eyeExam.oldGlasses.OD.axis}
        onChange={(e) => handleEyeExamChange('oldGlasses.OD.axis', e.target.value)}
      />

      {/* Add more eye exam fields as needed */}

      <textarea
        name="recommendations"
        value={formData.recommendations}
        onChange={handleChange}
        placeholder="Recommendations"
      />

      <input
        type="date"
        name="followUpDate"
        value={formData.followUpDate}
        onChange={handleChange}
      />

      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Visit'}
      </button>
    </form>
  );
}
```

### Visits List Component

```jsx
import { useEffect, useState } from 'react';
import { getAllVisits } from '../services/apiClient';

function VisitsList() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const data = await getAllVisits();
        setVisits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  if (loading) return <div>Loading visits...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>All Visits</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Recommendations</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit._id}>
              <td>{new Date(visit.visitDate).toLocaleDateString()}</td>
              <td>
                {visit.patientId.code} - {visit.patientId.name}
              </td>
              <td>{visit.doctorId.name}</td>
              <td>{visit.recommendations || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Error Handling Best Practices

### Global Error Handler

```jsx
import { useEffect } from 'react';
import apiClient from '../services/apiClient';

function App() {
  useEffect(() => {
    // Global error handler
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired - handled automatically by apiClient
          console.log('Session expired');
        } else if (error.response?.status === 403) {
          console.log('Insufficient permissions');
          // Show error message to user
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return <div>Your app</div>;
}
```

### Try-Catch with User Feedback

```jsx
const handleAction = async () => {
  try {
    await someApiCall();
    // Show success message
    toast.success('Operation successful');
  } catch (error) {
    // Show error message to user
    toast.error(error.message || 'Operation failed');
  }
};
```

## Using with React Query (Optional)

If you're using React Query for data fetching:

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllPatients, createPatient } from '../services/apiClient';

// Fetch patients
function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: getAllPatients,
  });
}

// Create patient mutation
function useCreatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      // Invalidate and refetch patients list
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

// Usage in component
function PatientsPage() {
  const { data: patients, isLoading, error } = usePatients();
  const createPatientMutation = useCreatePatient();

  const handleCreate = async (patientData) => {
    try {
      await createPatientMutation.mutateAsync(patientData);
      // Success handled by onSuccess
    } catch (error) {
      // Error handled by mutation
    }
  };

  // ... rest of component
}
```

---

For more details, see:
- `API_DOCUMENTATION.md` - Full API reference
- `API_QUICK_REFERENCE.md` - Quick endpoint reference
- `src/services/apiClient.js` - API client implementation
