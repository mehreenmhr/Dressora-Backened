const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUsers } = require('../controllers/userController');

router.route('/').post(registerUser).get(getUsers);
router.post('/login', authUser);

module.exports = router;
