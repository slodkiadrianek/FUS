import { Logger } from "../utils/logger.js";
import nodemailer, { SentMessageInfo, Transporter } from "nodemailer";
import { AppError } from "./error.service.js";
export class EmailService {
  private transporter: Transporter;
  constructor(
    private logger: Logger,
    private user: string,
    private pass: string,
    private service = "gmail"
  ) {
    this.transporter = nodemailer.createTransport({
      service: this.service,
      auth: { user: this.user, pass: this.pass },
    });
  }
  async sendEmail(
    to: string,
    subject: string,
    text: string,
    redirect: string
  ): Promise<SentMessageInfo> {
    try {
      const mailOptions = {
        from: this.transporter.options.from,
        to,
        subject,
        text,
      };
      this.logger.info("Attempt to send email");
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.info(`Email sent:`, info.response);
      return info;
    } catch (error) {
      this.logger.error("Error occured during sending an email");
      throw new AppError(
        400,
        redirect,
        "Wystąpił błąd podczas wysyłania maila"
      );
    }
  }
}
