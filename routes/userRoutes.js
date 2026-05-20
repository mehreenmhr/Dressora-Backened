const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUsers, updateUserStatus } = require('../controllers/userController');

router.route('/').post(registerUser).get(getUsers);
router.post('/login', authUser);
router.put('/:id/status', updateUserStatus);

module.exports = router;
