import { Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AppService } from '../services/app.service';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthHtppInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private authService: AppService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = sessionStorage.getItem(Constants.LOCAL_STORE_RESOURSES.TOKEN);
    console.log('---------',token);
    if (sessionStorage.getItem(Constants.LOCAL_STORE_RESOURSES.USERNAME) && token) {
      request = request.clone({
        setHeaders: {
           Authorization: token
        },
      });
    }
    return next.handle(request).pipe(catchError(x => this.handleAuthError(x)));
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      //navigate /delete cookies or whatever
      this.authService.logout();
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError(err);
  }
}
