import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'Created user',
    type: User,
    isArray: false,
  })
  @Post()
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOkResponse({
    description: 'List of Users',
    type: User,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOkResponse({
    description: 'User details',
    type: User,
    isArray: false,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOkResponse({
    description: 'Updated user',
    type: User,
    isArray: false,
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.usersService.update(+id, userDto);
  }

  @ApiNoContentResponse({
    description: 'User deleted',
  })
  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
