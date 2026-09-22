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
  // /ask vive atras do proprio backend "estado" (BFF) - guarda a
  // ASK_API_KEY server-side, nunca mais no bundle deste app.
  private readonly baseUrl = environment.apiUrl;

  perguntar(question: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.baseUrl}/ask`, { question });
  }
}
