import { Component, inject } from '@angular/core';
import { AuthService } from 'data-access';

@Component({
  selector: 'app-sin-acceso',
  template: `
    <section class="tarjeta" style="max-width: 480px; margin: 2rem auto">
      <h2>Sin permisos de administrador</h2>
      <p>
        El usuario <strong>{{ auth.usuario() }}</strong> no tiene el rol <code>ROLE_ADMIN</code>.
      </p>
      <p>Roles actuales: {{ auth.roles().join(', ') || 'ninguno' }}</p>
      <p>Cierra sesión e ingresa con un usuario administrador.</p>
    </section>
  `,
})
export class SinAcceso {
  protected readonly auth = inject(AuthService);
}
