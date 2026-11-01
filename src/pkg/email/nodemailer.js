import nodemailer from "nodemailer";

export class NodeMailerProvider {
  transporter;
  email;
  from;
  constructor(config) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      auth: {
        user: config.email,
        pass: config.password,
      },
    });

    this.email = config.email;
    this.from = config.from;
  }

  async sendEmail(to, subject, html) {
    try {
      return await this.transporter.sendMail({
        from: `${this.from} <${this.email}>`,
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error("Error while sending mail:", err);
    }
  }
}
