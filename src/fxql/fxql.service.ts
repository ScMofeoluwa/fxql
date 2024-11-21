import { Injectable, BadRequestException } from '@nestjs/common';
import * as nearley from 'nearley';
import { PrismaService } from '../../prisma/prisma.service';
import grammar from './parser/fxql.parser';
import { FxqlEntry } from '@prisma/client';

@Injectable()
export class FxqlService {
  constructor(private readonly prisma: PrismaService) {}

  async parseFxql(input: string) {
    const statements = input.split('\\n\\n');

    const parsedStatements = await Promise.all(
      statements.map((statement) => this.parseStatement(statement)),
    );

    const latestEntries = new Map<
      string,
      Omit<FxqlEntry, 'entryId' | 'updatedAt'>
    >();
    for (const entry of parsedStatements) {
      const key = `${entry.sourceCurrency}-${entry.destinationCurrency}`;
      // @ts-expect-error: Temporarily ignoring type error due to dynamic type conversion
      latestEntries.set(key, entry);
    }

    const savedEntries: FxqlEntry[] = [];
    for (const entry of latestEntries.values()) {
      const savedEntry = await this.prisma.fxqlEntry.upsert({
        where: {
          sourceCurrency_destinationCurrency: {
            sourceCurrency: entry.sourceCurrency,
            destinationCurrency: entry.destinationCurrency,
          },
        },
        update: entry,
        create: entry,
      });

      savedEntries.push(savedEntry);
    }
    return savedEntries.map(
      ({ updatedAt, buyPrice, sellPrice, capAmount, ...entry }) => ({
        ...entry,
        buyPrice: parseFloat(buyPrice.toString()),
        sellPrice: parseFloat(sellPrice.toString()),
        capAmount: parseInt(capAmount.toString()),
      }),
    );
  }

  private async parseStatement(statement: string) {
    try {
      statement = statement.replace(/\\n/g, '\n');
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(statement);

      if (parser.results.length === 0) {
        throw new BadRequestException('Parsing failed: no valid parse found');
      }
      const result = parser.results[0];
      return {
        sourceCurrency: result.sourceCurrency,
        destinationCurrency: result.destinationCurrency,
        buyPrice: parseFloat(result.buyPrice),
        sellPrice: parseFloat(result.sellPrice),
        capAmount: parseInt(result.capAmount),
      };
    } catch (error: any) {
      let errorMessage = 'Parsing error';

      if (error.offset !== undefined) {
        const lines = statement.slice(0, error.offset).split('\n');
        const errorLine = lines.length;
        const errorColumn = lines[lines.length - 1].length + 1;

        errorMessage = `Syntax error in FXQL Statement:
          - Line: ${errorLine}
          - Column: ${errorColumn}
          - Details: ${errorMessage}

          Possible issues:
          - Ensure correct currency pair format (e.g. USD-GBP)
          - Check for missing or extra space`;
      }

      throw new Error(errorMessage);
    }
  }
}
