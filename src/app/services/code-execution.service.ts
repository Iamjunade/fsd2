import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, from, of } from 'rxjs';
import { catchError, switchMap, timeout } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { COMPILER_NAMES, API_KEY, SOCKET_URL } from '../core/compiler-config';

@Injectable({
  providedIn: 'root'
})
export class CodeExecutionService {
  private http = inject(HttpClient);
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, {
      auth: { token: API_KEY },
      transports: ['websocket'], // Force WebSocket to avoid 400 polling errors
      autoConnect: false,
      reconnectionAttempts: 3
    });
  }

  runCodeSocket(code: string, language: string, input: string = ''): Observable<any> {
    const outputSubject = new Subject<any>();
    
    // Fallback logic if socket fails
    const fallback = () => {
      console.warn('WebSocket failed or timed out. Falling back to Sync API.');
      this.runCode(code, language, input).subscribe({
        next: (res) => {
          outputSubject.next({ ...res, finished: true });
          outputSubject.complete();
        },
        error: (err) => outputSubject.error(err)
      });
    };

    if (!this.socket.connected) {
      this.socket.connect();
    }

    // Clean up old listeners
    this.socket.off('codeoutput');
    this.socket.off('error');
    this.socket.off('connect_error');

    const compiler = COMPILER_NAMES[language] || 'python-3.14';

    // Set a connection timeout
    const connTimeout = setTimeout(() => {
      if (!this.socket.connected) {
        fallback();
      }
    }, 3000);

    this.socket.on('connect', () => {
      clearTimeout(connTimeout);
      this.socket.emit('runcode', {
        api_key: API_KEY,
        compiler: compiler,
        code: code,
        input: input
      });
    });

    this.socket.on('codeoutput', (res) => {
      outputSubject.next(res);
      if (res.finished || res.status === 'success' || res.status === 'error') {
        // Keep subject open for a moment if needed, but the UI handles finished state
      }
    });

    this.socket.on('error', (err) => {
      console.error('Socket Error:', err);
      fallback();
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket Connection Error:', err);
      fallback();
    });

    // If already connected, emit immediately
    if (this.socket.connected) {
      clearTimeout(connTimeout);
      this.socket.emit('runcode', {
        api_key: API_KEY,
        compiler: compiler,
        code: code,
        input: input
      });
    }

    return outputSubject.asObservable();
  }

  runCode(code: string, language: string, input: string = '') {
    const body = { language, code, input };
    return this.http.post<any>('/api/run-code', body);
  }

  submitCode(code: string, language: string, input: string = '') {
    const body = { language, code, input };
    return this.http.post<any>('/api/submit-code', body);
  }
}
