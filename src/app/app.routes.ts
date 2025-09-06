import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';

export const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'product/:id', component: ProductDetailPageComponent },
  { path: '**', redirectTo: '' },
];
