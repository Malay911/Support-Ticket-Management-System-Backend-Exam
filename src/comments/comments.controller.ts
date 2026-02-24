import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class CommentsController{
  constructor(private readonly commentsService: CommentsService) { }

  @Post('tickets/:ticketId/comments')
  addComment(
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.addComment(+ticketId, req.user.userId, req.user.role, dto.comment);
  }

  @Get('tickets/:ticketId/comments')
  getComments(@Param('ticketId') ticketId: string, @Request() req) {
    return this.commentsService.getComments(+ticketId, req.user.userId, req.user.role);
  }

  @Patch('comments/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto, @Request() req) {
    return this.commentsService.update(+id, req.user.userId, req.user.role, dto.comment);
  }

  @Delete('comments/:id')
  @HttpCode(204)
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(+id, req.user.userId, req.user.role);
  }
}
