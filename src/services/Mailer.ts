import { MailData } from "@sendgrid/helpers/classes/mail";
import config from "../config";
import { logger } from "../util/logger";

export interface MailerData extends Omit<MailData, "from"> {
  templateName: string | undefined;
  mailInfo?: Record<string, any>;
}
export interface MailerInterface extends MailerData {
  send: () => Promise<void>;
  sendMany: () => void;
  setData: (data: MailerData) => void;
}

export default class Mailer {
  constructor(public gateway: MailerInterface) {}

  public setData(data: MailerData) {
    this.gateway.setData(data);
  }

  public async send() {
    if (config.env === "test") {
      return logger.info(`${this.gateway.subject} email sent to ${this.gateway.to}`);
    }
    this.gateway.send();
  }
}
