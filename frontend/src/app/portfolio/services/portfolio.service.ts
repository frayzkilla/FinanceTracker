import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private stocksList: any[] = [];
  private getStocksUrl = 'http://localhost:3000/stocks/getlist';

  constructor(private http: HttpClient) {}

  loadStockSymbols() {
    this.stocksList = [
      { code: 'BTC', name: 'Bitcoin' },
      { code: 'ETH', name: 'Ethereum' },
      { code: 'AAPL', name: 'Apple Inc.' },
      { code: 'GOOGL', name: 'Alphabet Inc.' },
      { code: 'AMZN', name: 'Amazon.com, Inc.' },
    ];
    // this.http.get<any[]>(this.getStocksUrl).subscribe(data => {
    //   this.stocksList = data;
    // });
  }

  searchStockSymbols(query: string) {
    return this.stocksList.filter(
      (symbol) =>
        symbol.code.includes(query.toUpperCase()) ||
        symbol.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async isSymbolValid(symbol: string) {
    return this.stocksList.some((s) => s.code === symbol);
  }
}
