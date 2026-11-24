require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSmtp() {
  console.log('--- ABEN Technologies Gmail SMTP Diagnostics ---');
  console.log('Host:', process.env.SMTP_HOST || 'smtp.gmail.com');
  console.log('Port:', process.env.SMTP_PORT || '587');
  console.log('User:', process.env.SMTP_USER || 'abentechnologies@gmail.com');
  console.log('Pass set:', Boolean(process.env.SMTP_PASS) ? 'YES (Length: ' + process.env.SMTP_PASS.length + ')' : 'NO');
  console.log('From:', process.env.EMAIL_FROM || 'abentechnologies@gmail.com');
  console.log('To:', process.env.EMAIL_TO || 'abentechnologies@gmail.com');
  console.log('------------------------------------------------');

  if (!process.env.SMTP_PASS) {
    console.error('ERROR: SMTP_PASS is missing. Please define SMTP_PASS in .env or environment variables.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // port 587 uses STARTTLS
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER || 'abentechnologies@gmail.com',
      pass: (process.env.SMTP_PASS || '').replace(/\s+/g, '')
    }
  });

  try {
    console.log('Verifying connection with Gmail SMTP server (STARTTLS)...');
    await transporter.verify();
    console.log('SUCCESS: SMTP connection verified successfully!');

    // Send a test email to abentechnologies@gmail.com
    console.log('Sending test verification message to ' + (process.env.EMAIL_TO || 'abentechnologies@gmail.com') + '...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"ABEN Technologies" <abentechnologies@gmail.com>',
      to: process.env.EMAIL_TO || 'abentechnologies@gmail.com',
      replyTo: 'test.visitor@example.com',
      subject: '[ABEN Test Dispatch] SMTP Connectivity Test',
      text: 'This is a test email verifying that Gmail SMTP (port 587 STARTTLS) is operating properly for ABEN Technologies.\nTimestamp: ' + new Date().toISOString(),
      html: `
        <div style="font-family: monospace; background:#0c0c0f; color:#fff; padding:24px; border:1px solid #ff6900;">
          <h2 style="color:#ff6900; margin-top:0;">ABEN TECHNOLOGIES // SMTP TEST VERIFIED</h2>
          <p>Gmail SMTP connection and STARTTLS handshake completed successfully.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `
    });

    console.log('SUCCESS: Test email delivered! Message ID:', info.messageId);
    process.exit(0);
  } catch (err) {
    console.error('SMTP TEST FAILED:', err.message);
    if (err.code === 'EAUTH') {
      console.error('\n--> AUTHENTICATION ERROR: Invalid Gmail username or App Password.');
      console.error('--> Make sure 2-Step Verification is ON in your Google Account.');
      console.error('--> Generate a 16-character App Password from: https://myaccount.google.com/apppasswords');
      console.error('--> Enter that 16-character password into SMTP_PASS in .env without spaces.');
    }
    process.exit(1);
  }
}

testSmtp();
