const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

const {
    signup,
    login,
    update,
    getAllUsers,
    getUser,
    getByEmail,
    getByUserName
} = require('../controllers/usersController');

router.post('/signup',upload.single('image'), signup);
router.post('/login', login);
router.patch('/update',update)
router.get('/',getAllUsers)
router.get('/:userId',getUser)
router.get('/getbyemail/:email',getByEmail)
router.get('/getbyusername/:username',getByUserName)

module.exports = router;
