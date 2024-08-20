const AttendanceManager = require('../models/attendanceManager'); // Model for user management
const StudentRecord = require('../models/studentRecord'); // Model for student attendance records
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js');
const { API_KEY, DOMAIN } = require('../config');
const { sendEmail } = require('../utils/email.js');

exports.getHome = async (req, res) => {
    try {
        const students = await StudentRecord.find({});
        
        // Sort students alphabetically by name
        students.sort((a, b) => a.name.localeCompare(b.name));

        const maxAttendanceCount = Math.max(...students.map(r => r.attendanceCount));
        res.render('attendance.ejs', { students, maxAttendanceCount, sendEmail });
    } catch (error) {
        console.error('Error fetching student records:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAllRecords = async (req, res) => {
    try {
        const records = await StudentRecord.find().exec();
        res.json(records);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching records.' });
    }
};

exports.addStudent = async (req, res) => {
    try {
        const student = new StudentRecord({ name: req.body.name, email: req.body.email });
        await student.save();
        res.redirect('/home');
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteStudent = async (req, res) => {
    const studentName = req.body.name;
    try {
        const result = await StudentRecord.deleteOne({ name: studentName });
        if (result.deletedCount === 0) {
            res.status(404).send('Student not found');
        } else {
            res.redirect('/home');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('An error occurred while deleting the student.');
    }
};

exports.updateStudent = async (req, res) => {
    const { attendanceDate } = req.body;
    const length = req.body.attendance ? req.body.attendance.length : 0;

    try {
        for (let i = 0; i < length; i++) {
            const studentId = req.body.attendance[i];
            await StudentRecord.findByIdAndUpdate(
                studentId,
                {
                    $inc: { attendanceCount: 1 },
                    $push: { attendance: { date: new Date(attendanceDate), status: 'present' } },
                },
                { new: true }
            );
        }
        res.redirect('/home');
    } catch (error) {
        console.error('Error updating student records:', error);
        res.status(500).send('An error occurred while updating student records.');
    }
};


exports.resetAttendance = async (req, res) => {
    try {
        const students = await StudentRecord.find({});
        for (let student of students) {
            student.attendanceCount = 0;
            await student.save();
        }
        res.redirect('/home');
    } catch (error) {
        console.error('Error resetting attendance:', error);
        res.status(500).send('An error occurred while resetting attendance.');
    }
};

exports.register = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    try {
        const existingUser = await AttendanceManager.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Username already exists. Please try again.');
        }

        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new AttendanceManager({ email, password: hashedPassword });
        await newUser.save();

        res.redirect('/login');
    } catch (err) {
        console.error('Error while registering user:', err);
        res.status(500).send('Internal server error');
    }
};

exports.deleteAllRecords = async (req, res) => {
    try {
        await StudentRecord.deleteMany({});
        res.redirect('/home'); // Redirect or send a response indicating success
    } catch (error) {
        console.error('Error deleting all student records:', error);
        res.status(500).send('An error occurred while deleting all student records.');
    }
};
