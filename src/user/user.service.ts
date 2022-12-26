import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {} // private readonly config: ConfigService, // private readonly jwtService: JwtService, // private readonly prisma: PrismaService,

  async edit_my_profile(
    id: number,
    dto: UserDto,
  ) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    delete user.password;

    return user;
  }
}
