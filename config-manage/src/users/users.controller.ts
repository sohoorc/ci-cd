import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UsePipes(new ValidationPipe())
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() login: LoginUserDto) {
    return this.usersService.login(login)
  }

  @Get('getUserInfo/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post('update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Post('delete')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
