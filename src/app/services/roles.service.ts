import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rol } from '../pages/usuarios/usuarios-datasource';

@Injectable({ providedIn: 'root' })
export class RolesService {
  public baseUrl = 'https://localhost:44398/api';
  constructor(private http: HttpClient) {}

  getRoles(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 10) {
    return this.http.get<Rol[]>(`${this.baseUrl}/Rols`, {});
  }
}
