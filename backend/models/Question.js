const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  statement: { type: String, required: true },
  title: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  difficulty: { type: String, required: true },
  tags: [String],
  inputDescription: { type: String, required: true },
  outputDescription: { type: String, required: true },
  constraints: { type: String, required: true },
  language: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

  const Question = mongoose.model('Question', QuestionSchema);
  module.exports = Question;