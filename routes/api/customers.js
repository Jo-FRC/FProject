const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator'); // /check

const User = require('../../models/User');
const Customer = require('../../models/Customer');
const Maglieria = require('../../models/Maglieria');
const Order = require('../../models/Order');

// @route   POST api/customers
// @desc    Create a customer
// @access  Private
router.post('/',
  [ auth,
    [
      check('name', 'Name is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    const { name,
          address,
          cap,
          city,
          email,
          phone } = req.body;

    try {
      let oldCustomer = await Customer.findOne({ email });

      if(oldCustomer) {
      // since for the other err msg we have an array of objs in check we add this one in this "funny" way
      return res
      .status(400)
      .json({ errors: [{ msg: 'User already exists' }] });
    }

      const newCustomer = new Customer({
        name,
        address,
        cap,
        city,
        email,
        phone
      });

      const customer = await newCustomer.save();

      res.json(customer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

});

module.exports = router;
