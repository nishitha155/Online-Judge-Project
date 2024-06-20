const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   
        password: { type: String, required: true, minlength: 6 },
        email: { type: String, required: true, unique: true,validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    } },
        phoneNumber: { type: String, required: true ,unique:true,validate:{
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid Indian phone number!`
    } },
        fullName: { type: String, required: true },
        userName: { type: String, required: true,unique: true,validate: {
      validator: function(v) {
        return /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v);
      },
      message: props => `${props.value} is not a valid username! It must be at least 8 characters with one capital letter and one digit.`
    } },
       
    streak: { type: Number, default: 0 },
    lastSubmissionDate: { type: Date }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
