/* eslint-disable no-useless-escape */
import nodemailer from 'nodemailer';
import { readFile } from 'fs';
import { promisify } from 'util';

import { IUser } from '@Core/Models/Schemas/UserSchema';

class Email {
  private readonly to: string;
  private readonly firstName: string;
  private readonly url: string;
  private readonly from: string;

  public constructor(sendTo: IUser, url: string) {
    this.to = sendTo.email;
    this.firstName = sendTo.name.split(' ')[0];
    this.url = url;
    this.from = `Murilo Sanches <${process.env.EMAIL_FROM}>`;
  }

  public async SendPasswordResetToken() {
    await this.Send('Seu token para recuperação de senha (válido por apenas 1 hora)');
  }

  private async Send(subject: string): Promise<void> {
    const index: string = await promisify(readFile)('src/views/emails/resetpassword.html', 'utf-8');
    const html: string = index
      .replace('{{%USER_NAME%}}', this.firstName)
      .replace('{{%RESET_URL%}}', this.url)
      .replace('{{%USER_EMAIL%}}', this.to);

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.NewTransport().sendMail(mailOptions);
  }

  private NewTransport(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public static IsValid(email: string): boolean {
    // ! https://www.w3resource.com/javascript/form/email-validation.php
    if (new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)) {
      return true;
    }
    return false;
  }
}

export default Email;
