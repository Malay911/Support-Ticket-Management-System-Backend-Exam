import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { TicketStatus } from './entities/ticket.entity';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService){}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.MANAGER)
  create(@Body() dto:CreateTicketDto,@Request() req) {
    return this.ticketsService.create(dto,req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    const {role,userId}=req.user;
    if (role===Role.MANAGER) return this.ticketsService.findAll();
    if (role===Role.SUPPORT) return this.ticketsService.findByAssignee(userId);
    return this.ticketsService.findByUser(userId);
  }

  @Patch(':id/assign')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.SUPPORT)
  assign(@Param('id') id: string, @Body('userId') userId: number) {
    return this.ticketsService.assign(+id, +userId);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.SUPPORT)
  changeStatus(
    @Param('id') id: string,
    @Body('status') status: TicketStatus,
    @Request() req,
  ) {
    return this.ticketsService.changeStatus(+id, status, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
