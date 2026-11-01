import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LibrosService } from 'data-access';

@Component({
  selector: 'app-catalogo',
  imports: [CurrencyPipe],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.less',
})
export class Catalogo {
  protected readonly librosService = inject(LibrosService);

  protected readonly libros = this.librosService.filtrados;
  protected readonly categorias = this.librosService.categorias;
  protected readonly total = this.librosService.total;
  protected readonly cargando = this.librosService.cargando;
  protected readonly error = this.librosService.error;

  protected buscar(event: Event) {
    this.librosService.buscar((event.target as HTMLInputElement).value);
  }

  protected filtrar(event: Event) {
    this.librosService.filtrarPorCategoria((event.target as HTMLSelectElement).value || null);
  }
}
