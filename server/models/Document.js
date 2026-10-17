const mongoose = require('mongoose');
const { createModelWrapper } = require('../db');

const docSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: String, rollNo: String, applicationId: String,
  docType: { type: String, required: true },
  fileType: { type: String, default: 'PDF' },
  filePath: String, mimeType: String,
  status: { type: String, enum: ['pending', 'verified', 'flagged', 'reupload'], default: 'pending' },
  reason: String,
  stampHash: String,
  reviewedBy: String, reviewedAt: Date,
}, { timestamps: true });

const MongooseDoc = mongoose.models.Document || mongoose.model('Document', docSchema);
module.exports = createModelWrapper('Document', 'docs', MongooseDoc);
