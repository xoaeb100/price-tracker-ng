import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AddProductFormComponent } from '../../ui/add-product-form/add-product-form.component';
import { ProductsTableComponent } from '../../ui/products-table/products-table.component';
import { ApiService } from '../../services/api.service';
import { RealtimeService } from '../../services/realtime.service';
import { SchedulerControlsComponent } from '../../ui/scheduler-controls/scheduler-controls.component';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    AddProductFormComponent,
    ProductsTableComponent,
    SchedulerControlsComponent,
  ],
  template: `
    <div class="container">
      <mat-card class="card">
        <h2>Add a product to track</h2>

        <app-scheduler-controls />
        <app-add-product-form (created)="onCreated()" />
      </mat-card>

      <mat-card class="card">
        <div class="header">
          <h2>Tracked products</h2>
          <button mat-stroked-button color="primary" (click)="refresh()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </div>
        <app-products-table [products]="api.products()" />
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 1100px;
        margin: 24px auto;
        display: grid;
        gap: 16px;
      }
      .card {
        padding: 12px;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
  ],
})
export class DashboardPageComponent implements OnInit {
  api = inject(ApiService);
  snack = inject(MatSnackBar);
  rt = inject(RealtimeService);

  ngOnInit() {
    this.api.loadProducts();

    // Realtime updates
    this.rt.onPriceChecked((p) => {
      this.snack.open(
        `Checked: ${p.title ?? p.platform} → ${p.price ?? 'N/A'}`,
        'OK',
        { duration: 2500 }
      );
      this.api.loadProducts();
    });
    this.rt.onPriceDrop((p) => {
      this.snack
        .open(`Price drop: ${p.title ?? p.platform} → ${p.price}`, 'View', {
          duration: 5000,
        })
        .onAction()
        .subscribe(() => window.open(p.url, '_blank'));
      this.api.loadProducts();
    });
  }

  refresh() {
    this.api.loadProducts(true);
  }
  onCreated() {
    this.api.loadProducts(true);
  }
}
