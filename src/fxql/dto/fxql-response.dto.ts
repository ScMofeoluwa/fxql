import { ApiProperty } from '@nestjs/swagger';

export class FxqlEntryDto {
  @ApiProperty({
    description: 'Unique identifier for the FXQL entry',
    example: 192,
    type: Number,
  })
  entryId: number;

  @ApiProperty({
    description: 'Source currency code',
    example: 'USD',
    type: String,
    minLength: 3,
    maxLength: 3,
  })
  sourceCurrency: string;

  @ApiProperty({
    description: 'Destination currency code',
    example: 'GBP',
    type: String,
    minLength: 3,
    maxLength: 3,
  })
  destinationCurrency: string;

  @ApiProperty({
    description: 'Buy price in destination currency',
    example: 0.85,
    type: Number,
  })
  buyPrice: number;

  @ApiProperty({
    description: 'Sell price in destination currency',
    example: 0.9,
    type: Number,
  })
  sellPrice: number;

  @ApiProperty({
    description: 'Maximum transaction amount in source currency',
    example: 10000,
    type: Number,
  })
  capAmount: number;

  constructor(partial: Partial<FxqlEntryDto>) {
    Object.assign(this, partial);
  }
}

export class FxqlResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'FXQL Statement Parsed Successfully.',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Response code',
    example: 'FXQL-200',
    type: String,
  })
  code: string;

  @ApiProperty({
    description: 'Parsed FXQL entries',
    type: [FxqlEntryDto],
  })
  data: FxqlEntryDto[];

  constructor(partial: Partial<FxqlResponseDto>) {
    Object.assign(this, partial);
  }
}
