import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '../pages/usuarios/usuarios-datasource';

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {
  public baseUrl = 'https://localhost:44398/api';
  constructor(private http: HttpClient) { }

  getPaginatedDevoluciones(
    fechaIni = '',
    fechaFin = '',
    pageNumber = 0,
    pageSize = 10
  ) {
    return this.http.get<Page[]>(`${this.baseUrl}/Devoluciones`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('fechaIni', fechaIni)
        .set('fechaFin', fechaFin)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString()),
    });
  }
}
