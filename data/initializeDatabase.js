const fs = require('fs');
const mongoose = require('mongoose');
const Student = require('../models/studentRecord'); // Adjust the path to your Student model

// Load student data from JSON file
async function loadStudentData() {
    return new Promise((resolve, reject) => {
        fs.readFile('students.json', 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

// Initialize the database
async function initializeDatabase() {
    try {
        const students = await loadStudentData();

        for (const student of students) {
            // Check if the student already exists in the database
            const existingStudent = await Student.findOne({ email: student.email });

            if (!existingStudent) {
                // Insert the student if it doesn't exist
                await Student.create(student);
                console.log(`Student with email ${student.email} has been inserted.`);
            } else {
                console.log(`Student with email ${student.email} already exists.`);
            }
        }

        console.log('Database initialization complete');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

module.exports = initializeDatabase;
