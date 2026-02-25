const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Create request (Patients only)
router.post('/', authMiddleware, requireRole(['Patient']), requestController.createRequest);

// Get my requests (Patients)
router.get('/my-requests', authMiddleware, requireRole(['Patient']), requestController.getMyRequests);

// Get matching requests (Donors)
router.get('/matching', authMiddleware, requireRole(['Donor']), requestController.getMatchingRequests);

// Accept a request (Donors)
router.post('/:id/accept', authMiddleware, requireRole(['Donor']), requestController.acceptRequest);

module.exports = router;
