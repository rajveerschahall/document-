const mongoose = require('mongoose');
const { createModelWrapper } = require('../db');

const auditSchema = new mongoose.Schema({
  doc: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  summary: String, adminId: String, verdict: String,
}, { timestamps: true });

const MongooseAudit = mongoose.models.Audit || mongoose.model('Audit', auditSchema);
module.exports = createModelWrapper('Audit', 'audits', MongooseAudit);
