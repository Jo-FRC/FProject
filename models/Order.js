const mongoose = require('mongoose');

const OrderSchema= new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customers'
  },
  ordernumber: {
    type: String
  },
  text: {
    type: String
  },
  name: {
    type: String,
    reuired: true
  },
  address: {
    type: String
  },
  cap: {
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
  model: [
    {
      maglieria: {
        type: Schema.Types.ObjectId,
        ref: 'maglieria'
      },
      model: {
        type: String,
        required: true
      },
      color: {
        type: String
      }
    }
  ],
  delivered: {
    type: Boolean
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Order = mongoose.model('orders', OrderSchema);
