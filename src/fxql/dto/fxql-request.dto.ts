import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class FxqlRequestDto {
  @ApiProperty({
    description: 'FXQL statement string',
    example: 'USD-GBP {\\n BUY 0.85\\n SELL 0.90\\n CAP 10000\\n}',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  FXQL: string;
}
