import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class CommentsService{
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
  ){}

  private async getTicket(ticketId: number):Promise<Ticket>{
    const ticket = await this.ticketRepo.findOne({
      where: {id:ticketId},
      relations:['createdBy','assignedTo'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  private checkTicketAccess(ticket:Ticket,userId:number,role:Role):void{
    if(role===Role.MANAGER) return;
    if(role===Role.SUPPORT && ticket.assignedTo?.id===userId) return;
    if(role===Role.USER && ticket.createdBy?.id===userId) return;
    throw new ForbiddenException('You do not have access to this ticket');
  }

  async addComment(ticketId:number,userId:number,role:Role,text:string) {
    const ticket = await this.getTicket(ticketId);
    this.checkTicketAccess(ticket,userId,role);
    const comment=this.commentRepo.create({
      ticket:{id:ticketId} as any,
      user:{id:userId} as any,
      comment:text,
    });
    const saved=await this.commentRepo.save(comment);
    return this.commentRepo.findOne({
      where:{id:saved.id},
      relations:['user'],
    });
  }

  async getComments(ticketId:number,userId:number,role:Role) {
    const ticket = await this.getTicket(ticketId);
    this.checkTicketAccess(ticket,userId,role);
    return this.commentRepo.find({
      where:{ticket:{id:ticketId}},
      relations:['user'],
    });
  }

  async update(commentId:number,userId:number,role:Role,text:string) {
    const comment=await this.commentRepo.findOne({
      where:{id:commentId},
      relations:['user'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (role!==Role.MANAGER && comment.user.id!==userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }
    comment.comment=text;
    return this.commentRepo.save(comment);
  }

  async remove(commentId:number,userId:number,role:Role) {
    const comment=await this.commentRepo.findOne({
      where:{id:commentId},
      relations:['user'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (role==Role.MANAGER && comment.user.id!==userId){
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.commentRepo.remove(comment);
  }
}
