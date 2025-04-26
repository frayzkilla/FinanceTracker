import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { readFile } from 'fs/promises';
import { join } from 'path';
import * as Papa from 'papaparse';

@Injectable()
export class StocksService {
  private readonly apiKey = 'J4ETZSKJ2DM6PW9C';
  private stocksList: { code: string; name: string }[] = [];

  constructor() {
    this.loadStocksCsv();
  }

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

  async loadStocksCsv() {
    const filePath = join(__dirname, '..', '..', 'src', 'assets', 'digital_currency_list.csv');
    const fileContent = await readFile(filePath, 'utf-8');
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    this.stocksList = parsed.data.map((row: any) => ({
      code: row['currency code'],
      name: row['currency name'],
    }));
  }

  getStocksList() {
    return this.stocksList;
  }
  
}
