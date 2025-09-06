import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.wsUrl, { transports: ['websocket'] });
  }

  onPriceChecked(handler: (payload: any) => void) {
    this.socket.on('price-checked', handler);
  }

  onPriceDrop(handler: (payload: any) => void) {
    this.socket.on('price-drop', handler);
  }
}
