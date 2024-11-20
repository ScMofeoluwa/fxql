import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseFilters,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FxqlService } from './fxql.service';
import { FxqlRequestDto } from './dto/fxql-request.dto';
import { FxqlResponseDto } from './dto/fxql-response.dto';
import { FxqlErrorDto } from './dto/fxql-error.dto';
import { FxqlExceptionFilter } from './filters/fxql-exception.filter';

@ApiTags('FXQL')
@Controller('fxql')
@UseFilters(FxqlExceptionFilter)
export class FxqlController {
  private readonly logger = new Logger(FxqlController.name);
  constructor(private readonly service: FxqlService) {}

  @Post('statements')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Parse FXQL statement' })
  @ApiResponse({
    status: 200,
    description: 'FXQL statement parsed successfully',
    type: FxqlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid FXQL statement',
    type: FxqlErrorDto,
  })
  async parseFxqlStatement(
    @Body() fxqlStatementDTO: FxqlRequestDto,
  ): Promise<FxqlResponseDto> {
    this.logger.log(`Parsing FXQL statement: ${fxqlStatementDTO.FXQL}`);
    const entries = await this.service.parseFxql(fxqlStatementDTO.FXQL);

    this.logger.log(
      `Successfully parsed FXQL statement. Entries count: ${entries.length}`,
    );

    return {
      message: 'FXQL statement parsed successfully',
      code: 'FXQL-200',
      data: entries,
    };
  }
}
