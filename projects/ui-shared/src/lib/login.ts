import { Component, inject, input, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthService } from 'data-access';

@Component({
  selector: 'lib-login',
  imports: [FormField],
  template: `
    <form class="tarjeta login" (submit)="enviar($event)">
      <h2>{{ titulo() }}</h2>
      <input placeholder="Usuario" autocomplete="username" [formField]="credenciales.username" />
      <input
        type="password"
        placeholder="Contraseña"
        autocomplete="current-password"
        [formField]="credenciales.password"
      />
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
      <button type="submit" [disabled]="cargando() || credenciales().invalid()">Ingresar</button>
    </form>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly titulo = input('Iniciar sesión');
  readonly destino = input('/');

  protected readonly cargando = signal(false);
  protected readonly error = signal('');

  private readonly modelo = signal({ username: '', password: '' });
  protected readonly credenciales = form(this.modelo, (campos) => {
    required(campos.username);
    required(campos.password);
  });

  protected enviar(event: Event) {
    event.preventDefault();
    if (this.credenciales().invalid()) return;
    this.cargando.set(true);
    this.error.set('');
    this.auth.login(this.modelo()).subscribe({
      next: () => this.router.navigateByUrl(this.destino()),
      error: () => {
        this.error.set('Credenciales inválidas');
        this.cargando.set(false);
      },
    });
  }
}
