// Authorize middleware - checks if user has required role
const authorize = (...roles) => {
  console.log('authorize called with roles:', roles);
  return (req, res, next) => {
    console.log('authorize middleware - req.user:', req.user ? `${req.user.email} (${req.user.role})` : 'undefined');
    console.log('authorize middleware - required roles:', roles);
    console.log('authorize middleware - next type:', typeof next);
    
    // User must be authenticated (protect middleware runs first)
    if (!req.user) {
      return res.status(401).json({ 
        message: 'User not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role '${req.user.role}' is not authorized for this operation`,
        requiredRoles: roles,
        userRole: req.user.role
      });
    }
    next();
  };
};

module.exports = { authorize };