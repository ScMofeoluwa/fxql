import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { FxqlService } from './fxql.service';
import { PrismaService } from '../../prisma/prisma.service';
import { FxqlEntry } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('FxqlService', () => {
  let service: FxqlService;
  const mockPrismaService = {
    fxqlEntry: {
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FxqlService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FxqlService>(FxqlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseFxql', () => {
    it('should successfully parse a valid FXQL statement', async () => {
      const input = 'USD-GBP {\\n BUY 1.25\\n SELL 1.27\\n CAP 1000000\\n}';
      const mockEntry: FxqlEntry = {
        entryId: 1,
        sourceCurrency: 'USD',
        destinationCurrency: 'GBP',
        buyPrice: new Decimal(1.25),
        sellPrice: new Decimal(1.27),
        capAmount: new Decimal(1000000),
        updatedAt: new Date(),
      };

      mockPrismaService.fxqlEntry.upsert.mockResolvedValueOnce(mockEntry);

      const result = await service.parseFxql(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        entryId: 1,
        sourceCurrency: 'USD',
        destinationCurrency: 'GBP',
        buyPrice: 1.25,
        sellPrice: 1.27,
        capAmount: 1000000,
      });
    });

    it('should handle multiple currency pairs', async () => {
      const input =
        'USD-GBP {\\n BUY 1.25\\n SELL 1.27\\n CAP 1000000\\n}\\n\\nEUR-USD {\\n BUY 1.10\\n SELL 1.12\\n CAP 2000000\\n}';

      const mockEntries: FxqlEntry[] = [
        {
          entryId: 1,
          sourceCurrency: 'USD',
          destinationCurrency: 'GBP',
          buyPrice: new Decimal(1.25),
          sellPrice: new Decimal(1.27),
          capAmount: new Decimal(1000000),
          updatedAt: new Date(),
        },
        {
          entryId: 2,
          sourceCurrency: 'EUR',
          destinationCurrency: 'USD',
          buyPrice: new Decimal(1.1),
          sellPrice: new Decimal(1.12),
          capAmount: new Decimal(2000000),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.fxqlEntry.upsert
        .mockResolvedValueOnce(mockEntries[0])
        .mockResolvedValueOnce(mockEntries[1]);

      const result = await service.parseFxql(input);

      expect(result).toHaveLength(2);
      expect(mockPrismaService.fxqlEntry.upsert).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException when exceeding 1000 statements', async () => {
      const statements = Array(1001)
        .fill('USD-GBP {\\n BUY 1.25\\n SELL 1.27\\n CAP 1000000\\n}')
        .join('\\n\\n');

      await expect(service.parseFxql(statements)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.parseFxql(statements)).rejects.toThrow(
        'Maximum 1000 currency pairs exceeded',
      );
    });

    it('should handle syntax errors in FXQL statements', async () => {
      const invalidInput =
        'USD-GBP {\\n buy invalid\\n sell 1.27\\n cap 1000000\\n}';

      await expect(service.parseFxql(invalidInput)).rejects.toThrow(
        'Parsing error',
      );
    });

    it('should update existing entries with new values', async () => {
      const input = 'USD-GBP {\\n BUY 1.30\\n SELL 1.32\\n CAP 1500000\\n}';
      const mockEntry: FxqlEntry = {
        entryId: 1,
        sourceCurrency: 'USD',
        destinationCurrency: 'GBP',
        buyPrice: new Decimal(1.3),
        sellPrice: new Decimal(1.32),
        capAmount: new Decimal(1500000),
        updatedAt: new Date(),
      };

      mockPrismaService.fxqlEntry.upsert.mockResolvedValueOnce(mockEntry);

      await service.parseFxql(input);

      expect(mockPrismaService.fxqlEntry.upsert).toHaveBeenCalledWith({
        where: {
          sourceCurrency_destinationCurrency: {
            sourceCurrency: 'USD',
            destinationCurrency: 'GBP',
          },
        },
        update: {
          sourceCurrency: 'USD',
          destinationCurrency: 'GBP',
          buyPrice: 1.3,
          sellPrice: 1.32,
          capAmount: 1500000,
        },
        create: {
          sourceCurrency: 'USD',
          destinationCurrency: 'GBP',
          buyPrice: 1.3,
          sellPrice: 1.32,
          capAmount: 1500000,
        },
      });
    });
  });
});
