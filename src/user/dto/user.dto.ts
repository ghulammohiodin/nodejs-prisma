import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
