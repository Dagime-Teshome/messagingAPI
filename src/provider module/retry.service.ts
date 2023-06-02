import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Message } from '@prisma/client';
import { MessageService } from '../message controller/message.service';


@Injectable()
export class RetryService {
    constructor(private readonly prismaService: PrismaService,private messageService :MessageService){
        
    }

    async getMessages(){
        const Pend_messages = await this.prismaService.message.findMany({
            where:{
                status:'PENDING'
            }
        })
        this.sendToProvider(Pend_messages)
    }
    
     async sendToProvider(messages:Message[]){
        for (const message of messages) {
           await this.messageService.CheckProvider(message);
        }
    }

}