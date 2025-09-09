import { Component, OnInit } from '@angular/core';
import { SchedulerService } from '../../services/scheduler.service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-scheduler-controls',
  templateUrl: './scheduler-controls.component.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],

  styleUrls: ['./scheduler-controls.component.css'],
})
export class SchedulerControlsComponent {
  minutes = 5;
  message = '';

  constructor(private schedulerSvc: SchedulerService) {}

  start() {
    this.schedulerSvc.start(this.minutes).subscribe((res) => {
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
