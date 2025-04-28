import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Stock } from '../interfaces/stock.interface';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private apiUrl = 'http://localhost:3000';
  private stocksList: any[] = [];
  private getStocksUrl = this.apiUrl + '/stocks/getstockslist';

  private assetsSubject = new BehaviorSubject<Stock[]>([]);
  assets$ = this.assetsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadStockSymbols() {
    this.http.get<any[]>(this.getStocksUrl).subscribe((data) => {
      this.stocksList = data;
    });
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

  getRawUserStocks(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/stocks/userstocks`, { headers });
  }

  getFormattedUserStocks(token: string): Observable<Stock[]> {
    return this.getRawUserStocks(token).pipe(
      map((stocks) => {
        return stocks.map((stock: any) => ({
          name: stock.code,
          amount: stock.amount,
          price: 0,
        }));
      })
    );
  }

  loadUserAssets(token: string) {
    this.getFormattedUserStocks(token).subscribe((stocks) => {
      this.assetsSubject.next(stocks);
    });
  }
}
