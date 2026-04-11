import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

// Enum for email types
export const EmailEnums = Object.freeze({
  otp: 'otp',
  error: 'error',
  resetPassword: 'resetPassword',
});

export const EmailTemplates = Object.freeze({
  otp: 'otp',
  error: 'error',
  resetPassword: 'resetPassword',
});

// Handlebars config
const handlebarsOptions = {
  viewEngine: {
    partialsDir: path.resolve('./views/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views/'),
};

// Reusable function to build mail options
const buildMailOptions = ({ from, to, subject, template, context }) => ({
  from,
  to,
  subject,
  template,
  context,
});

const sendMail = async ({ email, subject, otp, template, type, context, data }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  transporter.use('compile', hbs(handlebarsOptions));

  let mailOptions;

  switch (type) {
    case EmailEnums.otp:
      mailOptions = buildMailOptions({
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        template,
        context: { otp },
      });
      break;

    case EmailEnums.resetPassword:
      mailOptions = buildMailOptions({
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        template,
        context: data,
      });
      break;

    case EmailEnums.error:
      mailOptions = buildMailOptions({
        from: process.env.SMTP_MAIL,
        to: 'alishbashabbir890@gmail.com',
        subject: 'Error in API',
        template,
        context,
      });
      break;
    default:
      throw new Error(`Unsupported email type: ${type}`);
  }

  // Send mail if options were set
  if (mailOptions) {
    await transporter.sendMail(mailOptions);
  }
};

export default sendMail;
