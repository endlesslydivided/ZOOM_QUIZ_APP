import { ApiProperty } from '@nestjs/swagger';
import { DeleteDateColumn } from 'typeorm';

import { BaseModelEntity } from './baseModel.entity';

export class SoftModelEntity extends BaseModelEntity {
  @ApiProperty({
    example: new Date().toDateString(),
    description: 'Entity soft delete date',
  })
  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt?: Date;
}
