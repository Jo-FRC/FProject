const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MaglieriaSchema= new Schema({
  modelType: {
    modelType: [
      {
        name: {
          type: String,
          reuired: true
        },
        image: {
          type: String
        },
        description: {
          type: String
        },
        colors: [
          {
            color: {
              type: String
            }
        ]
      }
    ]
  },

});

module.exports = Maglieria = mongoose.model('maglieria', MaglieriaSchema);
