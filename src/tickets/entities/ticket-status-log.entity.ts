import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ticket, TicketStatus } from './ticket.entity';

@Entity('ticket_status_logs')
export class TicketStatusLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticket, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({ type: 'enum', enum: TicketStatus })
  old_status: TicketStatus;

  @Column({ type: 'enum', enum: TicketStatus })
  new_status: TicketStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changed_by' })
  changedBy: User;

  @CreateDateColumn()
  changed_at: Date;
}
