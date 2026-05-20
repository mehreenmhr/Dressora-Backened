const { User, Customer, Seller } = require('../models');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { Email: email },
      include: [Customer, Seller]
    });

    if (user && (await user.matchPassword(password))) {
      let firstName = '';
      let lastName = '';
      if (user.UserType === 'customer' && user.Customer) {
        firstName = user.Customer.FirstName;
        lastName = user.Customer.LastName;
      } else if (user.UserType === 'seller' && user.Seller) {
        firstName = user.Seller.StoreName;
      } else if (user.UserType === 'admin') {
        firstName = 'Admin';
      }

      res.json({
        userID: user.UserID,
        email: user.Email,
        userType: user.UserType,
        token: generateToken(user.UserID),
        firstName,
        lastName,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, userType, phoneNumber } = req.body;

  try {
    const userExists = await User.findOne({ where: { Email: email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      Email: email,
      PasswordHash: password,
      UserType: userType || 'customer',
      PhoneNumber: phoneNumber,
      IsActive: true,
    });

    // Create Customer profile if registering as customer
    if (user && (userType === 'customer' || !userType)) {
      await Customer.create({
        UserID: user.UserID,
        FirstName: firstName || email.split('@')[0],
        LastName: lastName || '',
      });
    }

    if (user) {
      const firstNameVal = firstName || email.split('@')[0];
      const lastNameVal = lastName || '';
      res.status(201).json({
        userID: user.UserID,
        email: user.Email,
        userType: user.UserType,
        token: generateToken(user.UserID),
        firstName: firstNameVal,
        lastName: lastNameVal,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: [Customer, Seller] });
    const formattedUsers = users.map(user => {
      let firstName = '';
      let lastName = '';
      if (user.UserType === 'customer' && user.Customer) {
        firstName = user.Customer.FirstName;
        lastName = user.Customer.LastName;
      } else if (user.UserType === 'seller' && user.Seller) {
        firstName = user.Seller.StoreName;
      } else if (user.UserType === 'admin') {
        firstName = 'Admin';
      }
      return {
        _id: user.UserID.toString(),
        userID: user.UserID,
        email: user.Email,
        phoneNumber: user.PhoneNumber,
        userType: user.UserType,
        isActive: user.IsActive,
        createdAt: user.DateRegistered,
        firstName,
        lastName,
      };
    });
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Toggle/Update user active status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ IsActive: isActive });
    res.json({ success: true, message: `User status updated to ${isActive ? 'active' : 'inactive'}` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  authUser,
  registerUser,
  getUsers,
  updateUserStatus,
};
