import { PartialType } from '@nestjs/mapped-types';
import { CreateNichoDto } from './create-nicho.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsInt } from 'class-validator';

export class UpdateNichoDto extends PartialType(CreateNichoDto) {
  @ApiProperty({ example: 10, description: 'ID del nicho que se va a actualizar' })
  @IsInt()
  @IsNotEmpty()
  idNicho: number;
}
