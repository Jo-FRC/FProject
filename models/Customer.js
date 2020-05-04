const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema= new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'order'
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
  orders: [
    {
      order: {
        type: Schema.Types.ObjectId,
        ref: 'orders'
      },
      model: {
        type: String,
        required: true
      },
      color: {
        type: String
      },
      date: {
        type: Date
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Customer = mongoose.model('customers', CustomerSchema);
