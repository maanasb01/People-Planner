const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  login: {
    type: Date,
    
  },
  logout: {
    type: Date,
   
  }
});

module.exports= mongoose.model('activitylog', activitySchema);
