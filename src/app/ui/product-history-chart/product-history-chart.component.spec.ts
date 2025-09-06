import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHistoryChartComponent } from './product-history-chart.component';

describe('ProductHistoryChartComponent', () => {
  let component: ProductHistoryChartComponent;
  let fixture: ComponentFixture<ProductHistoryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductHistoryChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductHistoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
