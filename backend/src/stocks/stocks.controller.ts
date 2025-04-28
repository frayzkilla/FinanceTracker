import { Body, Controller, Post, Query } from '@nestjs/common';
import { Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from 'src/dto/create-stock.dto';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stockService: StocksService) {}

  @Get('price')
  async getPrice(@Query('ticker') ticker: string): Promise<{ ticker: string; price: string }> {
    const price = await this.stockService.getStockPrice(ticker);
    return { ticker, price };
  }

  @Get('getstockslist')
  async getStocksList(): Promise<{ code: string; name: string }[]> {
    try {
      return this.stockService.getStocksList();
    } catch (error) {
      throw new HttpException('Error loading stocks list', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('createuserstock')
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.createUserStock(createStockDto);
  }
}