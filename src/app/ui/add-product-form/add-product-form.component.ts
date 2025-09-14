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
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.css'],
})
export class AddProductFormComponent {
  @Output() created = new EventEmitter<void>();
  api = inject(ApiService);
  fb = inject(FormBuilder);
  loading = signal(false);

  fg = this.fb.nonNullable.group({
    platform: ['', Validators.required],
    // url: ['',],
    productId: ['', [Validators.required]],
    customerEmail: ['xoaeb100@gmail.com', [Validators.required]],

    minPrice: [0, [Validators.required, Validators.min(1)]],
    maxPrice: [0, [Validators.required, Validators.min(1)]],
  });

  async submit() {
    if (this.fg.invalid) return;
    this.loading.set(true);
    try {
      await this.api.createProduct(this.fg.getRawValue());
      this.fg.reset({
        platform: '',

        productId: '',
        customerEmail: '',
        minPrice: 0,
        maxPrice: 0,
      });
      this.created.emit();
    } finally {
      this.loading.set(false);
    }
  }
}
