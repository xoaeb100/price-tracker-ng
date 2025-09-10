import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-products-table',
  imports: [CommonModule, MatTableModule, MatIconModule, RouterLink],
  template: `
    <table mat-table [dataSource]="products || []" class="mat-elevation-z1">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Title</th>
        <td mat-cell *matCellDef="let p">
          <a [routerLink]="['/product', p.id]">{{ p.title || '—' }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="platform">
        <th mat-header-cell *matHeaderCellDef>Platform</th>
        <td mat-cell *matCellDef="let p">{{ p.platform }}</td>
      </ng-container>

      <ng-container matColumnDef="currentPrice">
        <th mat-header-cell *matHeaderCellDef>Current</th>
        <td mat-cell *matCellDef="let p">
          {{ p.currentPrice ? (p.currentPrice | currency : 'INR') : 'N/A' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="targetPrice">
        <th mat-header-cell *matHeaderCellDef>Min Price</th>
        <td mat-cell *matCellDef="let p">
          {{ p.targetPrice | currency : 'INR' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="maxPrice">
        <th mat-header-cell *matHeaderCellDef>Max Price</th>
        <td mat-cell *matCellDef="let p">
          {{ p.maxPrice | currency : 'INR' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="lastCheckedAt">
        <th mat-header-cell *matHeaderCellDef>Last Checked</th>
        <td mat-cell *matCellDef="let p">
          {{ p.lastCheckedAt | date : 'short' }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayed"></tr>
      <tr mat-row *matRowDef="let row; columns: displayed"></tr>
    </table>
  `,
  styles: [
    `
      table {
        width: 100%;
      }
    `,
  ],
})
export class ProductsTableComponent {
  @Input() products: any[] | null = [];
  displayed = [
    'title',
    'platform',
    'currentPrice',
    'targetPrice',
    'maxPrice',
    'lastCheckedAt',
  ];
}
