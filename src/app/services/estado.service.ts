import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Estado } from '../interfaces/estado';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/estado`;

  getListaEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(`${this.baseUrl}/`);
  }

  getEstado(id: number): Observable<Estado> {
    return this.http.get<Estado>(`${this.baseUrl}/${id}`);
  }

  addEstado(estado: Estado): Observable<Estado> {
    return this.http.post<Estado>(`${this.baseUrl}/`, estado);
  }

  atualizaEstado(estado: Estado): Observable<Estado> {
    return this.http.put<Estado>(`${this.baseUrl}/`, estado);
  }

  deletaEstado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
