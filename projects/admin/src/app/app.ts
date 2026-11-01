import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from 'data-access';
import { APP_VERSION } from './version';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.sass',
  templateUrl: './app.html',
})
export class App {
  protected readonly version = APP_VERSION;
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected salir() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
