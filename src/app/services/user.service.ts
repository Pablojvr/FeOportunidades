import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Page } from './../pages/usuarios/usuarios-datasource';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public baseUrl = environment.apiURL;
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
