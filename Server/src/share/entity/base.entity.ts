import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
  @ApiProperty({
    example: '792b9eec-1450-437d-9e9d-f220bf335336',
    description: 'Entity unique identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
