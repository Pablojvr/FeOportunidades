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

  setUser(user: any) {
    let userId = user.id;
    delete user.id;
    return this.http.post(`${this.baseUrl}/Usuarios/${user.id}`, user);
  }
}
