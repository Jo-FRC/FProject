const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema= new Schema({
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
      ordernumber: {
        type: String
      },
      text: {
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
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Customer = mongoose.model('customers', CustomerSchema);
