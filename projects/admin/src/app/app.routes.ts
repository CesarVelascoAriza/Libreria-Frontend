import { Routes } from '@angular/router';
import { adminGuard } from 'data-access';
import { Login } from 'ui-shared';
import { Libros } from './libros/libros';
import { Usuarios } from './usuarios/usuarios';

export const routes: Routes = [
  { path: 'login', component: Login},
  { path: 'libros', component: Libros, canActivate: [adminGuard] },
  { path: 'usuarios', component: Usuarios, canActivate: [adminGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'libros' },
  { path: '**', redirectTo: 'libros' },
];
