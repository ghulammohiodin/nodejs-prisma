import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class BookMarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
