import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public baseUrl = environment.apiURL;
    private loggedUserSubject: BehaviorSubject<any>;
    public loggedInUser: Observable<any>;

    constructor(private http: HttpClient) {
        var getLoggedUser = localStorage.getItem('loggedInUser');
        this.loggedUserSubject = new BehaviorSubject(getLoggedUser);
        this.loggedInUser = this.loggedUserSubject.asObservable();
    }

    loginUser(username: string, password: string) {
        return this.http.post(`${this.baseUrl}/Auth/login`, { username, password })
            .pipe(map(response=> {
                localStorage.setItem('loggedInUser', JSON.stringify(response));
                this.loggedUserSubject.next(response);
                console.log(response);
                return response;
            }));
    }


    checkUser(username: string, password: string) {
      return this.http.post(`${this.baseUrl}/Auth/check`, { username, password })
          .pipe(map(response=> {
              return response;
          }));
  }

    logoutUser() {
        localStorage.removeItem('loggedInUser');
        this.loggedUserSubject.next(null);
    }
    public get loggedInUserValue(){
        return this.loggedUserSubject.value;
    }

}
