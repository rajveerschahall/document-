const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, 'data');
const storeFile = path.join(dataDir, 'store.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let isUsingFallback = false;

function loadStore() {
  try {
    if (fs.existsSync(storeFile)) {
      const raw = fs.readFileSync(storeFile, 'utf8');
      const data = JSON.parse(raw);
      if (data.users) {
        data.users.forEach(u => {
          if (!u.role) u.role = 'student';
          if (!u.stream) u.stream = 'BCA';
        });
      }
      if (data.docs) {
        data.docs.forEach(d => {
          if (!d.status) d.status = 'pending';
          if (!d.fileType) d.fileType = 'PDF';
        });
      }
      return data;
    }
  } catch (e) {
    console.error('Error loading store:', e);
  }
  return { users: [], docs: [], audits: [] };
}

let memoryStore = loadStore();

function saveStore() {
  try {
    fs.writeFileSync(storeFile, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving store:', e);
  }
}

function newId() {
  return crypto.randomBytes(12).toString('hex');
}

function matches(item, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, val] of Object.entries(query)) {
    if (val === undefined) continue;
    let itemVal = item[key];
    if (key === 'role' && !itemVal) itemVal = 'student';
    if (key === 'stream' && !itemVal) itemVal = 'BCA';
    if (key === 'status' && !itemVal) itemVal = 'pending';

    if (key === '_id' || key === 'user' || key === 'doc') {
      const sItem = itemVal ? itemVal.toString() : '';
      const sQuery = val ? val.toString() : '';
      if (sItem !== sQuery) return false;
    } else if (typeof val === 'object' && val !== null) {
      if (val.$ne !== undefined && itemVal === val.$ne) return false;
      if (val.$in && Array.isArray(val.$in) && !val.$in.includes(itemVal)) return false;
    } else {
      if (itemVal !== val) return false;
    }
  }
  return true;
}

class Query {
  constructor(itemsPromise, collectionName) {
    this.itemsPromise = Promise.resolve(itemsPromise);
    this.collectionName = collectionName;
    this.sortKey = null;
    this.sortAsc = true;
    this.selectFields = null;
    this.selectExclude = false;
    this.limitCount = null;
    this.populatePath = null;
    this.populateFields = null;
  }

  sort(s) {
    if (typeof s === 'string') {
      if (s.startsWith('-')) {
        this.sortKey = s.substring(1);
        this.sortAsc = false;
      } else {
        this.sortKey = s;
        this.sortAsc = true;
      }
    }
    return this;
  }

  select(fields) {
    if (typeof fields === 'string') {
      const parts = fields.trim().split(/\s+/);
      if (parts[0] && parts[0].startsWith('-')) {
        this.selectExclude = true;
        this.selectFields = parts.map(p => p.startsWith('-') ? p.substring(1) : p);
      } else {
        this.selectExclude = false;
        this.selectFields = parts;
      }
    }
    return this;
  }

  limit(n) {
    this.limitCount = parseInt(n, 10);
    return this;
  }

  populate(path, select) {
    this.populatePath = path;
    this.populateFields = select;
    return this;
  }

