import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

export interface ProductDto {
  id: string;
  url: string;
  platform: 'amazon' | 'flipkart';
  title?: string | null;
  currentPrice?: number | null;
  minPrice: number;
  maxPrice: number;

  currency?: string | null;
  imageUrl?: string | null;
  lastCheckedAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private _products = signal<ProductDto[] | null>(null);
  products = computed(() => this._products());

  selectedProduct = signal<ProductDto | null>(null);

  async loadProducts(force = false) {
    if (this._products() && !force) return;
    const res = await this.http
      .get<ProductDto[]>(`${environment.apiBaseUrl}/products`)
      .toPromise();
    this._products.set(res ?? []);
  }

  async loadProduct(id: string) {
    const res = await this.http
      .get<ProductDto>(`${environment.apiBaseUrl}/products/${id}`)
      .toPromise();
    this.selectedProduct.set(res ?? null);
  }

  async createProduct(
    body: any // { //   platform: 'amazon' | 'flipkart'; //   url: string; //   minPrice: number;
  ) // }
  {
    body.url = 'www.com';
    const res = await this.http
      .post<ProductDto>(`${environment.apiBaseUrl}/products`, body)
      .toPromise();
    return res;
  }

  async getHistory(productId: string) {
    const res = await this.http
      .get<any[]>(
        `${environment.apiBaseUrl}/price-history/${productId}?limit=200`
      )
      .toPromise();
    return res ?? [];
  }

  async deleteProduct(productId: string) {
    const res = await this.http
      .delete<{ message: string }>(
        `${environment.apiBaseUrl}/products/${productId}`
      )
      .toPromise();
    return res ?? [];
  }
}
