import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendInfo } from '../interfaces/backend-info';
import { FrontendVersion } from '../interfaces/frontend-version';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  private http = inject(HttpClient);

  getFrontendVersion(): Observable<FrontendVersion> {
    return this.http.get<FrontendVersion>('/version.json');
  }

  getBackendInfo(): Observable<BackendInfo> {
    return this.http.get<BackendInfo>(`${environment.apiUrl}/actuator/info`);
  }
}
