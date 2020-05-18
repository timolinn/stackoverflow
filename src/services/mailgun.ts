import { MailerInterface, MailerData } from "./Mailer";
import { logger } from "../util/logger";
import { EmailData } from "@sendgrid/helpers/classes/email-address";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import { MailData, MailContent, MailSettings } from "@sendgrid/helpers/classes/mail";

class Mailgun implements MailerInterface {
  public to?: EmailData | EmailData[];
  public cc?: EmailData|EmailData[];
  public bcc?: EmailData|EmailData[];

  public replyTo?: EmailData;

  public sendAt?: number;

  public subject?: string;
  public text?: string;
  templateName!: string;
  public html?: string;
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

  constructor() {
    logger.debug("constructor(): unimplemented!");
  }
  public send(): Promise<void> {
    logger.debug("send(): unimplemented!");
    return new Promise((resolve, reject) => resolve());
  }

  public sendMany() {
    logger.debug("sendMany(): unimplemented!");
  }

  public setData(data: MailerData) {
    logger.debug("setData(): unimplemented!");
  }
}

export default new Mailgun();
