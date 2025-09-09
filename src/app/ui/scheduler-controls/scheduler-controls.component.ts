import { Component } from '@angular/core';
import { SchedulerService } from '../../services/scheduler.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { DurationPipe } from '../../utils/duration.pipe';

@Component({
  selector: 'app-scheduler-controls',
  templateUrl: './scheduler-controls.component.html',
  styleUrls: ['./scheduler-controls.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    DurationPipe,
    MatChipsModule,
  ],
})
export class SchedulerControlsComponent {
  value = 5;
  unit: 'minutes' | 'hours' | 'days' = 'minutes';
  message = '';
  status: any = { running: false };

  constructor(private schedulerSvc: SchedulerService) {}

  ngOnInit() {
    this.loadStatus();
  }

  loadStatus() {
    this.schedulerSvc.getStatus().subscribe((res) => {
      this.status = res;
      console.log(this.status);
    });
  }

  private convertToMinutes(): number {
    switch (this.unit) {
      case 'hours':
        return this.value * 60;
      case 'days':
        return this.value * 24 * 60;
      default:
        return this.value;
    }
  }

  start() {
    const minutes = this.convertToMinutes();
    this.schedulerSvc.start(minutes).subscribe((res) => {
      this.message = res.message;
    });
  }

  stop() {
    this.schedulerSvc.stop().subscribe((res) => {
      this.message = res.message;
    });
  }

  runOnce() {
    this.schedulerSvc.runOnce().subscribe((res) => {
      this.message = res.message;
    });
  }
}
