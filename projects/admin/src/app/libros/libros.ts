import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { LibrosService } from 'data-access';
import type { Book, BookForm } from 'models';

const VACIO: BookForm & { categoriaId: string } = {
  title: '',
  subTitle: '',
  datePublication: '',
  price: 0,
  categoria: null,
  categoriaId: '',
};

@Component({
  selector: 'app-libros',
  imports: [CurrencyPipe, FormField],
  templateUrl: './libros.html',
})
export class Libros {
  private readonly service = inject(LibrosService);

  protected readonly libros = this.service.libros;
  protected readonly categorias = this.service.categoriasDetalle;
  protected readonly cargando = this.service.cargando;

  protected readonly editando = signal<number | null>(null);
  protected readonly error = signal('');
  protected readonly modelo = signal({ ...VACIO });
  protected readonly formulario = form(this.modelo, (c) => {
    required(c.title);
    required(c.datePublication);
  });
  protected readonly titulo = computed(() => (this.editando() ? 'Editar libro' : 'Nuevo libro'));

  protected editar(libro: Book) {
    this.editando.set(libro.isbn);
    this.modelo.set({
      title: libro.title,
      subTitle: libro.subTitle ?? '',
      datePublication: (libro.datePublication ?? '').slice(0, 10),
      price: libro.price,
      categoria: libro.categoria,
      categoriaId: String(libro.categoria?.id ?? ''),
    });
  }

  protected cancelar() {
    this.editando.set(null);
    this.modelo.set({ ...VACIO });
    this.error.set('');
  }

  protected guardar(event: Event) {
    event.preventDefault();
    if (this.formulario().invalid()) return;

    const { categoriaId, ...datos } = this.modelo();
    const categoria = this.categorias().find((c) => String(c.id) === categoriaId) ?? null;
    const payload: BookForm = { ...datos, price: Number(datos.price), categoria };
    const isbn = this.editando();

    const peticion = isbn ? this.service.actualizar(isbn, payload) : this.service.agregar(payload);
    peticion.subscribe({
      next: () => this.cancelar(),
      error: () => this.error.set('No se pudo guardar el libro'),
    });
  }

  protected eliminar(libro: Book) {
    if (!confirm(`¿Eliminar "${libro.title}"?`)) return;
    this.service.eliminar(libro.isbn).subscribe({
      error: () => this.error.set('No se pudo eliminar el libro'),
    });
  }
}
