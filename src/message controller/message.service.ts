import { EmailService } from './../provider module/email.service';
import { Injectable } from '@nestjs/common';
import { MessageModel } from './models';
import { TelegramService } from '../provider module/telegram.service';
import { SlackService } from '../provider module/slack.service';
import { Message } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private telegramService:TelegramService,private slackService:SlackService,private emailService:EmailService,private readonly prismaService: PrismaService){

  }

  async CheckProvider(message: Message): Promise<Message> {
    try {
      
      switch(message.providerId){
        case 1 :{
             await this.telegramService.send(message);
            break;
        }
        case 2 :{
           await this.telegramService.send(message);
          break;
        }
        case 3 :{
           await this.emailService.send(message);
          break;
        }
        case 4 :{
           await this.slackService.send(message);
          break;
        }
        default : {
          throw new Error("no such provider");
        }
      }
        
        return await this.prismaService.message.update({
          where:{
            id:message.id,
          },
          data:{
            status:"SENT"
          }

        })
    } catch (err) {
      return await this.prismaService.message.update({
        where:{
          id:message.id,
        },
        data:{
          status: message.retryCount >= Number(process.env.MAX_RETRY_ATTEMPTS )? "FAILED":undefined,
          retryCount:{increment:1},
          errorMessage:err.message,
        }
      })
    }
  }
}

