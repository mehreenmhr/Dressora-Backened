const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    PasswordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    UserType: {
      type: DataTypes.ENUM('customer', 'seller', 'admin'),
      defaultValue: 'customer',
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    DateRegistered: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
    tableName: 'User',
  });

  // Method to compare passwords
  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.PasswordHash);
  };

  // Hash password before saving
  User.beforeCreate(async (user) => {
    if (user.PasswordHash && !user.PasswordHash.startsWith('$2a$') && !user.PasswordHash.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      user.PasswordHash = await bcrypt.hash(user.PasswordHash, salt);
    }
  });

  // Hash password before updating
  User.beforeUpdate(async (user) => {
    if (user.changed('PasswordHash')) {
      if (user.PasswordHash && !user.PasswordHash.startsWith('$2a$') && !user.PasswordHash.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        user.PasswordHash = await bcrypt.hash(user.PasswordHash, salt);
      }
    }
  });

  return User;
};

