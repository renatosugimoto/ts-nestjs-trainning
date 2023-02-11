import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { faker } from '@faker-js/faker';
import { UserDto } from './dto/user.dto';
import { describe } from 'node:test';
import { User } from './entities/user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

function generateRandomUserDto(): UserDto {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

const mockRepository = {
  find: jest.fn(),
  findOneByOrFail: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should call save() with userDto ', async () => {
      const userDto = generateRandomUserDto();
      await service.create(userDto);
      expect(mockRepository.save).toHaveBeenCalledWith(userDto);
    });
  });

  describe('findAll', () => {
    it('should call find() ', async () => {
      await service.findAll();
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call findOneOrFail() with id ', async () => {
      const id = faker.datatype.number();
      await service.findOne(id);
      expect(mockRepository.findOneByOrFail).toHaveBeenCalledWith({ id });
    });

    it('should throw an error if user is not found', async () => {
      const id = faker.datatype.number();
      mockRepository.findOneByOrFail.mockRejectedValueOnce(
        new EntityNotFoundError(User, id),
      );
      await expect(service.findOne(id)).rejects.toThrow(HttpException);
    });

    it('should throw the same error if it is not an EntityNotFoundError', async () => {
      const id = faker.datatype.number();
      mockRepository.findOneByOrFail.mockRejectedValueOnce(new Error());
      await expect(service.findOne(id)).rejects.toThrow(Error);
    });
  });

  describe('update', () => {
    it('should throw an error if user is not found', async () => {
      const id = faker.datatype.number();
      const userDto = generateRandomUserDto();
      mockRepository.findOneByOrFail.mockRejectedValueOnce(
        new EntityNotFoundError(User, id),
      );
      await expect(service.update(id, userDto)).rejects.toThrow(HttpException);
    });

    it('should throw the same error if it is not an EntityNotFoundError', async () => {
      const id = faker.datatype.number();
      const userDto = generateRandomUserDto();
      mockRepository.findOneByOrFail.mockRejectedValueOnce(new Error());
      await expect(service.update(id, userDto)).rejects.toThrow(Error);
    });

    it('should call update() with id and userDto ', async () => {
      const id = faker.datatype.number();
      const userDto = generateRandomUserDto();
      await service.update(id, userDto);
      expect(mockRepository.update).toHaveBeenCalledWith(id, userDto);
    });
  });

  describe('delete', () => {
    it('should call delete() with id ', async () => {
      const id = faker.datatype.number();
      await service.delete(id);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
