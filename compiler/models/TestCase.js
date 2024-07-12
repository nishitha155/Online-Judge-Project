const mongoose = require('mongoose');

// Add this schema
const TestCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isSample: { type: Boolean, default: false },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }
});

const TestCase = mongoose.model('TestCase', TestCaseSchema);
module.exports = TestCase;