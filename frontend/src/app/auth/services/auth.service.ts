import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { mapTo, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'access_token';
  private url = 'http://localhost:3000/auth/login';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: { email: string; password: string }): Observable<void> {
    return this.http.post<{ token: string }>(this.url, credentials).pipe(
      tap((response) => localStorage.setItem(this.tokenKey, response.token)),
      mapTo(void 0)
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
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
