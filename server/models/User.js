const mongoose = require('mongoose');
const { createModelWrapper } = require('../db');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobile: String,
  rollNo: String,
  stream: { type: String, enum: ['BCA', 'BSc', 'BBA', 'BTech', 'MCA'], default: 'BCA' },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  applicationId: String,
  address: String,
  emergencyContact: String,
  passingYear: String,
}, { timestamps: true });

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = createModelWrapper('User', 'users', MongooseUser);
