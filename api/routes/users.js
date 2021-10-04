const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    update,
} = require('../controllers/usersController');

router.post('/signup', signup);
router.post('/login', login);
router.patch('/update',update)

module.exports = router;
