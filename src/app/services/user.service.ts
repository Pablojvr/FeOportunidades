import { Page, Usuario } from './../pages/usuarios/usuarios-datasource';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public baseUrl = 'https://localhost:44398/api';
  constructor(private http: HttpClient) {}

  getUsers(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 10) {
    return this.http.get<Page[]>(`${this.baseUrl}/Usuarios`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString()),
    });
  }

  saveUser(user: any) {
    let userId = user.idUsuario;
    if (!userId) {
      return this.http.post(`${this.baseUrl}/Usuarios`, user);
    } else {
      return this.http.put(`${this.baseUrl}/Usuarios/${userId}`, user);
    }
  }

  deleteUser(user: any) {
    let userId = user.idUsuario;
    return this.http.delete(`${this.baseUrl}/Usuarios/${userId}`, user);
  }
}
