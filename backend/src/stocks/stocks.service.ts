import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { readFile } from 'fs/promises';
import { join } from 'path';
import * as Papa from 'papaparse';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateStockDto } from 'src/dto/create-stock.dto';

@Injectable()
export class StocksService {
  private readonly apiKey = 'J4ETZSKJ2DM6PW9C';
  private stocksList: { code: string; name: string }[] = [];

  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
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
      throw new InternalServerErrorException(
        'Ошибка при получении цены актива',
      );
    }
  }

  async loadStocksCsv() {
    const filePath = join(
      __dirname,
      '..',
      '..',
      'src',
      'assets',
      'digital_currency_list.csv',
    );
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

  async createUserStock(createStockDto: CreateStockDto): Promise<Stock> {
    const { userId, code, amount } = createStockDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const stock = this.stockRepository.create({
      code,
      amount,
      owner: user,
    });

    return await this.stockRepository.save(stock);
  }

  async getStocksByUser(userId: number) {
    const stocks = this.stockRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });

    const stocksWithPrices = await Promise.all(
      (await stocks).map(async (stock) => {
        const price = await this.getStockPrice(stock.code);
        return {
          ...stock,
          price,
        };
      }),
    );
  
    return stocksWithPrices;
  }
}
