const nodemailer = require("nodemailer");
const { config } = require("../config");
const logger = require("./logger");

/**
 * Provider-independent mailer. Reads only `config.mail.*` — swapping
 * Ethereal for a real SMTP provider later means setting SMTP_* env vars,
 * with zero changes to any calling code.
 *
 * If no SMTP host is configured, an Ethereal Email test account is
 * created automatically on first use (approved decision: Nodemailer +
 * Ethereal for the MVP), and every sent message logs a preview URL.
 */
let transporterPromise = null;

function getTransporter() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    if (config.mail.host) {
      return nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        auth: { user: config.mail.user, pass: config.mail.password },
      });
    }

    const testAccount = await nodemailer.createTestAccount();
    logger.info(`Ethereal test account created for email delivery: ${testAccount.user}`);
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  })();

  return transporterPromise;
}

async function sendMail({ to, subject, text, html }) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: '"StudySync" <no-reply@studysync.app>',
    to,
    subject,
    text,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    logger.info(`Email preview (Ethereal): ${previewUrl}`);
  }

  return info;
}

module.exports = { sendMail };
