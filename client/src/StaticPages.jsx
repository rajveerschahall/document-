import { Link } from 'react-router-dom';
const Hero = ({ title, text, children }) => <div className="hero"><div className="w"><h1>{title}</h1><p>{text}</p>{children}</div></div>;
const Cards = ({ items }) => <div className="w grid pad">{items.map(([i, t, d]) => <div className="card" key={t}><div className="ic">{i}</div><h3>{t}</h3><p>{d}</p></div>)}</div>;

export const Home = () => (<>
  <Hero title="Digital Admission Document Verification & Management System" text="Eliminate queues and manual paperwork with an encrypted, real-time document verification portal.">
    <Link className="btn light" to="/register">Get Started</Link> <Link className="btn ghost" to="/about">Learn More</Link> <Link className="btn ghost" to="/track">Track Application</Link>
  </Hero>
  <Cards items={[['🪪', 'Student Registration', 'Online registration with a unique Application ID.'], ['☁️', 'Document Upload', 'PDF, PNG, JPEG up to 5MB.'],
    ['✅', 'Document Verification', 'Admin marks documents REAL or FAKE with reasons.'], ['📍', 'Track Status', 'Live status without logging in.'],
    ['🛡️', 'Admin Panel', 'Review, audit log, QR verification stamp.'], ['🔒', 'Secure', 'JWT auth, hashed passwords, role-based access.']]} />
</>);
export const About = () => (<><Hero title="About AdmissionVerify" text="A paperless document verification system for educational institutions." />
  <Cards items={[['🎓', 'Student Empowerment', 'Register, upload and track from anywhere.'], ['🏛️', 'Institutional Security', 'Detect fake or altered documents with an audit trail.'], ['⚡', 'Administrative Efficiency', 'Review pending documents quickly.']]} /></>);
export const HowItWorks = () => (<><Hero title="How AdmissionVerify Works" text="A transparent 4-step pipeline." />
  <Cards items={[['1️⃣', 'Create Account', 'Register and receive your Application ID.'], ['2️⃣', 'Upload Documents', '10th, 12th marksheet, ID proof, certificates.'], ['3️⃣', 'Track Progress', 'See Pending, Verified or Flagged status.'], ['4️⃣', 'Get Verified', 'Verified documents receive a QR verification stamp.']]} /></>);
export const Features = () => (<><Hero title="System Features & Modules" text="Everything needed for modern admissions." />
  <Cards items={[['🗂️', 'Secure Document Vault', 'Type and size validated uploads.'], ['🔎', 'Live Status Tracking', 'Search by Application ID.'], ['🔔', 'Discrepancy Alerts', 'Rejection reasons and re-upload requests.'], ['🧾', 'QR Verification Stamp', 'SHA-256 stamp anyone can verify.']]} /></>);
export const Contact = () => (<><Hero title="Contact Us" text="We are here to help." />
  <div className="w pad"><div className="card"><h3>Aarti Kumari</h3><p>📞 <a href="tel:+919872104110">+91 98721 04110</a><br />✉️ <a href="mailto:support@campusverify.edu">support@campusverify.edu</a></p></div></div></>);
