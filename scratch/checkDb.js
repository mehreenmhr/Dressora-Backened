const { sequelize, User, Customer, Address } = require('../models');

async function check() {
  try {
    await sequelize.authenticate();
    console.log('DB Connected');
    
    const users = await User.findAll({ raw: true });
    console.log('\n--- USERS ---');
    console.table(users);
    
    const customers = await Customer.findAll({ raw: true });
    console.log('\n--- CUSTOMERS ---');
    console.table(customers);
    
    const addresses = await Address.findAll({ raw: true });
    console.log('\n--- ADDRESSES ---');
    console.table(addresses);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
