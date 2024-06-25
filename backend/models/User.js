const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
        password: { type: String },
        email: { type: String, required: true, unique: true,validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    } },
       
        fullName: { type: String  },
        userName: { type: String,unique: true,validate: {
      validator: function(v) {
        return /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v);
      },
      message: props => `${props.value} is not a valid username! It must be at least 8 characters with one capital letter and one digit.`
    } },
    verified:{
        type:Boolean,
        required:true,
        default:false
    },
       
    streak: { type: Number, default: 0 },
    lastSubmissionDate: { type: Date },
    joined: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
