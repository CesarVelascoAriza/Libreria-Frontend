import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import type { LoginRequest, TokenResponse } from 'models';
import { tap } from 'rxjs';
import { API_URL } from './api-config';

const STORAGE_KEY = 'libreria.token';

function decodificar(token: string | null): { exp?: number; sub?: string; roles?: string[] } {
  if (!token) return {};
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL);

  private readonly _token = signal<string | null>(localStorage.getItem(STORAGE_KEY));

  readonly token = this._token.asReadonly();
  private readonly claims = computed(() => decodificar(this._token()));

  readonly usuario = computed(() => this.claims().sub ?? null);
  readonly roles = computed(() => this.claims().roles ?? []);
  readonly esAdmin = computed(() => this.roles().includes('ROLE_ADMIN'));
  readonly autenticado = computed(() => {
    const exp = this.claims().exp;
    return !!this._token() && (!exp || exp * 1000 > Date.now());
  });

  login(credenciales: LoginRequest) {
    return this.http.post<TokenResponse>(`${this.api}/auth/login`, credenciales).pipe(
      tap(({ access_token }) => {
        localStorage.setItem(STORAGE_KEY, access_token);
        this._token.set(access_token);
      }),
    );
  }

  logout() {
    if (this._token()) {
      this.http.post(`${this.api}/auth/logout`, null).subscribe({ error: () => undefined });
    }
    this.limpiar();
  }

  limpiar() {
    localStorage.removeItem(STORAGE_KEY);
    this._token.set(null);
  }
}
