import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Navbar from "./components/layout/Navbar/Navbar";

// Pages
import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/Dashboard";

// Features - Patients
import PatientsPage from "./features/patients/PatientsList";
import PatientDetails from "./features/patients/PatientDetails";
import PatientEdit from "./features/patients/EditPatient";
import PatientCreate from "./features/patients/CreatePatient";

// Features - Visits
import VisitsPage from "./features/visits/VisitsList";
import VisitDetails from "./features/visits/VisitDetails";
import VisitEdit from "./features/visits/EditVisit";
import VisitCreate from "./features/visits/CreateVisit";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Navbar />
        <main className="app-main">
          <Routes>
        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <PatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/create"
          element={
            <ProtectedRoute>
              <PatientCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute>
              <PatientDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/edit/:id"
          element={
            <ProtectedRoute>
              <PatientEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visits"
          element={
            <ProtectedRoute>
              <VisitsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visits/create"
          element={
            <ProtectedRoute>
              <VisitCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visits/edit/:id"
          element={
            <ProtectedRoute>
              <VisitEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visits/:id"
          element={
            <ProtectedRoute>
              <VisitDetails />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown paths to login */}
        <Route path="*" element={<LoginPage />} />
        </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
