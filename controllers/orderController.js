const { Orders, OrderItem, Product, Payment, Shipping, Address, Customer, User } = require('../models');

// Place/Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      customerId,
      items,
      totalAmount,
      discountAmount,
      taxAmount,
      finalAmount,
      shippingAddressId,
      billingAddressId,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing customerId or items' });
    }

    console.log('📦 Creating order for customer:', customerId);
    console.log('📦 Order items:', items);

    // 1. Create Order (addresses can be NULL)
    const order = await Orders.create({
      CustomerID: customerId,
      TotalAmount: totalAmount || 0,
      DiscountAmount: discountAmount || 0,
      TaxAmount: taxAmount || 0,
      FinalAmount: finalAmount || 0,
      OrderStatus: 'pending',
      ShippingAddressID: shippingAddressId || null,
      BillingAddressID: billingAddressId || null,
    });

    console.log('✅ Order created with ID:', order.OrderID);

    // 2. Create Order Items
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await OrderItem.create({
          OrderID: order.OrderID,
          ProductID: item.productID,
          Quantity: item.quantity,
          UnitPrice: item.priceAtTime,
          Subtotal: item.priceAtTime * item.quantity,
        });

        // Deduct product stock quantity if available
        const product = await Product.findByPk(item.productID);
        if (product) {
          const newStock = Math.max(0, product.StockQuantity - item.quantity);
          await product.update({ StockQuantity: newStock });
          console.log(`📉 Updated stock for product ${item.productID} to ${newStock}`);
        }
      }
    }

    // 3. Create Payment record
    const isCod = paymentMethod === 'cod';
    await Payment.create({
      OrderID: order.OrderID,
      PaymentMethod: paymentMethod || 'online',
      PaymentStatus: isCod ? 'pending' : 'completed',
      AmountPaid: isCod ? 0 : (finalAmount || 0),
      TransactionID: isCod ? null : `TXN-${Date.now()}`,
      PaymentDate: isCod ? null : new Date(),
    });

    console.log('✅ Payment record created');

    // 4. Create Shipping record
    await Shipping.create({
      OrderID: order.OrderID,
      TrackingNumber: null,
      Carrier: 'Pending',
      ShippingStatus: 'processing',
      EstimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    });

    console.log('✅ Shipping record created');

    res.status(201).json({
      success: true,
      orderID: order.OrderID,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Server error creating order: ' + error.message });
  }
};

// Fetch orders for a specific customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    const dbOrders = await Orders.findAll({
      where: { CustomerID: customerId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['ProductName', 'Image', 'BasePrice'] }],
        },
      ],
      order: [['OrderID', 'DESC']],
    });

    const formatted = dbOrders.map(o => ({
      orderID: o.OrderID,
      customerID: o.CustomerID,
      orderDate: o.OrderDate,
      totalAmount: Number(o.TotalAmount),
      discountAmount: Number(o.DiscountAmount),
      taxAmount: Number(o.TaxAmount),
      finalAmount: Number(o.FinalAmount),
      orderStatus: o.OrderStatus,
      orderItems: o.OrderItems.map(item => ({
        orderItemID: item.OrderItemID,
        productID: item.ProductID,
        quantity: item.Quantity,
        unitPrice: Number(item.UnitPrice),
        subtotal: Number(item.Subtotal),
        productName: item.Product?.ProductName || 'Product Deleted',
        image: item.Product?.Image || null,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ message: 'Server error fetching customer orders' });
  }
};

// Fetch order items containing products from a specific seller
exports.getSellerOrderItems = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const dbOrderItems = await OrderItem.findAll({
      include: [
        {
          model: Product,
          where: { SellerID: sellerId },
          attributes: ['ProductName', 'Image'],
        },
        {
          model: Orders,
          attributes: ['OrderDate', 'OrderStatus'],
        },
      ],
      order: [['OrderItemID', 'DESC']],
    });

    const formatted = dbOrderItems.map(oi => ({
      orderItemID: oi.OrderItemID,
      orderID: oi.OrderID,
      productID: oi.ProductID,
      quantity: oi.Quantity,
      unitPrice: Number(oi.UnitPrice),
      subtotal: Number(oi.Subtotal),
      orderDate: oi.Order?.OrderDate || new Date(),
      orderStatus: oi.Order?.OrderStatus || 'pending',
      productName: oi.Product?.ProductName || 'Product Deleted',
      image: oi.Product?.Image || null,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching seller order items:', error);
    res.status(500).json({ message: 'Server error fetching seller order items' });
  }
};

// Update order status (for seller or admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Orders.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ OrderStatus: status });

    if (status === 'cancelled') {
      const oItems = await OrderItem.findAll({ where: { OrderID: orderId } });
      for (const item of oItems) {
        const prod = await Product.findByPk(item.ProductID);
        if (prod) {
          await prod.update({ StockQuantity: prod.StockQuantity + item.Quantity });
        }
      }
    }

    // Update Shipping record if it exists
    const shipping = await Shipping.findOne({ where: { OrderID: orderId } });
    if (shipping) {
      let shippingStatus = 'processing';
      if (status === 'shipped') shippingStatus = 'in_transit';
      if (status === 'delivered') shippingStatus = 'delivered';
      if (status === 'cancelled') shippingStatus = 'returned';
      
      await shipping.update({
        ShippingStatus: shippingStatus,
        ActualDelivery: status === 'delivered' ? new Date() : null,
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};

// Fetch all orders for admin
exports.getAllOrders = async (req, res) => {
  try {
    const dbOrders = await Orders.findAll({
      include: [
        {
          model: Customer,
          attributes: ['FirstName', 'LastName'],
          include: [
            {
              model: User,
              attributes: ['Email'],
            }
          ]
        }
      ],
      order: [['OrderID', 'DESC']],
    });

    const formatted = dbOrders.map(o => ({
      orderID: o.OrderID,
      customerID: o.CustomerID,
      customerName: o.Customer ? `${o.Customer.FirstName || ''} ${o.Customer.LastName || ''}`.trim() || o.Customer.User?.Email || `Customer #${o.CustomerID}` : `Customer #${o.CustomerID}`,
      orderDate: o.OrderDate,
      totalAmount: Number(o.TotalAmount),
      discountAmount: Number(o.DiscountAmount),
      taxAmount: Number(o.TaxAmount),
      finalAmount: Number(o.FinalAmount),
      orderStatus: o.OrderStatus,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};


