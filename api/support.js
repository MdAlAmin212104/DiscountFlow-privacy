const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields (name, email, message) are required.' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'mdalamin212104@gmail.com',
        pass: process.env.SMTP_PASS || 'ofhpfnosxtxopcpg'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const recipient = process.env.RECEIVER_EMAIL || process.env.SMTP_USER || 'mdalamin212104@gmail.com';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

    const mailOptionsAdmin = {
      from: `"DiscountFlow Support Portal" <${process.env.SMTP_USER || 'mdalamin212104@gmail.com'}>`,
      to: recipient,
      replyTo: email,
      subject: `🚨 [DiscountFlow Ticket] New Support Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #6366f1;">
          <h2 style="color: #818cf8; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-top: 0;">
            📥 New Support Ticket Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 140px; font-weight: bold;">Merchant / Store:</td>
              <td style="padding: 8px 0; color: #ffffff;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Store Email:</td>
              <td style="padding: 8px 0; color: #3b82f6;"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Submission Time:</td>
              <td style="padding: 8px 0; color: #ffffff;">${submittedAt} (BST)</td>
            </tr>
          </table>

          <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #10b981;">Message Detail:</h4>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #e2e8f0;">${message}</p>
          </div>

          <div style="font-size: 12px; color: #64748b; border-top: 1px solid #334155; padding-top: 12px; text-align: center;">
            DiscountFlow Automated Support Portal • Managed via ${recipient}
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptionsAdmin);

    return res.status(200).json({
      success: true,
      message: 'Your support ticket has been submitted successfully!'
    });

  } catch (err) {
    console.error('❌ Failed to send support email:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to deliver email. Please try contacting directly at mdalamin212104@gmail.com'
    });
  }
};
