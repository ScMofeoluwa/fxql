import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'maxStatements', async: false })
export class MaxStatementsConstraint implements ValidatorConstraintInterface {
  validate(value: string, args?: ValidationArguments): boolean {
    if (!value) return false;
    const statements = value.split('\\n\\n');
    return statements.length <= 1000;
  }

  defaultMessage(args?: ValidationArguments): string {
    return 'Maximum 1000 currency pairs exceeded';
  }
}

export class FxqlRequestDto {
  @ApiProperty({
    description: 'FXQL statement string',
    example: 'USD-GBP {\\n BUY 0.85\\n SELL 0.90\\n CAP 10000\\n}',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(MaxStatementsConstraint)
  FXQL: string;
}
