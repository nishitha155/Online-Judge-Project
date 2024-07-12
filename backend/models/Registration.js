const mongoose = require('mongoose');
const registrationSchema = new mongoose.Schema({
    userId: String,
    contestId: String,
    registrationDate: { type: Date, default: Date.now },
    points: { type: Number, default: 0 },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
    
    rank: { type: Number, default: null }
  
  });
  
  const Registration = mongoose.model('Registration', registrationSchema);
  module.exports = Registration;