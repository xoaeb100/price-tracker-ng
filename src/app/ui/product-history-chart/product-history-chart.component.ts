import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-product-history-chart',
  imports: [CommonModule],
  template: `
    <canvas id="historyChart" *ngIf="data().length"></canvas>
    <p *ngIf="!data().length" style="opacity:.7">No history yet.</p>
  `,
})
export class ProductHistoryChartComponent implements OnChanges {
  @Input({ required: true }) productId!: string;
  api = inject(ApiService);
  data = signal<{ x: string; y: number }[]>([]);
  chart?: Chart;

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && this.productId) {
      const hist = await this.api.getHistory(this.productId);
      const points = hist
        .map((h: any) => ({
          x: new Date(h.checkedAt).toLocaleString(),
          y: Number(h.price),
        }))
        .reverse();
      this.data.set(points);
      queueMicrotask(() => this.render());
    }
  }

  render() {
    const el = document.getElementById(
      'historyChart'
    ) as HTMLCanvasElement | null;
    if (!el) return;
    if (this.chart) {
      this.chart.destroy();
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
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: false } },
      },
    } as any;

    this.chart = new Chart(el.getContext('2d')!, cfg);
    el.parentElement!.style.height = '360px';
  }
}
