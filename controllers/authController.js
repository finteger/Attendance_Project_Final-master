const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AttendanceManager = require('../models/attendanceManager'); 
const Session = require('../models/session');
const { secretKey } = require('../config');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await AttendanceManager.findOne({ email });

        if (!user) {
            return res.status(401).send('Invalid username or password.');
        }

        // Verify password
        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            return res.status(401).send('Invalid username or password.');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id.toString() }, secretKey, { expiresIn: '5m' });

        // Set token as a cookie
        res.cookie('jwt', token, { maxAge: 5 * 60 * 1000, httpOnly: true });

        // Create and save session
        req.session.userId = user._id.toString();
        req.session.time = Date.now();

        // Check if a session already exists
        let session = await Session.findOne({ session_id: req.session.userId });

        if (!session) {
            // If no session exists, create a new one
            session = new Session({
                session_id: req.session.userId,
                timestamp: req.session.time
            });

            await session.save();
        } else {
            // Optionally update existing session timestamp
            session.timestamp = req.session.time;
            await session.save();
        }

        // Redirect to home page
        res.redirect('/home');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.redirect('/login');
    });
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
