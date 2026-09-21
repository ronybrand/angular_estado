import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AskResponse {
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiAgentService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.aiApiUrl;

  perguntar(question: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.baseUrl}/ask`, { question });
  }
}