  async exec() {
    let items = await this.itemsPromise;
    const isArray = Array.isArray(items);
    let list = isArray ? [...items] : (items ? [items] : []);

    if (this.sortKey) {
      list.sort((a, b) => {
        let va = a[this.sortKey] ?? '';
        let vb = b[this.sortKey] ?? '';
        if (va instanceof Date) va = va.getTime();
        if (vb instanceof Date) vb = vb.getTime();
        if (typeof va === 'string' && (va.includes('T') || !isNaN(Date.parse(va)))) {
          const da = Date.parse(va), db = Date.parse(vb);
          if (!isNaN(da) && !isNaN(db)) { va = da; vb = db; }
        }
        if (va < vb) return this.sortAsc ? -1 : 1;
        if (va > vb) return this.sortAsc ? 1 : -1;
        return 0;
      });
    }

    if (this.limitCount && this.limitCount > 0) {
      list = list.slice(0, this.limitCount);
    }

    if (this.populatePath === 'user') {
      const userMap = new Map((memoryStore.users || []).map(u => [u._id.toString(), u]));
      list = list.map(item => {
        const copy = { ...item };
        if (copy.user) {
          const u = userMap.get(copy.user.toString());
          if (u) {
            let uCopy = { ...u };
            delete uCopy.password;
            copy.user = uCopy;
          }
        }
        return copy;
      });
    }

    if (this.selectFields && this.selectFields.length > 0) {
      list = list.map(item => {
        const copy = { ...item };
        if (this.selectExclude) {
          for (const f of this.selectFields) delete copy[f];
          return copy;
        } else {
          const selected = { _id: copy._id };
          for (const f of this.selectFields) {
            if (copy[f] !== undefined) selected[f] = copy[f];
          }
          return selected;
        }
      });
    }

    const wrapDoc = (raw) => {
      if (!raw) return null;
      const doc = { ...raw };
      doc.save = async function() {
        const coll = memoryStore[this._collection];
        if (coll) {
          const idx = coll.findIndex(x => x._id === this._id);
          this.updatedAt = new Date().toISOString();
          const toSave = { ...this };
          delete toSave.save;
          delete toSave._collection;
          if (idx !== -1) {
            coll[idx] = toSave;
          } else {
            coll.push(toSave);
          }
          saveStore();
        }
        return this;
      };
      doc._collection = this.collectionName;
      return doc;
    };

    if (!isArray) {
      return list[0] ? wrapDoc(list[0]) : null;
    }
    return list.map(wrapDoc);
  }

  then(onFulfilled, onRejected) {
    return this.exec().then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.exec().catch(onRejected);
  }
}

function createModelWrapper(modelName, collectionKey, mongooseModel) {
  return {
    async create(docOrDocs) {
      if (!isUsingFallback) {
        return mongooseModel.create(docOrDocs);
      }
      const isArr = Array.isArray(docOrDocs);
      const items = isArr ? docOrDocs : [docOrDocs];
      const created = [];
      for (const item of items) {
        const now = new Date().toISOString();
        const obj = {
          _id: item._id ? item._id.toString() : newId(),
          ...item,
          createdAt: item.createdAt || now,
          updatedAt: item.updatedAt || now,
        };
        memoryStore[collectionKey].push(obj);
        created.push(obj);
      }
      saveStore();
      const wrap = (o) => {
        const copy = { ...o };
        copy.save = async function() {
          const coll = memoryStore[collectionKey];
          const idx = coll.findIndex(x => x._id === this._id);
          this.updatedAt = new Date().toISOString();
          const toSave = { ...this };
          delete toSave.save;
          if (idx !== -1) coll[idx] = toSave;
          else coll.push(toSave);
          saveStore();
          return this;
        };
        return copy;
      };
      return isArr ? created.map(wrap) : wrap(created[0]);
    },

    find(query = {}) {
      if (!isUsingFallback) {
        return mongooseModel.find(query);
      }
      const matched = (memoryStore[collectionKey] || []).filter(item => matches(item, query));
      return new Query(matched, collectionKey);
    },

    findOne(query = {}) {
      if (!isUsingFallback) {
        return mongooseModel.findOne(query);
      }
      const found = (memoryStore[collectionKey] || []).find(item => matches(item, query));
      return new Query(found || null, collectionKey);
    },

    findById(id) {
      if (!isUsingFallback) {
        return mongooseModel.findById(id);
      }
      const strId = id ? id.toString() : '';
      const found = (memoryStore[collectionKey] || []).find(item => item._id === strId);
      return new Query(found || null, collectionKey);
    },

    async deleteMany(query = {}) {
      if (!isUsingFallback) {
        return mongooseModel.deleteMany(query);
      }
      if (!query || Object.keys(query).length === 0) {
        memoryStore[collectionKey] = [];
      } else {
        memoryStore[collectionKey] = (memoryStore[collectionKey] || []).filter(item => !matches(item, query));
      }
      saveStore();
      return { acknowledged: true, deletedCount: 1 };
    }
  };
}

