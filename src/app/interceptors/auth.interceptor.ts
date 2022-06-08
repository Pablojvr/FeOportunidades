import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var user = JSON.parse(localStorage.getItem("loggedInUser")??"{}");
        if (user.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`,
                    "Access-Control-Allow-Origin":"*",
                }
            });
        }

        return next.handle(request);
    }
}
