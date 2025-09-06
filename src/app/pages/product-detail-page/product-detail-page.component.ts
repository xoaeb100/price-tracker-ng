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
      <mat-card>
        <h2>{{ product()?.title || 'Product' }}</h2>
        <p>
          <b>Platform:</b> {{ product()?.platform }} · <b>Target:</b>
          {{ product()?.targetPrice | currency : 'INR' }} · <b>Current:</b>
          {{
            product()?.currentPrice
              ? (product()?.currentPrice | currency : 'INR')
              : 'N/A'
          }}
        </p>
        <a [href]="product()?.url" target="_blank">Open product</a>
      </mat-card>

      <mat-card>
        <h3>Price history</h3>
        <app-product-history-chart [productId]="product()?.id!" />
      </mat-card>
    </div>

    <ng-template #loading>
      <div class="loading"><mat-spinner /></div>
    </ng-template>
  `,
  styles: [
    `
      .container {
        max-width: 1000px;
        margin: 24px auto;
        display: grid;
        gap: 16px;
      }
      .loading {
        display: grid;
        place-items: center;
        padding: 48px;
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
