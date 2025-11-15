
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Create a transporter object using the default SMTP transport
    // You will need to configure this with your own email service provider's details
    // For example, for Gmail, you would use:
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true, // true for 465, false for other ports
    // auth: {
    //   user: process.env.EMAIL_USER, // Your email address from .env.local
    //   pass: process.env.EMAIL_PASS, // Your email password or app password from .env.local
    // },
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Set up email data
    const mailOptions = {
      from: `"${name}" <${email}>`, // sender address
      to: 'aathisivan1104@gmail.com', // list of receivers
      subject: 'New Contact Form Submission', // Subject line
      text: message, // plain text body
      html: `<p>You have a new contact form submission from:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`, // html body
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
