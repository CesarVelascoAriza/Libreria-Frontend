import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LibrosService } from './libros';

describe('LibrosService', () => {
  let service: LibrosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(LibrosService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.libros()).toEqual([]);
  });

  it('should send create request to the gateway', () => {
    service.agregar({ title: 't', subTitle: 's', datePublication: '2024-01-01', price: 1, categoria: null }).subscribe();
    const req = http.expectOne('/api/books');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
