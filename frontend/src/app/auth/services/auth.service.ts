import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { mapTo, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'access_token';
  private loginUrl = 'http://localhost:3000/auth/login';
  private registerUrl = 'http://localhost:3000/auth/register';
  userEmail: string | null = null;


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromToken();
    console.log(this.getToken())
  }

  private loadUserFromToken() {
    const token = this.getToken();
    if (token && token.split('.').length === 3) {
      try {
        const decoded: any = jwtDecode(token);
        this.userEmail = decoded.username;
      } catch (error) {
        console.error('Ошибка декодирования токена', error);
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<void> {
    return this.http.post<{ access_token: string }>(this.loginUrl, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.access_token);
        console.log(jwtDecode(response.access_token))
        this.loadUserFromToken(); // после логина тоже грузим email
      }),
      mapTo(void 0)
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      this.userEmail = null; // при выходе обнуляем email
    }
  }

  register(credentials: { email: string; password: string }): Observable<void> {
    return this.http.post<{ access_token: string }>(this.registerUrl, credentials).pipe(
      tap((response) => localStorage.setItem(this.tokenKey, response.access_token)),
      mapTo(void 0)
    );
  }


  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    } else {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

