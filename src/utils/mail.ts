import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export async function sendMail(to: string, otp: string) {
    const mailOptions = {
        from: `"Secure Auth" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        html: `
      <div style="
        font-family: 'Segoe UI', sans-serif;
        background: #f8f9fb;
        padding: 40px;
        text-align: center;
      ">
        <div style="
          max-width: 420px;
          margin: auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          padding: 30px;
        ">
          <h2 style="color: #2b2d42;">Verification Code</h2>
          <p style="color: #555; font-size: 15px; margin-top: 10px;">
            Please use the code below to verify your identity. 
            This code will expire in <strong>5 minutes</strong>.
          </p>

          <div style="
            background: linear-gradient(135deg, #6c63ff, #836fff);
            color: white;
            font-size: 28px;
            letter-spacing: 6px;
            border-radius: 12px;
            padding: 14px 0;
            margin: 25px 0;
            font-weight: bold;
          ">
            ${otp}
          </div>

          <p style="font-size: 13px; color: #777;">
            If you did not request this code, please ignore this email.
          </p>

          <div style="margin-top: 30px; color: #aaa; font-size: 12px;">
            © ${new Date().getFullYear()} Secure Auth. All rights reserved.
          </div>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}
