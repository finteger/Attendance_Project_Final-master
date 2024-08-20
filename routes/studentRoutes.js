const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { apiLimiter } = require('../middlewares/rateLimiterMiddleware');

// Home route
router.get('/home', authenticateToken, studentController.getHome);

// Student management routes
router.get('/api/records', apiLimiter, studentController.getAllRecords);
router.post('/api/addstudent', apiLimiter, studentController.addStudent);
router.post('/addstudent', authenticateToken, studentController.addStudent);
router.post('/deletestudent', authenticateToken, studentController.deleteStudent);
router.post('/updatestudent', authenticateToken, studentController.updateStudent);
router.post('/reset', authenticateToken, studentController.resetAttendance);
router.post('/delete', authenticateToken, studentController.deleteAllRecords);


module.exports = router;
