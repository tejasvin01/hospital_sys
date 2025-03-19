const express = require('express');
const { getAllUsers } = require('../controllers/allUsersController');
const { protect, roleCheck } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect,roleCheck("admin","doctor","patient","receptionist"), getAllUsers);


module.exports = router;