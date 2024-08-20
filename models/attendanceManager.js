const mongoose = require('mongoose');

// Define the schema for an Attendance Manager
const attendanceManagerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'attendance-manager',
        enum: ['attendance-manager', 'admin'], // Example roles
    },
    // Add additional fields as needed
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the model from the schema
const AttendanceManager = mongoose.model('AttendanceManager', attendanceManagerSchema);

module.exports = AttendanceManager;