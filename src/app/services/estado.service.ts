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

  getListaEstados(busca?: string, sort?: string): Observable<Estado[]> {
    // size=100 cobre o dataset inteiro (27 estados) numa unica pagina - o
    // backend clampa qualquer valor acima de app.pagination.max-size, entao
    // e seguro pedir mais do que existe. Ver ADR 0018 no backend (GET
    // /estado sem paginacao foi removido, /paginado e o unico endpoint de
    // listagem agora). busca/sort so entram na query string quando
    // preenchidos - o backend trata ausencia como "sem filtro"/"sem
    // ordenacao explicita".
    let params = new HttpParams().set('size', '100');
    if (busca) {
      params = params.set('busca', busca);
    }
    if (sort) {
      params = params.set('sort', sort);
    }
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
