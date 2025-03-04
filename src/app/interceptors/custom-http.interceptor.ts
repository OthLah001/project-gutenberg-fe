import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = `${environment.endpoint}${req.url}`;
    let headers = req.headers;

    const token = this.localStorageService.getItem('bearer_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return next
      .handle(
        req.clone({
          url,
          headers,
        })
      )
      .pipe(
        catchError((err) => {
          if (err?.error?.error_name === 'invalid_token') {
            this.localStorageService.removeItem('bearer_token');
            this.router.navigate(['/auth/login']);
          }

          return throwError(() => err);
        })
      );
  }
}
