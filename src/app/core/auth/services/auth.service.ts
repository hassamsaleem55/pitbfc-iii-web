import { Injectable, signal, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { fromEvent, merge, throttleTime, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../dtos/login-request.dto';
import { LoginResponse } from '../dtos/login-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private http = inject(HttpClient);

  private readonly API_URL = environment.apiBaseUrl;
  private readonly INACTIVITY_MS = 5 * 60 * 1000;
  private idleSubscription?: Subscription;
  private timer?: any;
  private readonly TOKEN_KEY = 'authToken';
  private readonly LAST_ACTION_KEY = 'lastAction';

  isAuthenticated = signal<boolean>(this.checkInitialState());

  constructor() {
    if (this.isAuthenticated()) {
      this.startTracingInactivity();
    }
  }

  private checkInitialState(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const lastAction = localStorage.getItem(this.LAST_ACTION_KEY);

    if (!token || !lastAction) return false;

    const now = Date.now();
    const last = Number(lastAction);

    if (now - last > this.INACTIVITY_MS) {
      // this.clearSession();
      return false;
    }

    return true;
  }

  login(request: LoginRequest) {
    const url =
      `${this.API_URL}/login?Username=${encodeURIComponent(request.username)}&Password=${encodeURIComponent(request.password)}`;
    return this.http.post<LoginResponse>(url, null);
  }

  loginSuccess(response: LoginResponse) {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    this.updateLastAction();
    this.isAuthenticated.set(true);
    this.startTracingInactivity();
    this.router.navigate(['/']);
  }

  logout() {
    this.clearSession();
    this.isAuthenticated.set(false);
    this.stopTracingInactivity();
    this.router.navigate(['/login']);
  }

  private clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.LAST_ACTION_KEY);
  }

  private startTracingInactivity() {
    this.stopTracingInactivity();
    this.resetTimer();
    this.ngZone.runOutsideAngular(() => {
      const eventQueries = [
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'click'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'scroll')
      ];

      this.idleSubscription = merge(...eventQueries)
        .pipe(throttleTime(2000))
        .subscribe(() => {
          this.ngZone.run(() => {
            this.updateLastAction();
            this.resetTimer();
          });
        });
    });
  }

  private stopTracingInactivity() {
    if (this.idleSubscription)
      this.idleSubscription.unsubscribe();

    if (this.timer)
      clearTimeout(this.timer);
  }

  private updateLastAction() {
    localStorage.setItem(this.LAST_ACTION_KEY, Date.now().toString());
  }

  private resetTimer() {
    if (this.timer)
      clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      console.log('User inactive. Logging out...');
      this.logout();
      console.warn('Session expired due to inactivity');

    }, this.INACTIVITY_MS);
  }
}