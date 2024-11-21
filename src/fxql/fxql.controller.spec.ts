import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { FxqlController } from './fxql.controller';
import { FxqlService } from './fxql.service';
import { FxqlRequestDto } from './dto/fxql-request.dto';
import { FxqlResponseDto } from './dto/fxql-response.dto';

describe('FxqlController', () => {
  let controller: FxqlController;
  let service: jest.Mocked<FxqlService>;
  let loggerSpy: jest.SpyInstance;

  const mockFxqlService = {
    parseFxql: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FxqlController],
      providers: [
        {
          provide: FxqlService,
          useValue: mockFxqlService,
        },
      ],
    }).compile();

    controller = module.get<FxqlController>(FxqlController);
    service = module.get(FxqlService);

    loggerSpy = jest.spyOn(Logger.prototype, 'log');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseFxqlStatement', () => {
    it('should successfully parse a valid FXQL statement', async () => {
      const mockRequest: FxqlRequestDto = {
        FXQL: 'USD-GBP {\\n BUY 1.25\\n SELL 1.27\\n CAP 1000000\\n}',
      };

      const mockParsedEntries = [
        {
          entryId: 1,
          sourceCurrency: 'USD',
          destinationCurrency: 'GBP',
          buyPrice: 1.25,
          sellPrice: 1.27,
          capAmount: 1000000,
        },
      ];

      mockFxqlService.parseFxql.mockResolvedValueOnce(mockParsedEntries);

      const result: FxqlResponseDto = await controller.parseFxqlStatement(
        mockRequest,
      );

      expect(result).toEqual({
        message: 'FXQL statement parsed successfully',
        code: 'FXQL-200',
        data: mockParsedEntries,
      });

      expect(service.parseFxql).toHaveBeenCalledWith(mockRequest.FXQL);
      expect(service.parseFxql).toHaveBeenCalledTimes(1);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Parsing FXQL statement: ${mockRequest.FXQL}`,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Successfully parsed FXQL statement. Entries count: 1',
      );
    });

    it('should handle multiple currency pairs', async () => {
      const mockRequest: FxqlRequestDto = {
        FXQL: 'USD-GBP {\\n BUY 1.25\\n SELL 1.27\\n CAP 1000000\\n}\\n\\nEUR-USD {\\n BUY 1.10\\n SELL 1.12\\n CAP 2000000\\n}',
      };

      const mockParsedEntries = [
        {
          entryId: 1,
          sourceCurrency: 'USD',
          destinationCurrency: 'GBP',
          buyPrice: 1.25,
          sellPrice: 1.27,
          capAmount: 1000000,
        },
        {
          entryId: 2,
          sourceCurrency: 'EUR',
          destinationCurrency: 'USD',
          buyPrice: 1.1,
          sellPrice: 1.12,
          capAmount: 2000000,
        },
      ];

      mockFxqlService.parseFxql.mockResolvedValueOnce(mockParsedEntries);

      const result: FxqlResponseDto = await controller.parseFxqlStatement(
        mockRequest,
      );

      expect(result).toEqual({
        message: 'FXQL statement parsed successfully',
        code: 'FXQL-200',
        data: mockParsedEntries,
      });

      expect(service.parseFxql).toHaveBeenCalledWith(mockRequest.FXQL);
      expect(service.parseFxql).toHaveBeenCalledTimes(1);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Parsing FXQL statement: ${mockRequest.FXQL}`,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Successfully parsed FXQL statement. Entries count: 2',
      );
    });

    it('should propagate service errors', async () => {
      const mockRequest: FxqlRequestDto = {
        FXQL: 'invalid-statement',
      };

      const errorMessage = 'Invalid FXQL syntax';
      mockFxqlService.parseFxql.mockRejectedValueOnce(new Error(errorMessage));

      await expect(controller.parseFxqlStatement(mockRequest)).rejects.toThrow(
        errorMessage,
      );

      expect(service.parseFxql).toHaveBeenCalledWith(mockRequest.FXQL);
      expect(loggerSpy).toHaveBeenCalledWith(
        'Parsing FXQL statement: invalid-statement',
      );
    });
  });
});
