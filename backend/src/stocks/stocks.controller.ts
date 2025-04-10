import { Controller, Query } from '@nestjs/common';
import { Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stockService: StocksService) {}

  @Get('price')
  async getPrice(@Query('ticker') ticker: string): Promise<{ ticker: string; price: string }> {
    const price = await this.stockService.getStockPrice(ticker);
    return { ticker, price };
  }
}