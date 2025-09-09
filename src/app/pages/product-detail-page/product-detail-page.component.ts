import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductHistoryChartComponent } from '../../ui/product-history-chart/product-history-chart.component';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-product-detail-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ProductHistoryChartComponent,
  ],
  template: `
    <div class="container" *ngIf="product(); else loading">
      <mat-card class="product-card">
        <mat-card-header>
          <mat-card-title>{{ product()?.title || 'Product' }}</mat-card-title>
          <mat-card-subtitle>{{ product()?.platform }}</mat-card-subtitle>
        </mat-card-header>

        <img
          mat-card-image
          *ngIf="product()?.imageUrl"
          [src]="product()?.imageUrl"
          alt="{{ product()?.title }}"
        />

        <mat-card-content>
          <p>
            <b>Target Price:</b>
            {{ product()?.targetPrice | currency : 'INR' }}
          </p>
          <p>
            <b>Current Price:</b>
            {{
              product()?.currentPrice
                ? (product()?.currentPrice | currency : 'INR')
                : 'N/A'
            }}
          </p>
        </mat-card-content>

        <mat-card-actions>
          <a
            mat-button
            color="primary"
            [href]="product()?.url"
            target="_blank"
            rel="noopener"
          >
            Open Product
          </a>
        </mat-card-actions>
      </mat-card>

      <mat-card class="history-card">
        <mat-card-header>
          <mat-card-title>Price History</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-product-history-chart [productId]="product()?.id!" />
        </mat-card-content>
      </mat-card>
    </div>

    <ng-template #loading>
      <div class="loading">
        <mat-spinner diameter="50"></mat-spinner>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .container {
        display: grid;
        gap: 20px;
        max-width: 800px;
        margin: 24px auto;
        padding: 0 16px;
      }

      .product-card img {
        object-fit: contain;
        max-height: 250px;
        background: #fafafa;
      }

      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300px;
      }
    `,
  ],
})
export class ProductDetailPageComponent implements OnInit {
  route = inject(ActivatedRoute);
  api = inject(ApiService);

  product = this.api.selectedProduct;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.loadProduct(id);
  }
}
