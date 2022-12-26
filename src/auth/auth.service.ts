import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signin(dto: AuthDto) {
    try {
      let user =
        await this.prisma.user.findUnique({
          where: {
            email: dto.email,
          },
        });

      if (!user) {
        return {
          code: 400,
          message: 'Invalid credentials',
        };
      }

      const isPasswordValid = await argon.verify(
        user.password,
        dto.password,
      );

      if (!isPasswordValid) {
        return {
          code: 400,
          message: 'Invalid credentials',
        };
      }

      delete user.password;

      const token = await this.sign_token(
        user.id,
        user.email,
      );

      return {
        code: 200,
        message:
          'You have successfully signed in',
        token,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'Something went wrong',
      };
    }
  }

  // here dto is data transfer object
  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          first_name: dto.first_name,
          last_name: dto.last_name,
        },
      });

      let token = await this.sign_token(
        user.id,
        user.email,
      );
      return {
        code: 200,
        message:
          'You have successfully signed up',
        token,
      };
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          return {
            code: 400,
            message: 'User already exists',
          };
        }
      }
      return {
        code: 500,
        message: 'Something went wrong',
      };
    }
  }

  async sign_token(
    user_id: number,
    email: string,
  ) {
    const payload = {
      user_id,
      email,
    };

    return this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '1d',
    });
  }
}
