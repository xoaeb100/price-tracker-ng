import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-add-product-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <form class="form" [formGroup]="fg" (ngSubmit)="submit()">
      <mat-form-field appearance="outline" class="w100">
        <mat-label>Platform</mat-label>
        <mat-select formControlName="platform" required>
          <mat-option value="amazon">Amazon</mat-option>
          <mat-option value="flipkart">Flipkart</mat-option>
          <mat-option value="croma">Croma</mat-option>

          <mat-option value="vijaysales">Vijay Sales</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w100">
        <mat-label>Product URL</mat-label>
        <input
          matInput
          formControlName="url"
          placeholder="https://..."
          required
        />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w100">
        <mat-label> Email</mat-label>
        <input
          matInput
          formControlName="customerEmail"
          placeholder="....com"
          required
        />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w100">
        <mat-label>Target Price (INR)</mat-label>
        <input matInput formControlName="targetPrice" type="number" required />
      </mat-form-field>

      <button
        mat-flat-button
        color="primary"
        [disabled]="fg.invalid || loading()"
      >
        {{ loading() ? 'Adding...' : 'Add Product' }}
      </button>
    </form>
  `,
  styles: [
    `
      .form {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .w100 {
        width: 100%;
      }
    `,
  ],
})
export class AddProductFormComponent {
  @Output() created = new EventEmitter<void>();
  api = inject(ApiService);
  fb = inject(FormBuilder);
  loading = signal(false);

  fg = this.fb.nonNullable.group({
    platform: ['', Validators.required],
    url: ['', [Validators.required]],
    customerEmail: ['', [Validators.required]],

    targetPrice: [0, [Validators.required, Validators.min(1)]],
  });

  async submit() {
    if (this.fg.invalid) return;
    this.loading.set(true);
    try {
      await this.api.createProduct(this.fg.getRawValue());
      this.fg.reset({
        platform: '',
        url: '',
        customerEmail: '',
        targetPrice: 0,
      });
      this.created.emit();
    } finally {
      this.loading.set(false);
    }
  }
}
