import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import type { Usuario, UsuarioForm } from 'models';
import { tap } from 'rxjs';
import { API_URL } from './api-config';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${inject(API_URL)}/users`;

  private readonly recurso = httpResource<Usuario[]>(() =>
    this.auth.autenticado() ? this.base : undefined,
  );

  readonly usuarios = computed(() => (this.recurso.hasValue() ? this.recurso.value() : []));
  readonly cargando = this.recurso.isLoading;
  readonly error = this.recurso.error;
  readonly total = computed(() => this.usuarios().length);

  recargar() {
    this.recurso.reload();
  }

  // El gateway enruta POST/PUT al authorization server para cifrar la clave
  agregar(usuario: UsuarioForm) {
    return this.http.post<Usuario>(this.base, usuario).pipe(tap(() => this.recargar()));
  }

  actualizar(id: number, usuario: UsuarioForm) {
    return this.http.put<Usuario>(`${this.base}/${id}`, usuario).pipe(tap(() => this.recargar()));
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(tap(() => this.recargar()));
  }
}
