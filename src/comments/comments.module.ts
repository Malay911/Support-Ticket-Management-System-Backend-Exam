import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Ticket } from '../tickets/entities/ticket.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Comment, Ticket])],
  controllers:[CommentsController],
  providers:[CommentsService],
})
export class CommentsModule {}
