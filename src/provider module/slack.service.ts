import { Injectable,OnModuleInit} from '@nestjs/common';
import { Message } from '@prisma/client';
import { App } from '@slack/bolt';
import { PrismaService } from '../../prisma/prisma.service';
import { measureMemory } from 'vm';

@Injectable()
export class SlackService implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {}
  
  async onModuleInit() {
    this.initialize();
  }

  app = new App({
    appToken: process.env.SLACK_APP_TOKEN,
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
  });

  initialize() {
    this.app.start().catch((error) => {
      console.error(error);
      process.exit(1);
    });

    this.app.command('/register', async ({ ack, client }) => {
      await ack();
    });

    this.app.event('message', async ({ event, client, logger }) => {
      try {
        // Call chat.postMessage with the built-in client
        // const result = await client.users.info();
        // logger.info(result);
      } catch (error) {
        logger.error(error);
      }
    });

    this.app.message('knock knock', async ({ message, say }) => {
      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Hey there <@${message}>!`,
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click Me',
              },
              action_id: 'button_click',
            },
          },
        ],
        text: `Hey there <@${message}>!`,
      });
    });

    this.app.event('app_home_opened', async ({ event, client, context }) => {
      try {
        /* view.publish is the method that your app uses to push a view to the Home tab */
        const result = await client.views.publish({
          /* the user that opened your app's app home */
          user_id: event.user,

          /* the view object that appears in the app home*/
          view: {
            type: 'home',
            callback_id: 'home_view',

            /* body of the view */
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*Welcome to Marki App_* :tada:',
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Use the button below to register to our messaging database',
                },
              },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    style: 'primary',
                    text: {
                      type: 'plain_text',
                      text: 'Register',
                    },
                    action_id: 'button_click',
                  },
                ],
              },
            ],
          },
        });
      } catch (error) {
        console.error(error);
      }
    });

    this.app.action('button_click', async ({ body, ack, say }) => {
      // Acknowledge the action
      // await say(`<@${body.user.id}> clicked the button`);
      await ack();
      this.registerUser(body.user);
    });
  }

  private async registerUser(user: any) {
    let userId = user.id;
    // get current user
    const cur_user = await this.app.client.users.info({
      user: userId,
    });
    // get accounts already registered
    let acc = await this.prismaService.account.findFirst({
      where: {
        slackId: cur_user.user?.id,
        email: cur_user.user?.profile?.email,
      },
    });
    console.log(acc)
    if (acc) {
      this.postMessage(userId, 'Account is already registered');
    } else {
      await this.prismaService.account.create({
        data: {
          slackId:cur_user.user.id,
          email:cur_user.user.profile.email
        },
      });
      this.postMessage(userId, 'Account registered successfully');
    }
  }

  private async postMessage(userId: any, message: string) {
    await this.app.client.chat.postMessage({
      channel: userId,
      text: message,
    });
  }

  public async send(message: Message) {
    let acc = await this.prismaService.account.findFirst({
      where: {
        email:message.to
      },
    });
    if (acc) {
      this.postMessage(acc.slackId, message.content);
    }else{
      return await this.prismaService.message.delete({
        where:{
          id:message.id,
        },
        
      })
    }
  }
}
