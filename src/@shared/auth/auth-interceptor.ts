import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { Session } from './Session';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = Session.identity.access_token;

    // AGREGAR LA CABECERA DE AUTENTICACION PARA TODAS LAS CONSULTAS
    if (!req.headers.has('Authorization') && Session.exist()) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
          idUsuario: Session.identity.id_usuario.toString(),
          urlBase: this.router.url
        }
      });
    }

    return next.handle(req).pipe(
      tap(
        event => event,
        error => {

          // SI LA PETICION RETORNA 401 ES POR Q EL TOKEN YA EXPIRO, ENTONCES SE LE REENVIA AL LOGIN
          if (error instanceof HttpErrorResponse && error.status === 401)  {

            if (!!token) {
              // SI EL TOKEN EXPIRA AL HACER UNA PETICION
              Session.stop();
              this.snackBar.open('SESIÓN FINALIZADA, VUELVA A INICIAR SESIÓN', '', {
                duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
              });
              this.router.navigate(['/anonimo/iniciar-sesion']);
            }

          }

          // PERMITIR Q TODOS LOS ESTADOS DE CODIGOS ENTRE 200 Y 299 RETORNEN TRUE
          if (error instanceof HttpErrorResponse && error.status >= 200 && error.status < 300) {
            const res = new HttpResponse({
              body: null,
              headers: error.headers,
              status: error.status,
              statusText: error.statusText,
              url: error.url
            });

            return of(res);
          } else {
            return throwError(error);
          }

        }
      )
    );
  }
}
