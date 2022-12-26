import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  get_my_profile(@GetUser() user: User) {
    return user;
  }
  @UseGuards(JwtGuard)
  @Patch('edit_profile')
  edit_my_profile(
    @GetUser('id') user_id: number,
    @Body() dto: UserDto,
  ) {
    return this.userService.edit_my_profile(
      user_id,
      dto,
    );
  }
}
