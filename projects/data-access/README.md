# data-access

Capa de acceso a datos: `AuthService`, `LibrosService` y `UsuariosService` (signals + `httpResource`), `authInterceptor`, `authGuard` / `adminGuard` y `provideDataAccess()`. La base de la API se configura con el token `API_URL` (por defecto `/api`).

Se importa como `data-access` (alias en `tsconfig.json`).

## Comandos

```bash
ng build data-access
ng test data-access
```