async function seedInitialData() {
  if (memoryStore.users && memoryStore.users.length > 0) {
    return;
  }
  console.log('🌱 Seeding initial demo data for Admission Verification System...');
  const pwHash = await bcrypt.hash('Student@123', 10);
  const adminHash = await bcrypt.hash('Admin@123', 10);

  const adminId = newId();
  const rahulId = newId();
  const simranId = newId();
  const amitId = newId();
  const priyaId = newId();
  const rohitId = newId();

  const now = new Date();
  const isoAgo = (hours) => new Date(now.getTime() - hours * 3600000).toISOString();

  memoryStore.users = [
    {
      _id: adminId,
      name: 'Admin Officer',
      email: 'admin@campusverify.edu',
      role: 'admin',
      password: adminHash,
      createdAt: isoAgo(48),
      updatedAt: isoAgo(48),
    },
    {
      _id: rahulId,
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      mobile: '9876543210',
      rollNo: '2433580',
      stream: 'BCA',
      applicationId: 'APP-2026-1001',
      role: 'student',
      password: pwHash,
      createdAt: isoAgo(36),
      updatedAt: isoAgo(36),
    },
    {
      _id: simranId,
      name: 'Simran Kaur',
      email: 'simran@example.com',
      mobile: '9812345678',
      rollNo: '2433585',
      stream: 'BCA',
      applicationId: 'APP-2026-1002',
      role: 'student',
      password: pwHash,
      createdAt: isoAgo(30),
      updatedAt: isoAgo(30),
    },
    {
      _id: amitId,
      name: 'Amit Patel',
      email: 'amit@example.com',
      mobile: '9823456789',
      rollNo: '2433590',
      stream: 'BSc',
      applicationId: 'APP-2026-1003',
      role: 'student',
      password: pwHash,
      createdAt: isoAgo(24),
      updatedAt: isoAgo(24),
    },
    {
      _id: priyaId,
      name: 'Priya Verma',
      email: 'priya@example.com',
      mobile: '9834567890',
      rollNo: '2433595',
      stream: 'BBA',
      applicationId: 'APP-2026-1004',
      role: 'student',
      password: pwHash,
      createdAt: isoAgo(18),
      updatedAt: isoAgo(18),
    },
    {
      _id: rohitId,
      name: 'Rohit Kumar',
      email: 'rohit@example.com',
      mobile: '9845678901',
      rollNo: '2433600',
      stream: 'BCA',
      applicationId: 'APP-2026-1005',
      role: 'student',
      password: pwHash,
      createdAt: isoAgo(12),
      updatedAt: isoAgo(12),
    }
  ];

  const rahulHash = crypto.createHash('sha256').update(`rahul-12th-${Date.now()}`).digest('hex');
  const priyaHash = crypto.createHash('sha256').update(`priya-income-${Date.now()}`).digest('hex');

  memoryStore.docs = [
    {
      _id: newId(),
      user: rahulId,
      studentName: 'Rahul Sharma',
      rollNo: '2433580',
      applicationId: 'APP-2026-1001',
      docType: 'Class 12th Marksheet',
      fileType: 'PDF',
      filePath: '',
      mimeType: 'application/pdf',
      status: 'verified',
      stampHash: rahulHash,
      reviewedBy: 'Admin Officer',
      reviewedAt: isoAgo(10),
      createdAt: isoAgo(35),
      updatedAt: isoAgo(10),
    },
    {
      _id: newId(),
      user: rahulId,
      studentName: 'Rahul Sharma',
      rollNo: '2433580',
      applicationId: 'APP-2026-1001',
      docType: 'Transfer Certificate',
      fileType: 'PDF',
      filePath: '',
      mimeType: 'application/pdf',
      status: 'pending',
      createdAt: isoAgo(34),
      updatedAt: isoAgo(34),
    },
    {
      _id: newId(),
      user: simranId,
      studentName: 'Simran Kaur',
      rollNo: '2433585',
      applicationId: 'APP-2026-1002',
      docType: 'Aadhaar / ID Proof',
      fileType: 'Image',
      filePath: '',
      mimeType: 'image/jpeg',
      status: 'flagged',
      reason: 'Name mismatch and altered serial number',
      reviewedBy: 'Admin Officer',
      reviewedAt: isoAgo(8),
      createdAt: isoAgo(29),
      updatedAt: isoAgo(8),
    },
    {
      _id: newId(),
      user: simranId,
      studentName: 'Simran Kaur',
      rollNo: '2433585',
      applicationId: 'APP-2026-1002',
      docType: 'Class 10th Marksheet',
      fileType: 'PDF',
      filePath: '',
      mimeType: 'application/pdf',
      status: 'reupload',
      reason: 'Blurry Image - Roll number and grades not readable',
      reviewedBy: 'Admin Officer',
      reviewedAt: isoAgo(7),
      createdAt: isoAgo(28),
      updatedAt: isoAgo(7),
    },
    {
      _id: newId(),
      user: amitId,
      studentName: 'Amit Patel',
      rollNo: '2433590',
      applicationId: 'APP-2026-1003',
      docType: 'Class 12th Marksheet',
      fileType: 'PDF',
      filePath: '',
      mimeType: 'application/pdf',
      status: 'pending',
      createdAt: isoAgo(23),
      updatedAt: isoAgo(23),
    },
    {
      _id: newId(),
      user: amitId,
      studentName: 'Amit Patel',
      rollNo: '2433590',
      applicationId: 'APP-2026-1003',
      docType: 'Bonafide Certificate',
      fileType: 'PDF',
      filePath: '',
      mimeType: 'application/pdf',
      status: 'pending',
      createdAt: isoAgo(22),
      updatedAt: isoAgo(22),
    },
    {
      _id: newId(),
      user: priyaId,
      studentName: 'Priya Verma',
      rollNo: '2433595',
      applicationId: 'APP-2026-1004',
      docType: 'Income Certificate',
      fileType: 'PDF',
      filePath: '',
      mimeType: 'application/pdf',
      status: 'verified',
      stampHash: priyaHash,
      reviewedBy: 'Admin Officer',
      reviewedAt: isoAgo(5),
      createdAt: isoAgo(17),
      updatedAt: isoAgo(5),
    },
    {
      _id: newId(),
      user: rohitId,
      studentName: 'Rohit Kumar',
      rollNo: '2433600',
      applicationId: 'APP-2026-1005',
      docType: 'Class 10th Marksheet',
      fileType: 'PDF',
      filePath: '',
      mimeType: 'application/pdf',
      status: 'pending',
      createdAt: isoAgo(11),
      updatedAt: isoAgo(11),
    }
  ];

  memoryStore.audits = [
    {
      _id: newId(),
      adminId: 'Admin Officer',
      verdict: 'verified',
      summary: 'Rahul Sharma - Class 12th Marksheet: Marked REAL',
      createdAt: isoAgo(10),
      updatedAt: isoAgo(10),
    },
    {
      _id: newId(),
      adminId: 'Admin Officer',
      verdict: 'flagged',
      summary: 'Simran Kaur - Aadhaar / ID Proof: Flagged FAKE (Name mismatch and altered serial number)',
      createdAt: isoAgo(8),
      updatedAt: isoAgo(8),
    },
    {
      _id: newId(),
      adminId: 'Admin Officer',
      verdict: 'reupload',
      summary: 'Simran Kaur - Class 10th Marksheet: Re-upload requested (Blurry Image - Roll number and grades not readable)',
      createdAt: isoAgo(7),
      updatedAt: isoAgo(7),
    },
    {
      _id: newId(),
      adminId: 'Admin Officer',
      verdict: 'verified',
      summary: 'Priya Verma - Income Certificate: Marked REAL',
      createdAt: isoAgo(5),
      updatedAt: isoAgo(5),
    }
  ];

  saveStore();
  console.log('✅ Demo seed data initialized successfully!');
}

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/admission_verify';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 1500 });
    console.log('✅ Connected to MongoDB at:', uri);
    isUsingFallback = false;
    return true;
  } catch (err) {
    console.log('ℹ️ Notice: Standalone persistent database mode active (JSON store: server/data/store.json)');
    isUsingFallback = true;
    await seedInitialData();
    return false;
  }
}

module.exports = {
  connectDB,
  createModelWrapper,
  seedInitialData,
  isFallback: () => isUsingFallback,
  getStore: () => memoryStore,
  saveStore,
};
