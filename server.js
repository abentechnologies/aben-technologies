require('dotenv').config();
const fs = require('fs');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend assets & HTML pages
app.use(express.static(__dirname));

/**
 * Configure Nodemailer Transporter using Gmail SMTP (STARTTLS on port 587)
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'abentechnologies@gmail.com';
  const pass = process.env.SMTP_PASS;

  if (!pass) {
    console.warn('[SMTP WARNING]: SMTP_PASS is not set in environment variables. Outgoing emails will fail until configured.');
  }

  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, // true for 465, false for other ports
    requireTLS: port === 587, // Enforce STARTTLS on port 587
    auth: {
      user: user,
      pass: pass ? pass.replace(/\s+/g, '') : ''
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * HTML Sanitization Helper to prevent injection in email clients
 */
function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // RFC 5322 standard regex subset
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim());
}

/**
 * Endpoint: Health Check & SMTP Status
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || 'abentechnologies@gmail.com',
    smtpConfigured: Boolean(process.env.SMTP_PASS)
  });
});

/**
 * Endpoint: Verify SMTP Connection
 */
app.get('/api/verify-smtp', async (req, res) => {
  if (!process.env.SMTP_PASS) {
    return res.status(500).json({
      success: false,
      error: 'SMTP_PASS is not set in server environment variables. Please provide your Gmail App Password.'
    });
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    return res.json({
      success: true,
      message: 'SMTP connection verified successfully with smtp.gmail.com:587 (STARTTLS).'
    });
  } catch (err) {
    console.error('[SMTP VERIFY ERROR]:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Main Inquiry Handler (Handles Contact Form, Service Enquiry, and Project Intake Terminal)
 */
app.post('/api/contact', async (req, res) => {
  try {
    const body = req.body || {};

    // Normalize field names across various forms
    const rawName = body.fullName || body.name || body.organisationName || '';
    const rawEmail = body.workEmail || body.email || body.corporateEmail || '';
    const rawPhone = body.phone || body.phoneNumber || body.tel || 'Not provided';
    const rawCompany = body.companyName || body.company || body.organisation || 'Not provided';
    const rawWebsite = body.websiteUrl || body.website || 'Not provided';
    
    // Services normalization (can be string or array)
    let rawServices = body.services || body.service || body.domains || [];
    if (Array.isArray(rawServices)) {
      rawServices = rawServices.join(', ');
    }
    if (!rawServices || rawServices.trim() === '') {
      rawServices = 'General Inquiry / Unspecified';
    }

    const rawBudget = body.budget || 'Not specified';
    const rawTimeline = body.timeline || 'Flexible / Unspecified';
    const rawMessage = body.projectDetails || body.message || body.scope || body.requirements || '';
    const formType = body.formType || 'Website Inquiry';

    // Validation
    const name = rawName.trim();
    const email = rawEmail.trim();
    const message = rawMessage.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your name or organization.'
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide project details or message description.'
      });
    }

    // Check SMTP configuration
    if (!process.env.SMTP_PASS) {
      console.error('[SMTP ERROR]: Cannot send email because SMTP_PASS is missing in environment variables.');
      return res.status(500).json({
        success: false,
        error: 'Server email configuration is pending (SMTP_PASS not set). Please configure your Gmail App Password.'
      });
    }

    // Format human-readable timestamp
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }) + ' (UTC)';

    const sanitizedData = {
      name: sanitize(name),
      email: sanitize(email),
      phone: sanitize(rawPhone),
      company: sanitize(rawCompany),
      website: sanitize(rawWebsite),
      services: sanitize(rawServices),
      budget: sanitize(rawBudget),
      timeline: sanitize(rawTimeline),
      message: sanitize(message),
      formType: sanitize(formType),
      timestamp: formattedTimestamp
    };

    const businessEmail = process.env.EMAIL_TO || 'abentechnologies@gmail.com';
    const fromAddress = process.env.EMAIL_FROM || `ABEN Technologies <${process.env.SMTP_USER || 'abentechnologies@gmail.com'}>`;

    const transporter = createTransporter();

    // 1. Business Notification Email (Sent to abentechnologies@gmail.com)
    const businessMailOptions = {
      from: fromAddress,
      to: businessEmail,
      replyTo: email, // Direct Reply-To the visitor
      subject: `[ABEN Tech] New ${sanitizedData.formType} from ${sanitizedData.name} — ${sanitizedData.services.slice(0, 40)}`,
      text: `
NEW INQUIRY RECEIVED — ABEN TECHNOLOGIES

Form: ${sanitizedData.formType}
Time: ${sanitizedData.timestamp}

CLIENT INFORMATION:
- Name: ${name}
- Email: ${email}
- Phone: ${rawPhone}
- Company: ${rawCompany}
- Website: ${rawWebsite}

PROJECT SCOPE:
- Service(s): ${rawServices}
- Budget: ${rawBudget}
- Timeline: ${rawTimeline}

MESSAGE / REQUIREMENTS:
${message}
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050505; color: #e5e2e1; margin: 0; padding: 24px; }
    .container { max-width: 640px; margin: 0 auto; background: #0c0c0f; border: 1px solid #222228; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
    .header { background: #121217; padding: 24px 32px; border-bottom: 2px solid #ff6900; }
    .logo { font-size: 20px; font-weight: 900; letter-spacing: 0.08em; color: #ffffff; text-transform: uppercase; }
    .logo span { color: #ff6900; }
    .subtag { font-size: 11px; color: #ff6900; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px; }
    .body-content { padding: 32px; }
    .intro { font-size: 14px; color: #a1a1aa; margin-bottom: 24px; line-height: 1.6; }
    .section-title { font-size: 11px; font-family: monospace; color: #ff6900; letter-spacing: 0.15em; text-transform: uppercase; margin: 24px 0 12px 0; border-bottom: 1px solid #1f1f26; padding-bottom: 6px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .data-table td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #181820; vertical-align: top; }
    .label-col { width: 35%; color: #888894; font-family: monospace; text-transform: uppercase; font-size: 11px; }
    .val-col { width: 65%; color: #ffffff; font-weight: 500; }
    .val-col a { color: #ff6900; text-decoration: none; }
    .message-box { background: #13131a; border-left: 3px solid #ff6900; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.7; color: #f4f4f5; white-space: pre-wrap; word-break: break-word; }
    .footer { background: #08080a; padding: 20px 32px; border-top: 1px solid #181820; font-size: 11px; color: #666672; font-family: monospace; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ABEN <span>TECHNOLOGIES</span></div>
      <div class="subtag">// DISPATCH_INTAKE :: NEW INQUIRY RECEIVED</div>
    </div>
    <div class="body-content">
      <div class="intro">
        A new proposal inquiry has been submitted via <strong>${sanitizedData.formType}</strong>. You can reply directly to this email to respond to the visitor.
      </div>

      <div class="section-title">01 // VISITOR IDENTIFICATION</div>
      <table class="data-table">
        <tr>
          <td class="label-col">Full Name</td>
          <td class="val-col">${sanitizedData.name}</td>
        </tr>
        <tr>
          <td class="label-col">Corporate Email</td>
          <td class="val-col"><a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></td>
        </tr>
        <tr>
          <td class="label-col">Phone Number</td>
          <td class="val-col">${sanitizedData.phone}</td>
        </tr>
        <tr>
          <td class="label-col">Organization</td>
          <td class="val-col">${sanitizedData.company}</td>
        </tr>
        <tr>
          <td class="label-col">Website</td>
          <td class="val-col">${sanitizedData.website}</td>
        </tr>
      </table>

      <div class="section-title">02 // SCOPE &amp; CLASSIFICATION</div>
      <table class="data-table">
        <tr>
          <td class="label-col">Service Domain(s)</td>
          <td class="val-col" style="color:#ff6900;">${sanitizedData.services}</td>
        </tr>
        <tr>
          <td class="label-col">Estimated Budget</td>
          <td class="val-col">${sanitizedData.budget}</td>
        </tr>
        <tr>
          <td class="label-col">Project Timeline</td>
          <td class="val-col">${sanitizedData.timeline}</td>
        </tr>
        <tr>
          <td class="label-col">Transmission Time</td>
          <td class="val-col">${sanitizedData.timestamp}</td>
        </tr>
      </table>

      <div class="section-title">03 // PROJECT REQUIREMENTS / MESSAGE</div>
      <div class="message-box">${sanitizedData.message}</div>
    </div>
    <div class="footer">
      ABEN TECHNOLOGIES SYSTEM ADVISORY &bull; DIRECT DISPATCH PIPELINE &bull; REPLY-TO CONFIGURED
    </div>
  </div>
</body>
</html>
      `.trim()
    };

    // 2. Visitor Confirmation Email (Sent to visitor's email)
    const visitorMailOptions = {
      from: fromAddress,
      to: email,
      subject: `Thank you for contacting ABEN Technologies — Inquiry Received`,
      text: `
Dear ${name},

Thank you for reaching out to ABEN Technologies.

We have received your inquiry regarding "${rawServices}". Our team of solution architects is currently reviewing your project requirements. A technical lead will review your submission and contact you within 24 business hours.

SUBMISSION SUMMARY:
- Name: ${name}
- Service(s): ${rawServices}
- Budget: ${rawBudget}
- Timeline: ${rawTimeline}
- Submitted: ${sanitizedData.timestamp}

If you have additional architecture specifications or materials to share, you can reply directly to this email.

Best regards,

ABEN Technologies Team
abentechnologies@gmail.com
https://abentech.com
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050505; color: #e5e2e1; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #0c0c0f; border: 1px solid #222228; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
    .header { background: #121217; padding: 28px 32px; border-bottom: 2px solid #ff6900; }
    .logo { font-size: 22px; font-weight: 900; letter-spacing: 0.08em; color: #ffffff; text-transform: uppercase; }
    .logo span { color: #ff6900; }
    .subtag { font-size: 11px; color: #ff6900; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px; }
    .body-content { padding: 32px; line-height: 1.7; font-size: 14px; color: #d4d4d8; }
    .greeting { font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 16px; }
    .lead { font-size: 15px; color: #e4e4e7; margin-bottom: 24px; }
    .card { background: #131318; border: 1px solid #22222c; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .card-title { font-size: 11px; font-family: monospace; color: #ff6900; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px; }
    .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #1a1a22; }
    .summary-label { color: #888894; font-family: monospace; }
    .summary-val { color: #ffffff; font-weight: 600; text-align: right; }
    .next-steps { background: rgba(255,105,0,0.06); border-left: 3px solid #ff6900; padding: 16px; border-radius: 4px; margin: 24px 0; font-size: 13px; color: #e4e4e7; }
    .sign-off { margin-top: 28px; padding-top: 20px; border-top: 1px solid #1c1c24; }
    .sign-off-name { font-weight: 700; color: #ffffff; }
    .sign-off-title { font-size: 12px; color: #ff6900; font-family: monospace; }
    .footer { background: #08080a; padding: 20px 32px; border-top: 1px solid #181820; font-size: 11px; color: #666672; font-family: monospace; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ABEN <span>TECHNOLOGIES</span></div>
      <div class="subtag">// ACKNOWLEDGMENT RECEIPT :: TRANSMISSION CONFIRMED</div>
    </div>
    <div class="body-content">
      <div class="greeting">Dear ${sanitizedData.name},</div>
      <p class="lead">
        Thank you for reaching out to <strong>ABEN Technologies</strong>. We have successfully received your inquiry and project overview.
      </p>

      <div class="card">
        <div class="card-title">// SUBMISSION SUMMARY</div>
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <tr>
            <td style="padding:6px 0; color:#888894; font-family:monospace;">SERVICE(S)</td>
            <td style="padding:6px 0; color:#ff6900; font-weight:bold; text-align:right;">${sanitizedData.services}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#888894; font-family:monospace;">BUDGET</td>
            <td style="padding:6px 0; color:#ffffff; font-weight:bold; text-align:right;">${sanitizedData.budget}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#888894; font-family:monospace;">TIMELINE</td>
            <td style="padding:6px 0; color:#ffffff; font-weight:bold; text-align:right;">${sanitizedData.timeline}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#888894; font-family:monospace;">RECEIVED</td>
            <td style="padding:6px 0; color:#ffffff; font-weight:bold; text-align:right;">${sanitizedData.timestamp}</td>
          </tr>
        </table>
      </div>

      <div class="next-steps">
        <strong>What happens next:</strong><br>
        A Senior Solutions Architect is evaluating your scope and technical stack preferences. We will follow up directly at this email address within <strong>24 business hours</strong> to discuss architectures, feasibility, and next milestones.
      </div>

      <p style="color:#a1a1aa; font-size:13px;">
        If you have additional design assets, architecture diagrams, or RFP documents to include, feel free to reply directly to this confirmation email.
      </p>

      <div class="sign-off">
        <div class="sign-off-name">ABEN Technologies Leadership &amp; Engineering</div>
        <div class="sign-off-title">abentechnologies@gmail.com &bull; Enterprise Digital Architectures</div>
      </div>
    </div>
    <div class="footer">
      &copy; 2025 ABEN TECHNOLOGIES CORP. ALL RIGHTS RESERVED. &bull; CONFIDENTIAL &bull; HIGH INTEGRITY DELIVERY
    </div>
  </div>
</body>
</html>
      `.trim()
    };

    // Send business notification email
    const businessInfo = await transporter.sendMail(businessMailOptions);
    console.log(`[SMTP SUCCESS]: Notification email dispatched to ${businessEmail}. MessageId: ${businessInfo.messageId}`);

    // Send visitor confirmation email
    let visitorDelivered = false;
    try {
      const visitorInfo = await transporter.sendMail(visitorMailOptions);
      console.log(`[SMTP SUCCESS]: Confirmation email dispatched to ${email}. MessageId: ${visitorInfo.messageId}`);
      visitorDelivered = true;
    } catch (visitorErr) {
      console.warn(`[SMTP WARN]: Visitor confirmation email could not be sent to ${email}:`, visitorErr.message);
    }

    return res.json({
      success: true,
      message: 'Inquiry transmitted successfully. Our team has been notified and a confirmation email has been dispatched.',
      messageId: businessInfo.messageId,
      visitorConfirmationSent: visitorDelivered
    });

  } catch (err) {
    console.error('[SUBMISSION ERROR]:', err);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing your inquiry: ' + (err.message || 'SMTP delivery failure')
    });
  }
});

// Clean navigation & direct URL access handler
app.get('*', (req, res) => {
  const reqPath = req.path === '/' ? 'index.html' : req.path.replace(/^\//, '');
  let filePath = path.join(__dirname, reqPath);

  // 1. Direct file match (e.g. static assets, images, or .html requested)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }

  // 2. Clean URL without extension (e.g. /about -> about.html)
  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    return res.sendFile(filePath + '.html');
  }

  // 3. Fallback to 404.html if route not found
  const notFoundPage = path.join(__dirname, '404.html');
  if (fs.existsSync(notFoundPage)) {
    return res.status(404).sendFile(notFoundPage);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`ABEN Technologies Server running at http://localhost:${PORT}`);
  console.log(`Gmail SMTP Target: ${process.env.EMAIL_TO || 'abentechnologies@gmail.com'}`);
  console.log(`SMTP Port: ${process.env.SMTP_PORT || '587'} (STARTTLS)`);
  console.log(`SMTP_PASS set: ${Boolean(process.env.SMTP_PASS) ? 'YES' : 'NO (Awaiting App Password)'}`);
  console.log(`=======================================================`);
});
