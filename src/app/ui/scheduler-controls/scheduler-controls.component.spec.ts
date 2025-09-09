/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SchedulerControlsComponent } from './scheduler-controls.component';

describe('SchedulerControlsComponent', () => {
  let component: SchedulerControlsComponent;
  let fixture: ComponentFixture<SchedulerControlsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
