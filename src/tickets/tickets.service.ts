import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { TicketStatusLog } from './entities/ticket-status-log.entity';
import { UsersService } from '../users/users.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private repo: Repository<Ticket>,
    @InjectRepository(TicketStatusLog)
    private logRepo: Repository<TicketStatusLog>,
    private usersService: UsersService,
  ) { }

  async create(dto: CreateTicketDto, userId: number) {
    const ticket = this.repo.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      createdBy: { id: userId } as any,
    });
    const saved = await this.repo.save(ticket);
    return this.findOne(saved.id);
  }

  findAll() {
    return this.repo.find({ relations: ['createdBy', 'assignedTo'] });
  }

  findByUser(userId: number) {
    return this.repo.find({
      where: { createdBy: { id: userId } },
      relations: ['createdBy', 'assignedTo'],
    });
  }

  findByAssignee(userId: number) {
    return this.repo.find({
      where: { assignedTo: { id: userId } },
      relations: ['createdBy', 'assignedTo'],
    });
  }

  async findOne(id: number) {
    const ticket = await this.repo.findOne({ where: { id }, relations: ['createdBy', 'assignedTo'] });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async assign(ticketId: number, assigneeId: number) {
    const ticket = await this.findOne(ticketId);
    const assignee = await this.usersService.findOne(assigneeId);
    if (assignee.role.name === Role.USER) {
      throw new BadRequestException('Cannot assign ticket to a USER role');
    }
    ticket.assignedTo = assignee;
    return this.repo.save(ticket);
  }

  async changeStatus(ticketId: number, newStatus: TicketStatus, changedById: number) {
    const ticket = await this.findOne(ticketId);

    const log = this.logRepo.create({
      ticket: { id: ticketId } as any,
      old_status: ticket.status,
      new_status: newStatus,
      changedBy: { id: changedById } as any,
    });
    await this.logRepo.save(log);

    ticket.status = newStatus;
    const saved = await this.repo.save(ticket);
    return this.findOne(saved.id);
  }

  async remove(id: number) {
    const ticket = await this.findOne(id);
    await this.repo.remove(ticket);
  }
}