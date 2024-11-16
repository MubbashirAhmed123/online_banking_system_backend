const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config()
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, 
  secure: false, 
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASSWORD
  },
});

const sendEmail = async (email,userName,accountNumber,securityPin) => {
  
    const mailOptions = {
      from: `Ib Bank ${process.env.EMAIL}`, 
      to: email,
      subject: 'Your Bank Info and Credentials',
      text: `Successfully created your account in Ib Bank.\n\nUser Name: ${userName}\nEmail: ${email}\nAccount Number: ${accountNumber}\nSecurity Pin: ${securityPin}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #333;">Welcome to Ib Bank!</h1>
              <p style="color: #555;">Successfully created your account.</p>
              <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 10px; padding: 10px; background: #f9f9f9; border-radius: 5px; border: 1px solid #ddd;">
                  <strong style="color: #333;">User Name:</strong> <span style="color: #555;">${userName}</span>
                </li>
                <li style="margin-bottom: 10px; padding: 10px; background: #f9f9f9; border-radius: 5px; border: 1px solid #ddd;">
                  <strong style="color: #333;">Email:</strong> <span style="color: #555;">${email}</span>
                </li>
                <li style="margin-bottom: 10px; padding: 10px; background: #f9f9f9; border-radius: 5px; border: 1px solid #ddd;">
                  <strong style="color: #333;">Account Number:</strong> <span style="color: #555;">${accountNumber}</span>
                </li>
                <li style="margin-bottom: 10px; padding: 10px; background: #f9f9f9; border-radius: 5px; border: 1px solid #ddd;">
                  <strong style="color: #333;">Security Pin:</strong> <span style="color: #555;">${securityPin}</span>
                </li>
              </ul>
              <p style="color: #555;">Thank you for choosing Ib Bank!</p>
              <footer style="margin-top: 20px; padding: 10px; background: #f9f9f9; border-top: 1px solid #ddd;">
                <p style="color: #777; font-size: 12px;">This email was sent to you by Ib Bank. If you did not create an account, please ignore this email.</p>
              </footer>
            </div>
          </body>
        </html>
      `
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:');
    }
  };
  

module.exports = { sendEmail };
