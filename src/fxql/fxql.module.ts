import { Module } from '@nestjs/common';
import { FxqlController } from './fxql.controller';
import { FxqlService } from './fxql.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [FxqlController],
  providers: [FxqlService, PrismaService],
})
export class FxqlModule {}
