const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    fullName: { type: String, required: true },
    socialLogin: {
        google: { type: String },
        github: { type: String },
        linkedIn: { type: String }
    },
    discussionPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    streak: { type: Number, default: 0 },
    lastSubmissionDate: { type: Date }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
