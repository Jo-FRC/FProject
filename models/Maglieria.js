const mongoose = require('mongoose');

const MaglieriaSchema= new Schema({
  name: {
    type: String,
    reuired: true
  },
  image: {
    type: String
  },
  city: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  colors: [
    {
      color: {
        type: String
      }
  ]
});

module.exports = Maglieria = mongoose.model('maglieria', MaglieriaSchema);
