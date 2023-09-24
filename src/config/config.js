const multer = require('multer');
// Define the storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where uploaded files will be stored
        cb(null, 'uploads/'); // You can change 'uploads/' to your desired directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

// Create a multer instance with the specified storage options for handling multiple files
const upload = multer({ storage: storage }); // 'files' is the field name for multiple files

module.exports = upload;
