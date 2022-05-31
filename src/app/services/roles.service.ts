import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Page } from '../pages/roles/roles-datasource';
import { Rol } from '../pages/usuarios/usuarios-datasource';

@Injectable({ providedIn: 'root' })
export class RolesService {
  public baseUrl = environment.apiURL;
  constructor(private http: HttpClient) {}

  getRoles(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 10) {
    return this.http.get<Rol[]>(`${this.baseUrl}/Rols`, {});
  }

  getPaginatedRoles(
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 10
  ) {
    return this.http.get<Page[]>(`${this.baseUrl}/Rols`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString()),
    });
  }

  saveRol(user: any) {
    let userId = user.idRol;
    if (!userId) {
      return this.http.post(`${this.baseUrl}/Rols`, user);
    } else {
      return this.http.put(`${this.baseUrl}/Rols/${userId}`, user);
    }
  }

  deleteRol(user: any) {
    let userId = user.idRol;
    return this.http.delete(`${this.baseUrl}/Rols/${userId}`, user);
  }
}
