import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Estado } from '../interfaces/estado';
import { PaginaResponse } from '../interfaces/pagina-response';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/estado`;

  getListaEstados(): Observable<Estado[]> {
    // size=100 cobre o dataset inteiro (27 estados) numa unica pagina - o
    // backend clampa qualquer valor acima de app.pagination.max-size, entao
    // e seguro pedir mais do que existe. Ver ADR 0018 no backend (GET
    // /estado sem paginacao foi removido, /paginado e o unico endpoint de
    // listagem agora).
    const params = new HttpParams().set('size', '100');
    return this.http
      .get<PaginaResponse<Estado>>(`${this.baseUrl}/paginado`, { params })
      .pipe(map((pagina) => pagina.content));
  }

  getEstado(id: number): Observable<Estado> {
    return this.http.get<Estado>(`${this.baseUrl}/${id}`);
  }

  addEstado(estado: Estado): Observable<Estado> {
    return this.http.post<Estado>(`${this.baseUrl}/`, estado);
  }

  atualizaEstado(estado: Estado): Observable<Estado> {
    // id vai na URL, nao no corpo - PUT /estado/{id} (ver ADR 0018 no
    // backend). nome/sigla e tudo que o backend aceita no corpo agora.
    const { id, nome, sigla } = estado;
    return this.http.put<Estado>(`${this.baseUrl}/${id}`, { nome, sigla });
  }

  deletaEstado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
