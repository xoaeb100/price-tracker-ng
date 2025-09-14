import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
  ViewChild,
  ElementRef,
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
export class ProductHistoryChartComponent implements OnChanges {
  @Input({ required: true }) productId!: string;

  @ViewChild('historyCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  api = inject(ApiService);
  data = signal<{ x: string; y: number }[]>([]);
  chart?: Chart;

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && this.productId) {
      const hist = await this.api.getHistory(this.productId);

      const points = hist.map((h: any) => ({
        x: new Date(h.checkedAt).toLocaleString(),
        y: Number(h.price),
      }));

      console.log('History points:', points);
      this.data.set(points.reverse());

      queueMicrotask(() => this.render());
    }
  }

  render() {
    const el = this.canvasRef?.nativeElement;
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
            fill: true,
            backgroundColor: 'rgba(33,150,243,0.1)', // light blue
            borderColor: '#2196f3',
            pointRadius: 3,
            pointBackgroundColor: '#1976d2',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (val) => `₹${val}`,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `₹${ctx.parsed.y.toLocaleString()}`,
            },
          },
        },
      },
    };

    this.chart = new Chart(el.getContext('2d')!, cfg);

    // Ensure height
    el.parentElement!.style.height = '360px';
  }
}
