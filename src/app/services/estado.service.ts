import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Estado } from '../interfaces/estado';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  constructor(private http: HttpClient) { }

  getListaEstados(): Observable<Estado[]> {
    const url = `${environment.apiUrl}/estado/`;
    return this.http.get<Estado[]>(url);
  }

  getEstado(id: number): Observable<Estado> {
    const url = `${environment.apiUrl}/estado/${id}`;
    return this.http.get<Estado>(url);
  }

  addEstado(estado: Estado): Observable<Estado> {
    const url = `${environment.apiUrl}/estado/`;
    return this.http.post<Estado>(url, estado);
  }

  atualizaEstado(estado: Estado): Observable<Estado> {
    const url = `${environment.apiUrl}/estado/`;
    return this.http.put<Estado>(url, estado);
  }

  deletaEstado(id: number): Observable<Estado> {
    const url = `${environment.apiUrl}/estado/${id}`;
    return this.http.delete<Estado>(url);
  }
}
