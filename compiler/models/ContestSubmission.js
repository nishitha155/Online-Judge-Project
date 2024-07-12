const mongoose = require('mongoose');

const ContestSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest.problems',
    required: true
  },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Pending', 'Syntax Error'], // Corrected here
    required: true
  },
  runtime: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ContestSubmission', ContestSubmissionSchema);
