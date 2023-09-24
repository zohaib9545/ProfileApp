const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number, // Changed type to String
        required: true
    },
    matriculationMarks: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: Number
    }
    // Add more fields as needed
});

const Profile = mongoose.model("Profile", profileSchema);

// Creating a Schema for uploaded files
const fileSchema = new mongoose.Schema({
    originalName: String, // Store the original name of the uploaded file
    filename: String, // Store the name of the saved file
    size: Number, // Store the size of the file
    destination: String, // Store the destination directory of the file
  });

const File = mongoose.model("File", fileSchema);

module.exports = {
    Profile,
    File
};
