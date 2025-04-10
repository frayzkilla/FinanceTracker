import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class StocksService {
  private readonly apiKey = 'J4ETZSKJ2DM6PW9C';

  async getStockPrice(ticker: string): Promise<string> {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${this.apiKey}`;
      const response = await axios.get(url);
      const price = response.data['Global Quote']?.['05. price'];
      if (!price) {
        throw new Error('Price not found');
      }
      return price;
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении цены актива');
    }
  }
}
