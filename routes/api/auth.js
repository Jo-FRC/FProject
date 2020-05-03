const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator'); // /check

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch(err) {
    console.error(err.message);
    res.staus(500).send('Server Error');
  }
});

// @route   Post api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/',
// check function by express validator, gives an error message if name input is empty
[
  check('email', 'Please include a valid email').isEmail(),
  check('password','Password is required').exists()
],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  const { email, password } = req.body;

  try {
    // since we destructured email from req.body we don't have to do email: email (same name just use once)
    let user = await User.findOne({ email });

    if(!user) {
      // since for the other err msg we have an array of objs in check we add this one in this "funny" way
      return res
      .status(400)
      .json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res
      .status(400)
      .json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 36000000},
      (err, token) => {
        if(err) throw err;
        res.json({ token });
      });
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }

});


module.exports = router;
