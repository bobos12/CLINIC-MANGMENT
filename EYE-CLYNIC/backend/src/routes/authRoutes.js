const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// Wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Public routes
router.post('/login', asyncHandler(login));

// Protected routes
router.use(protect); // All routes below require authentication

router.get('/me', asyncHandler(getMe));
router.post('/register', authorize('admin'), asyncHandler(register));

module.exports = router;