import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class SchedulerService {
  constructor(private http: HttpClient) {}

  start(minutes: number): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/price-checker/start`, {
      minutes,
    });
  }

  stop(): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/price-checker/stop`, {});
  }

  runOnce(): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/price-checker/run`, {});
  }

  getStatus(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/price-checker/status`);
  }
}
