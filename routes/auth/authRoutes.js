const router = require('express').Router();
const {
    registerController, 
    loginController
} = require('../../controllers/auth/authControllers');
const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/profile-img');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

router.post('/register', upload.single('image'), registerController);
router.post('/login', loginController);

module.exports = router;