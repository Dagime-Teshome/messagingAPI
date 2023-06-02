import { Context, Telegraf } from 'telegraf';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Message, Provider } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {
  }

  async onModuleInit() {
    this.launch();
  }
  private bots: {
    [key: number]: {
      element: Provider;
      bot: Telegraf<Context<Update>>;
    };
  } = {};

  private async launch() {

    let res = await this.prismaService.provider.findMany({
      where: { type: 'TELEGRAM' },
    });

    for (const element of res) {
      const settings: any = element.settings;
      const bot = new Telegraf(settings.token);
      // when bot is started
      bot.start(async (ctx) => {
        const messageText = `Hi there, you just started the bot. Please send your contacts by pressing the my phone number button`;
        await ctx.reply(messageText, {
          reply_markup: {
            one_time_keyboard: true,
            is_persistent: false,
            resize_keyboard: true,
            keyboard: [
              [
                {
                  text: 'My phone number',
                  request_contact: true,
                },
              ],
              ['Cancel'],
            ],
          },
        });
      });

      // when contact is sent
      bot.on('contact', async (ctx) => {
        if (ctx.message.contact.user_id === ctx.from.id) {
          // check if account already added first
          let accounts = await this.prismaService.account.findFirst({
            where: { phoneNumber: ctx.message.contact.phone_number,
            providerId:element.id },
          });
          if (!accounts) {
            await ctx.reply('Account registered successfully');
            await this.prismaService.account.create({
              data: {
                phoneNumber: ctx.message.contact.phone_number,
                telegramId: ctx.message.contact.user_id,
                providerId: element.id,
              },
            });
          } else {
            await ctx.reply('Account already in system');
          }
        } else {
          await ctx.reply('Please share your own contact info', {
            reply_markup: {
              keyboard: [[{ request_contact: true, text: 'Phone No' }]],
            },
          });
        }
      });
      try {
        bot
          .launch()
          .then()
          .catch((e) => {
            console.log(e);
          });
      } catch (e) {
        console.log(e);
      }
      if (element.id) {
        this.bots[element.id] = { element, bot };
      }
    }
  }

  async send(message: Message): Promise<void> {
    let account = await this.prismaService.account.findFirst({
      where: { phoneNumber: message.to, providerId: message.providerId },
    });
    if (account.telegramId) {
      await this.bots[message.providerId].bot.telegram.sendMessage(
        account.telegramId,
        message.content,
      );
    } else throw new Error('Telegram ID Required');
  }
}
