import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException('User not found', 404);
      }

      throw error;
    }
  }

  async create(user: UserDto): Promise<User> {
    return await this.userRepository.save(user);
  }

  async update(id: number, user: UserDto): Promise<void> {
    try {
      await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException('User not found', 404);
      }

      throw error;
    }

    await this.userRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
