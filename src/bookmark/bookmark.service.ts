import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookMarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisam: PrismaService) {}
  async create_bookmark(
    user_id: number,
    dto: BookMarkDto,
  ) {
    try {
      const book_mark =
        await this.prisam.bookMark.create({
          data: {
            ...dto,
            user: {
              connect: {
                id: user_id,
              },
            },
          },
        });

      return {
        code: 200,
        message: 'Bookmark created successfully',
        book_mark,
      };
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          return {
            code: 400,
            message: 'Bookmark already exists',
          };
        }
      }
      return {
        code: 500,
        message: 'Something went wrong',
      };
    }
  }

  async get_bookmarks(user_id: number) {
    try {
      const bookmarks =
        await this.prisam.bookMark.findMany({
          where: {
            user_id,
          },
        });

      return {
        code: 200,
        message: 'Bookmarks fetched successfully',
        bookmarks,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'Something went wrong',
      };
    }
  }

  async delete_bookmark(
    bookmark_id: number,
    user_id: number,
  ) {
    try {
      const bookmark =
        await this.prisam.bookMark.findFirst({
          where: {
            id: bookmark_id,
            user_id,
          },
        });

      !bookmark && {
        code: 400,
        message: 'Bookmark not found',
      };

      await this.prisam.bookMark.delete({
        where: {
          id: bookmark_id,
        },
      });

      return {
        code: 200,
        message: 'Bookmark deleted successfully',
        bookmark,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'Something went wrong',
      };
    }
  }

  async edit_bookmark(
    id: number,
    user_id: number,
    dto: BookMarkDto,
  ) {
    try {
      const bookmark =
        await this.prisam.bookMark.findFirst({
          where: {
            id,
            user_id,
          },
        });

      !bookmark && {
        code: 400,
        message: 'Bookmark not found',
      };

      await this.prisam.bookMark.update({
        where: {
          id,
        },

        data: {
          ...dto,
        },
      });

      return {
        code: 200,
        message: 'Bookmark updated successfully',
        bookmark,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'Something went wrong',
      };
    }
  }

  async get_all_bookmarks() {
    try {
      const bookmarks =
        await this.prisam.bookMark.findMany({
          // donot return password
          select: {
            id: true,
            title: true,
            url: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
          },
        });

      return {
        code: 200,
        message: 'Bookmarks fetched successfully',
        bookmarks,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'Something went wrong',
      };
    }
  }
}
