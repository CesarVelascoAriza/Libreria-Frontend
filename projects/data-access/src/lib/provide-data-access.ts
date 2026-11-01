import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { authInterceptor } from './auth.interceptor';

export function provideDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([provideHttpClient(withInterceptors([authInterceptor]))]);
}
