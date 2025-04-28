import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from 'src/dto/create-stock.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { console } from 'inspector';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stockService: StocksService) {}

  @Get('price')
  async getPrice(
    @Query('ticker') ticker: string,
  ): Promise<{ ticker: string; price: string }> {
    const price = await this.stockService.getStockPrice(ticker);
    return { ticker, price };
  }

  @Get('getstockslist')
  async getStocksList(): Promise<{ code: string; name: string }[]> {
    try {
      return this.stockService.getStocksList();
    } catch (error) {
      throw new HttpException(
        'Error loading stocks list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('createuserstock')
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.createUserStock(createStockDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('userstocks')
  async getUserStocks(@Req() req: Request) {
    console.log('Request', req);
    console.log('Request user:', req.user);
    console.log('User ID:', req.user['sub']);
    const userId = req.user['sub']; 
    return this.stockService.getStocksByUser(userId);
  }
}
