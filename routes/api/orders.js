const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator'); // /check

const User = require('../../models/User');
const Order = require('../../models/Order');
const Customer = require('../../models/Customer');

// @route   POST api/orders
// @desc    Create an order
// @access  Private
router.post('/',
  [ auth,
    [
      check('ordernumber', 'Order number is required').not().isEmpty(),
      check('name', 'Name is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }

    const customer = await Customer.findOne({ "name" : req.body.name});
    try {
      
      const newOrder = {
        ordernumber:  req.body.ordernumber,
        text:  req.body.text,
        name: customer.name,
        address: customer.address,
        cap: customer.cap,
        city: customer.city,
        email: customer.email,
        phone: customer.phone,
        model: req.body.model,
        delivered: false
      };

      customer.orders.unshift(newOrder);

      await customer.save();
      res.json(customer.orders);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

module.exports = router;
