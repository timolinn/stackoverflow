import sendgrid from "@sendgrid/mail";
import { EmailData } from "@sendgrid/helpers/classes/email-address";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import { MailContent, MailSettings } from "@sendgrid/helpers/classes/mail";
import appRoot from "app-root-path";
import { existsSync } from "fs";
import pug from "pug";
import juice from "juice";
import { MailerInterface, MailerData } from "./Mailer";
import { logger } from "../util/logger";
import config from "../config";

class Sendgrid implements MailerInterface {
  public to?: EmailData | EmailData[];
  public cc?: EmailData|EmailData[];
  public bcc?: EmailData|EmailData[];
  public replyTo?: EmailData;
  public sendAt?: number;
  public subject?: string;
  public text?: string;
  public html?: string;
  public templateName!: string;
  public content?: MailContent[];
  public attachments?: AttachmentData[];
  public sections?: { [key: string]: string };
  public headers?: { [key: string]: string };

  public categories?: string[];
  public category?: string;

  public customArgs?: { [key: string]: any };
  public mailSettings?: MailSettings;
  public substitutions?: { [key: string]: string };
  public substitutionWrappers?: string[];

  public isMultiple?: boolean;
  constructor(apiKey: string) {
    sendgrid.setApiKey(apiKey);
  }

  public send(): Promise<void> {
    return sendgrid.send({
      to: this.to,
      from: `${config.mail.from.name} <${config.mail.from.email}>`,
      subject: this.subject,
      text: this.text,
      html: this.html
    }).then(() => {
      logger.info("email sent to " + this.to);
    }).catch((err: any) => {
      logger.debug(`failed to send ${this.templateName} to ${this.to}: Error => ${err}`);
    });
  }

  /**
   * Send email to multiple receivers
   */
  public sendMany() {
    logger.debug("sendMany(): unimplemented!");
  }

  public setData(data: MailerData) {
    const { to, cc, bcc, replyTo, text, subject, templateName, mailInfo } = data;
    this.to = to;
    this.cc = cc;
    this.bcc = bcc;
    this.replyTo = replyTo;
    this.text = text;
    this.subject = subject;
    this.html = this.templetify(templateName, mailInfo);
  }

  /**
   * HTML file path
   * @param template Path to html file
   */
  public templetify(template: string = "", options: Record<string, any> = {}) {
    const file = `${appRoot}/src/public/email/${template}.pug`;
    if (!existsSync(file)) {
      logger.debug(`"${template}" email template not found.`);
      return "";
    }
    const html = pug.renderFile(file, options);
    return juice(html);
  }
}

export default new Sendgrid(config.sendgrid.apiKey);
