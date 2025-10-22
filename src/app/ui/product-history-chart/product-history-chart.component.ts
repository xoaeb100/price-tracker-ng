import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-product-history-chart',
  imports: [CommonModule],
  templateUrl: './product-history-chart.component.html',
  styleUrls: ['./product-history-chart.component.css'],
})
export class ProductHistoryChartComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input({ required: true }) productId!: string;

  // static: false — canvas may be created/destroyed by Angular
  @ViewChild('historyCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  api = inject(ApiService);
  cdr = inject(ChangeDetectorRef);

  // reactive data store (signals)
  data = signal<{ x: string; y: number }[]>([]);
  chart?: Chart;

  private viewInitialized = false;

  // Ensure we clean up if component is destroyed
  ngOnDestroy(): void {
    this.destroyChart();
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;

    // If data already available (e.g., input changed before view init),
    // render now. Using setTimeout 0 to wait for canvas to be attached.
    setTimeout(() => {
      if (this.data().length) {
        this.render();
      }
    }, 0);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && this.productId) {
      try {
        const hist = await this.api.getHistory(this.productId);
        // Normalise and map history to points
        const points = (hist || []).map((h: any) => ({
          x: new Date(h.checkedAt).toLocaleString(),
          y: Number(h.price) || 0,
        }));

        // store reversed so earliest is leftmost
        this.data.set(points.reverse() || []);
      } catch (err) {
        console.error('Failed to load history', err);
        this.data.set([]);
      }

      // Let Angular render/attach canvas if needed, then render chart
      // If view is not initialized yet, render will be attempted in ngAfterViewInit
      if (this.viewInitialized) {
        // next tick to ensure canvas exists
        setTimeout(() => {
          this.render();
        }, 0);
      }
    }
  }

  private destroyChart() {
    if (this.chart) {
      try {
        this.chart.destroy();
      } catch (e) {
        // ignore if already destroyed
      } finally {
        this.chart = undefined;
      }
    }
  }

  render() {
    // if no data => ensure chart destroyed and don't render
    if (!this.data().length) {
      this.destroyChart();
      return;
    }

    const el = this.canvasRef?.nativeElement;
    if (!el) {
      // canvas not present (maybe *ngIf); nothing to do
      return;
    }

    // ensure container has sensible height so canvas is visible
    const parent = el.parentElement;
    if (parent) {
      parent.style.height = '360px';
      parent.style.position = 'relative';
    }
    // ensure canvas has width/height attributes for Chart.js to size correctly
    el.style.width = '100%';
    el.style.height = '100%';

    // destroy existing chart before creating new one
    this.destroyChart();

    // Guard: if all y values are identical, make a small padding so the line is visible
    const ys = this.data().map((p) => p.y);
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    let suggestedMin: number | undefined;
    let suggestedMax: number | undefined;

    if (min === max) {
      // provide ±1% to make small variation visible
      const pad = Math.max(1, Math.round(min * 0.01));
      suggestedMin = Math.max(0, min - pad);
      suggestedMax = max + pad;
    }

    const cfg: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.data().map((p) => p.x),
        datasets: [
          {
            label: 'Price (INR)',
            data: this.data().map((p) => p.y),
            tension: 0.3,
            fill: true,
            // It's OK to use hex colors — Chart.js will render with these defaults.
            backgroundColor: 'rgba(33,150,243,0.08)',
            borderColor: '#2196f3',
            pointRadius: 4,
            pointBackgroundColor: '#1976d2',
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            suggestedMin,
            suggestedMax,
            ticks: {
              callback: (val) => `₹${val}`,
            },
          },
          x: {
            ticks: {
              autoSkip: true,
              maxRotation: 0,
              callback: function (val: any, idx: number, values: any) {
                // shorten long timestamps for readability
                const label = (this as any).getLabelForValue(val);
                if (typeof label === 'string' && label.length > 20) {
                  return label.slice(0, 20) + '...';
                }
                return label;
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `₹${Number(ctx.parsed.y).toLocaleString()}`,
            },
          },
          legend: {
            display: false,
          },
        },
      },
    };

    const ctx = el.getContext('2d');
    if (!ctx) {
      console.warn('Chart context not available');
      return;
    }

    this.chart = new Chart(ctx, cfg);
    // ensure view updates if needed
    this.cdr.detectChanges();
  }
}
