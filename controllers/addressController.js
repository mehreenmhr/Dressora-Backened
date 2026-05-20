const { Address } = require('../models');

// Get all addresses for a customer
exports.getCustomerAddresses = async (req, res) => {
  try {
    const { customerId } = req.params;
    const addresses = await Address.findAll({
      where: { CustomerID: customerId },
    });
    
    // Map database fields to frontend casing (camelCase)
    const formatted = addresses.map(addr => ({
      addressID: addr.AddressID,
      customerID: addr.CustomerID,
      street: addr.Street,
      city: addr.City,
      state: addr.State,
      postalCode: addr.PostalCode,
      country: addr.Country,
      addressType: addr.AddressType,
      isDefault: addr.IsDefault,
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Server error fetching addresses' });
  }
};

// Add a new address for a customer
exports.addAddress = async (req, res) => {
  try {
    const { customerID, street, city, state, postalCode, country, addressType, isDefault } = req.body;
    
    if (!customerID || !street || !city || !postalCode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // If isDefault is true, set other addresses of this customer to not default
    if (isDefault) {
      await Address.update(
        { IsDefault: false },
        { where: { CustomerID: customerID } }
      );
    }

    const newAddr = await Address.create({
      CustomerID: customerID,
      Street: street,
      City: city,
      State: state,
      PostalCode: postalCode,
      Country: country || 'Pakistan',
      AddressType: addressType || 'both',
      IsDefault: isDefault || false,
    });

    res.status(201).json({
      addressID: newAddr.AddressID,
      customerID: newAddr.CustomerID,
      street: newAddr.Street,
      city: newAddr.City,
      state: newAddr.State,
      postalCode: newAddr.PostalCode,
      country: newAddr.Country,
      addressType: newAddr.AddressType,
      isDefault: newAddr.IsDefault,
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Server error adding address' });
  }
};
