const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator'); // /check

const User = require('../../models/User');

// @route   Post api/users
// @desc    Register user
// @access  Public
router.post('/',
// check function by express validator, gives an error message if name input is empty
[
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters')
    .isLength({min: 6})
],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  const { name, email, password } = req.body;

  try {
    // since we destructured email from req.body we don't have to do email: email (same name just use once)
    let user = await User.findOne({ email });

    if(user) {
      // since for the other err msg we have an array of objs in check we add this one in this "funny" way
      return res
      .status(400)
      .json({ errors: [{ msg: 'User already exists' }] });
    }


    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000000},
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
