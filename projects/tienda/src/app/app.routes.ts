import { Routes } from '@angular/router';
import { authGuard } from 'data-access';
import { Login } from 'ui-shared';
import { Catalogo } from './catalogo';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Catalogo, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
