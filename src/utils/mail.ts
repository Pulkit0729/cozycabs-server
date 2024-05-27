import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
// import logger from "../logger";

const hostname = process.env.EMAIL_HOSTNAME;
const username = process.env.EMAIL_USERNAME;
const password = process.env.EMAIL_PASSWORD;

export function mailOptions(
  from: String,
  to: String,
  subject: String,
  text: String,
  headers: Object,
  html: String
): Mail.Options {
  return {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
    headers: headers,
  } as Mail.Options;
}

export async function verifyMail(mailOption  : Mail.Options) {


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: username, // generated brevo user
      pass: password, // generated brevo password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOption);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>



 
}
