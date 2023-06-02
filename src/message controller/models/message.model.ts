import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const MessageModelSchema = z.object({
  providerId: z.number(), 
  to: z.string(),
  type: z.string().optional(),
  from: z.string().optional(),
  content: z.string(),
  subject: z.string().optional(),
})

// class is required for using DTO as a type
export class MessageModel extends createZodDto(MessageModelSchema) {}


