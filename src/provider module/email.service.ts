import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../../prisma/prisma.service';
import { Message } from '@prisma/client';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private from: string;
  private settings: any={};

  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit() {
    this.getProvider();
  }

  async getProvider() {
    const res = await this.prismaService.provider.findMany({
      where: { type: 'EMAIL' },
    });
    if (res && res.length > 0) {
      this.settings = res[0].settings;
      this.from = this.settings.auth.user;
    }
  }

  async send(message: Message): Promise<void> {
    let mailOptions: Mail.Options = {};
    if (message.type?.toUpperCase() === 'HTML') {
      mailOptions.html = message.content;
    } else {
      mailOptions.text = message.content;
    }
    mailOptions.subject = message.subject;
    mailOptions.to = message.to;
    mailOptions.from = message.from ?? '';
    await this.SendMail(mailOptions);
  }

    SendMail(mailOptions: Mail.Options) {
    return new Promise(async (resolve, reject) => {
      let transporter = await nodemailer.createTransport(this.settings);
  
      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }
}



interface Settings {
  service: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}
