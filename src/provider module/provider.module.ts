import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { TelegramService } from './telegram.service';
import { EmailService } from './email.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RetryService } from './retry.service';
import { MessageService } from '../message controller/message.service';

@Module({
  providers: [TelegramService,SlackService,EmailService,RetryService,MessageService],
  exports:[TelegramService,SlackService,EmailService,RetryService],
  imports:[PrismaModule]
})
export class ProviderModule {
  
}
