import { InjectionToken } from '@angular/core';

// Base del gateway; en desarrollo se resuelve mediante proxy.conf.json
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => '/api',
});
