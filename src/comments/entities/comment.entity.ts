import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('ticket_comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>Ticket,{onDelete:'CASCADE'})
  @JoinColumn({name:'ticket_id'})
  ticket:Ticket;

  @ManyToOne(()=>User)
  @JoinColumn({name:'user_id'})
  user:User;

  @Column('text')
  comment:string;

  @CreateDateColumn()
  created_at:Date;
}
