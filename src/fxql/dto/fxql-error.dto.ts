import { ApiProperty } from '@nestjs/swagger';

export class FxqlErrorDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Invalid currency code at line 1, column 5',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'FXQL-400',
    type: String,
  })
  code: string;

  constructor(partial: Partial<FxqlErrorDto>) {
    Object.assign(this, partial);
  }
}
