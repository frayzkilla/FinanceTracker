import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mapTo, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'access_token'; 
  private url = 'http://localhost:3000/api/auth'; 
  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<void> {
    return this.http
      .post<{ token: string }>(this.url, credentials)
      .pipe(
        tap((response) => localStorage.setItem(this.tokenKey, response.token)),
        mapTo(void 0)
      );
      
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
