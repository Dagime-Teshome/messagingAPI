import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { MessageModel } from './models';
import { PrismaService } from '../../prisma/prisma.service';
import { MessageService } from './message.service';
import { RetryService } from '../provider module/retry.service';
import { Subject } from 'rxjs';

@Controller()
export class MessageController {
  constructor(private readonly prismaService: PrismaService,private messageService : MessageService,private retryService: RetryService) {}

  @Post('message')
  async sendToProvider(@Body() req:MessageModel){
   

    try {
      const res = await this.prismaService.message.create({
        data:{
          providerId:req.providerId,
          to:req.to,
          from:req.from,
          content:req.content,
          type:req.type,
          subject:req.subject
        }
       });

       return await this.messageService.CheckProvider(res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    
  }

  @Get('retry')
  async RetryCall(){
    this.retryService.getMessages();
  }

  
}
