import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
      autoConnect: false
    });
  }

  runCodeSocket(code: string, language: string, input: string = ''): Observable<any> {
    const outputSubject = new Subject<any>();
    
    if (!this.socket.connected) {
      this.socket.connect();
    }

    const compiler = COMPILER_NAMES[language] || 'python-3.14';

    this.socket.emit('runcode', {
      api_key: API_KEY,
      compiler: compiler,
      code: code,
      input: input
    });

    this.socket.on('codeoutput', (res) => {
      outputSubject.next(res);
    });

    this.socket.on('error', (err) => {
      outputSubject.error(err);
    });

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
