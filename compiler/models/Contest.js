
const mongoose=require('mongoose');

const contestSchema = new mongoose.Schema({
  contestName: String,
  startTime: Date,
  duration: Number,
  rules: String,
  participants: { type: Number, default: 0 },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  problems: [{
    title: String,
    statement: String,
    code: String,
    difficulty: String,
    language: String,
    tags: [String],
    inputDescription: String,
    outputDescription: String,
    constraints: String,
    points: Number,
    testCases: [{
      input: String,
      output: String,
      isSample: Boolean
    }]
  }]
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;