import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { BookMarkDto } from './dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService,
  ) {}
  @UseGuards(JwtGuard)
  @Post('create_bookmark')
  async create_bookmark(
    @GetUser('id') user_id: number,
    @Body() dto: BookMarkDto,
  ) {
    return this.bookmarkService.create_bookmark(
      user_id,
      dto,
    );
  }

  @UseGuards(JwtGuard)
  @Get('get_bookmarks')
  async get_bookmarks(
    @GetUser('id') user_id: number,
  ) {
    return this.bookmarkService.get_bookmarks(
      user_id,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('delete_bookmark/:id')
  async delete_bookmark(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') user_id: number,
  ) {
    return this.bookmarkService.delete_bookmark(
      id,
      user_id,
    );
  }

  @UseGuards(JwtGuard)
  @Patch('edit_bookmark/:id')
  async get_bookmark(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') user_id: number,
    @Body() dto: BookMarkDto,
  ) {
    return this.bookmarkService.edit_bookmark(
      id,
      user_id,
      dto,
    );
  }

  @Get('get_all_bookmarks')
  async get_all_bookmarks() {
    return this.bookmarkService.get_all_bookmarks();
  }
}
