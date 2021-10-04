const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    update,
    getAllUsers,
    getUser
} = require('../controllers/usersController');

router.post('/signup', signup);
router.post('/login', login);
router.patch('/update',update)
router.get('/',getAllUsers)
router.get('/:userId',getUser)

module.exports = router;
