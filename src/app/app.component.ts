import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span class="logo">₹ Price Tracker</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/">Dashboard</a>
    </mat-toolbar>
    <router-outlet />
  `,
  styles: [
    `
      .toolbar {
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .logo {
        font-weight: 700;
      }
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class AppComponent {}
