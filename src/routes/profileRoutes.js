const express = require('express');
const router = express.Router();
const upload = require("../config/config");

const { createProfile } = require('../controllers/profileController');
const { login } = require('../controllers/profileController');
const { deleteProfile } = require('../controllers/profileController');
const { readData } = require('../controllers/profileController');
const { changePassword  } = require('../controllers/profileController');
const { forgetPassword} = require('../controllers/profileController');
const { singleUploadFile  } = require('../controllers/profileController');
const { multipleUploadFile} = require('../controllers/profileController');


router.post("/profile", createProfile);
router.post("/login", login);
router.delete("/delete",deleteProfile)
router.get('/read',readData)
router.post("/changepassword",changePassword );
router.post("/forget",forgetPassword);
// for multiple
router.post("/singleupload",upload.single('file'), singleUploadFile);
 // for single
router.post("/multipleupload",upload.array('files', 5), multipleUploadFile);

module.exports = router;

