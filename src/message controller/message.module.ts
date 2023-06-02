import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ProviderModule } from '../provider module/provider.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [ProviderModule,PrismaModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}