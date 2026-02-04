import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // ✅ ALWAYS run hooks first
    useEffect(() => {
      setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
      const handleResize = () => {
        if (window.matchMedia("(min-width: 769px)").matches) {
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ CONDITIONAL RETURN AFTER hooks
    if (!user || location.pathname === "/login") {
      return null;
    }

    const handleLogout = () => {
      logout();
      navigate("/login");
    };

    const handleNavigation = (path) => {
      navigate(path);
      setAdminMenuOpen(false);
      setMobileMenuOpen(false);
    };

    const isActive = (path) => {
      if (path === "/dashboard") {
        return location.pathname === "/dashboard";
      }
      return location.pathname.includes(path);
    };
    
  return (
    <>
      {/* Mobile top bar: hamburger + logo (visible only on small screens) */}
      <header className="mobile-topbar" aria-label="Mobile navigation">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div
          className="mobile-topbar-logo"
          onClick={() => handleNavigation("/dashboard")}
          onKeyDown={(e) => e.key === "Enter" && handleNavigation("/dashboard")}
          role="button"
          tabIndex={0}
          aria-label="Eye Clinic home"
        >
          <span className="mobile-logo-text">Eye Clinic</span>
        </div>
        <div className="mobile-topbar-user" aria-hidden="true">
          <span className="mobile-user-avatar">{user.name.charAt(0).toUpperCase()}</span>
        </div>
      </header>

      {/* Overlay: closes drawer when tapping outside (mobile). Focusable only when open to avoid aria-hidden/focus conflict. */}
      <div
        className={`sidebar-overlay ${mobileMenuOpen ? "sidebar-overlay--open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setMobileMenuOpen(false)}
        role="button"
        tabIndex={mobileMenuOpen ? -1 : undefined}
        aria-label="Close menu"
      />

      <aside className={`sidebar ${mobileMenuOpen ? "sidebar--open" : ""}`} aria-label="Main navigation">
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {/* Logo */}
      <div 
        className="sidebar-logo"
        onClick={() => handleNavigation("/dashboard")}
      >
        <div className="logo-icon-wrapper">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <span className="logo-text">Eye Clinic</span>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <button
          className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
          onClick={() => handleNavigation("/dashboard")}
          title="Dashboard"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="nav-text">Dashboard</span>
        </button>

        <button
          className={`nav-link ${isActive("/patients") ? "active" : ""}`}
          onClick={() => handleNavigation("/patients")}
          title="Patients"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="nav-text">Patients</span>
        </button>

        <button
          className={`nav-link ${isActive("/visits") ? "active" : ""}`}
          onClick={() => handleNavigation("/visits")}
          title="Visits"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="nav-text">Visits</span>
        </button>

        {user.role === "admin" && (
          <div className="admin-section">
            <button
              className={`nav-link ${adminMenuOpen ? "active" : ""}`}
              onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              title="Admin"
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="nav-text">Admin</span>
              <svg className={`dropdown-arrow ${adminMenuOpen ? 'open' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {adminMenuOpen && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => handleNavigation("/users")}
                >
                  <svg className="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  Manage Users
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleNavigation("/reports")}
                >
                  <svg className="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Reports
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar">
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <svg className="logout-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Navbar;