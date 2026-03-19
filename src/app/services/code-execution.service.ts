import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeExecutionService {
  private http = inject(HttpClient);
  // Point to our local backend which handles keys securely
  private apiUrl = '/api/run-code';
  private submitUrl = '/api/submit-code';

  runCode(code: string, language: string, input: string = ''): Observable<any> {
    const body = {
      language: language,
      code: code,
      input: input
    };

    return this.http.post(this.apiUrl, body);
  }

  submitCode(code: string, language: string, input: string = ''): Observable<any> {
    const body = {
      language: language,
      code: code,
      input: input
    };

    return this.http.post(this.submitUrl, body);
  }
}
