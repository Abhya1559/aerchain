import { runRfpAgent } from "../services/aiServices.js";
import RFP from "../models/rfp.model.js";
import nodemailer from "nodemailer";

export const rfpAgent = async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!message) {
      return res.status(404).json({ message: "Google not responding" });
    }
    const response = await runRfpAgent(message);

    const newRFP = new RFP({
      email,
      rawDescription: message,
      status: "Draft",
      structuredRequirements: response,
    });
    const savedRFP = await newRFP.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      // host: "smtp.gmail.com",
      // port: 587,
      // secure: false,
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject: "New Procurement Request (RFP) Received",
      html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New RFP Notification</title>
  </head>

  <body style="margin:0; padding:0; background:#f4f4f5; font-family:Arial, sans-serif;">
    <div style="max-width:650px; margin:20px auto; background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">

      <!-- Header -->
      <div style="background:#111827; padding:22px; text-align:center; color:white;">
        <h2 style="margin:0; font-size:22px;">New RFP Received from Aerchain</h2>
      </div>

      <!-- Body -->
      <div style="padding:22px; color:#111827; font-size:15px; line-height:1.6;">
        <p>Dear Vendor,</p>

        <p>You have received a <strong>new procurement request (RFP)</strong>.  
        Please review the details below and provide your quotation or response.</p>

        <!-- Summary Box -->
        <div style="
          background:#f9fafb;
          border-left:4px solid #2563eb;
          padding:15px;
          margin:18px 0;
          border-radius:6px;
        ">
          <p style="margin:0; font-size:14px;">
            <strong>RFP Summary:</strong><br>
            • Request Date: <strong>${new Date().toLocaleString()}</strong><br>
            • Order details:<strong>total:${
              response.quantity
            }</strong>,<strong>${
        response.item_description
      }</strong>,<strong>budget:${response.total_budget}</strong>,
      <strong>${response.specifications.ram}</strong>,
      <strong>${response.specifications.storage}</strong>, <strong>${
        response.specifications.graphics
      }</strong>
          </p>
        </div>

        <!-- Description -->
        <p><strong>Buyer Request Description:</strong></p>
        <p style="white-space:pre-line; background:#f3f4f6; padding:12px; border-radius:6px; font-size:14px; border:1px solid #e5e7eb;">
          ${response.order_summary}
        </p>
        <p style="margin-top:25px;">
          Regards,<br/>
          <strong>Aerchain Procurement Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f3f4f6; padding:14px; text-align:center; font-size:12px; color:#6b7280;">
        © ${new Date().getFullYear()} Aerchain. All rights reserved.
      </div>

    </div>
  </body>
  </html>
  `,
    };

    await transporter.sendMail(mailOption);
    console.log(`Password reset email sent to ${email}`);

    return res.status(200).json({
      success: true,
      message: "API fetching data",
      rfpId: savedRFP._id,
      structuredRequirements: savedRFP.structuredRequirements,
    });
  } catch (error) {
    console.log("API Error", error);
    return res
      .status(501)
      .json({ message: "Server is not responding", error: error.message });
  }
};
