import { Component, inject, signal } from '@angular/core';
import { UsuariosService } from 'data-access';
import type { Usuario } from 'models';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.html',
})
export class Usuarios {
  private readonly service = inject(UsuariosService);

  protected readonly usuarios = this.service.usuarios;
  protected readonly cargando = this.service.cargando;
  protected readonly error = signal('');

  protected eliminar(usuario: Usuario) {
    if (!confirm(`¿Eliminar "${usuario.userName}"?`)) return;
    this.service.eliminar(usuario.id).subscribe({
      error: () => this.error.set('No se pudo eliminar el usuario'),
    });
  }

  protected alternarHabilitado(usuario: Usuario) {
    const { id, ...resto } = usuario;
    this.service.actualizar(id, { ...resto, enabled: !usuario.enabled }).subscribe({
      error: () => this.error.set('No se pudo actualizar el usuario'),
    });
  }
}
