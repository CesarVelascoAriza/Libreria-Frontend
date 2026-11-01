import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import type { Book, BookForm, Categoria } from 'models';
import { tap } from 'rxjs';
import { API_URL } from './api-config';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class LibrosService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${inject(API_URL)}/books`;

  // Sin sesión no se consulta al gateway
  private readonly recurso = httpResource<Book[]>(() =>
    this.auth.autenticado() ? this.base : undefined,
  );

  private readonly _busqueda = signal('');
  private readonly _categoria = signal<string | null>(null);

  readonly libros = computed(() => (this.recurso.hasValue() ? this.recurso.value() : []));
  readonly cargando = this.recurso.isLoading;
  readonly error = this.recurso.error;
  readonly busqueda = this._busqueda.asReadonly();
  readonly categoria = this._categoria.asReadonly();

  readonly total = computed(() => this.libros().length);

  readonly categoriasDetalle = computed(() => {
    const mapa = new Map<number, Categoria>();
    this.libros().forEach(l => l.categoria && mapa.set(l.categoria.id, l.categoria));
    return [...mapa.values()].sort((a, b) => a.description.localeCompare(b.description));
  });

  readonly categorias = computed(() => this.categoriasDetalle().map(c => c.description));

  readonly filtrados = computed(() => {
    const texto = this._busqueda().trim().toLowerCase();
    const cat = this._categoria();

    return this.libros().filter(l => {
      const coincideTexto =
        !texto ||
        l.title.toLowerCase().includes(texto) ||
        (l.subTitle ?? '').toLowerCase().includes(texto);
      const coincideCategoria = !cat || l.categoria?.description === cat;
      return coincideTexto && coincideCategoria;
    });
  });

  buscar(texto: string) {
    this._busqueda.set(texto);
  }

  filtrarPorCategoria(categoria: string | null) {
    this._categoria.set(categoria);
  }

  limpiarFiltros() {
    this._busqueda.set('');
    this._categoria.set(null);
  }

  recargar() {
    this.recurso.reload();
  }

  agregar(libro: BookForm) {
    return this.http.post<Book>(this.base, libro).pipe(tap(() => this.recargar()));
  }

  actualizar(isbn: number, libro: BookForm) {
    return this.http.put<Book>(`${this.base}/${isbn}`, libro).pipe(tap(() => this.recargar()));
  }

  eliminar(isbn: number) {
    return this.http.delete<void>(`${this.base}/${isbn}`).pipe(tap(() => this.recargar()));
  }
}
