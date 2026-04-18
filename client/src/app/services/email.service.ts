import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailRequest } from '../../models/email-request.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://localhost:7226/api/Email';

  constructor(private http: HttpClient) {}

  sendCode(email: string, code: string, fileName: string): Observable<any> {
    const request: EmailRequest = {
      Email: email,
      Code: code,
      FileName: fileName,
      Subject: 'Your Generated Dashboard Code'
    };
    return this.http.post(`${this.apiUrl}/send-code`, request);
  }
}
