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

      // const order = {
      //   ordernumber:  req.body.ordernumber,
      //   text:  req.body.text,
      //   model: req.body.model
      // };
      const newOrder = new Order({
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
      });

      // customer.orders.unshift(order);
      //
      // await customer.save();
      const orders = await newOrder.save();
      res.json(orders);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

});

// @route   GET api/orders
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

// @route   DELETE api/orders/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if(!order) {
      return res.status(404).json({ msg: 'Order not found' })
    }

    await order.remove();

    res.json({msg: 'Order removed'});
  } catch (err) {
    console.error(err.message);
    if(err.name == 'CastError') {
      return res.status(400).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/:id
// @desc    Update order
// @access  Private
// auth and check are the middleware in this case
router.put('/:id', [ auth
],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  // destructuring req.body
  const {
      ordernumber,
      text,
      model,
      color
  } = req.body;

  // Build profile object
  const orderFields = {};
  // We have a reference to the order req.order.id
  orderFields.order = req.params.id;
  if(ordernumber) orderFields.ordernumber = ordernumber;
  if(text) orderFields.text = text;



  orderFields.model = {};
  // if we don't add that model is an obj it will return an error saying cannot find youtube of undefined
  if(model) orderFields.model.model = model;
  if(color) orderFields.model.color = color;


  try {
    let order = await Order.findById(req.params.id);
    if(order) {
      // Update

      order = await Order.findOneAndUpdate(
        req.params.id,
        { $set: orderFields},
        { new: true }
      );

      return res.json(order);
    }


    await order.save();
    res.json(order);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
