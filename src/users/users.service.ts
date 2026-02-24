import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const bcrypt = require('bcrypt');
import { User } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
  ) { }

  async create(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);
    const role = await this.roleRepo.findOne({ where: { name: data.role } });
    if (!role) throw new NotFoundException('Role not found');
    const user = this.repo.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: role,
    });
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findAll() {
    return this.repo.find();
  }
}