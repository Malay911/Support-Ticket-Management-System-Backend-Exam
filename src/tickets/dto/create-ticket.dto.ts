import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Priority } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
