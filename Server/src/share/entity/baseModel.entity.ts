import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { BaseEntity } from './base.entity';

export class BaseModelEntity extends BaseEntity {
  @ApiProperty({
    example: new Date().toDateString(),
    description: 'Entity create date',
  })
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({
    example: new Date().toDateString(),
    description: 'Entity update date',
  })
  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
