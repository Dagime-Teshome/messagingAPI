import { Module } from '@nestjs/common';
import { MessageModule } from './message controller/message.module';
import { ProviderModule } from './provider module/provider.module';
import { TelegramService } from './provider module/telegram.service';
import { PrismaModule } from '../prisma/prisma.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [MessageModule,ProviderModule,PrismaModule],
  controllers: [],
  providers: [PrismaModule,{
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  },],
})
export class AppModule {

}
