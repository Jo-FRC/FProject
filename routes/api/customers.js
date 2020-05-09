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

// @route   GET api/customers
// @desc    Get all customers
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    console.log(customers[0].name);
    console.log(customers[0].orders);
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// @route   GET api/customer
// @desc    Get a customer by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if(!customer) {
      return res.status(404).json({ msg: 'Customer not found' })
    }
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    if(err.name == 'CastError') {
      return res.status(400).json({ msg: 'Customer not found' });
    }
    res.status(500).send('Server Error')
  }
});

// @route   PUT api/customer
// @desc    Modify customer data
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Post.findById(req.params.id);

     // Check if the post has already been liked by a user
     if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
       return res.status(400).json({ msg: 'Post already liked' });
     }

     post.likes.unshift({ user: req.user.id });

     await post.save();

     res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/customer
// @desc    Remove customer
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if(!customer) {
      return res.status(404).json({ msg: 'Customer not found' })
    }

    await customer.remove();

    res.json({msg: 'Customer removed'});
  } catch (err) {
    console.error(err.message);
    if(err.name == 'CastError') {
      return res.status(400).json({ msg: 'Customer not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
