import { Injectable, Inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiUrlInterceptor implements HttpInterceptor {

  constructor(
    @Inject('apiUrl') private apiUrl: string
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // TODO: POR CORREGIR LA DOBLE LLAMADA

    if (this.existsApiUrl) {

      if (!req.url.includes('://')) {
        req = req.clone({
          url: `${this.apiUrl}/${req.url}`
        });
      } else {
        console.warn(`Url base "${this.apiUrl}/${req.url}" duplicado`);
      }

    }

    return next.handle(req);

  }

  private get existsApiUrl(): boolean {

    // TODO: VALIDAR CON EXPRESIÓN REGULAR
    const validation: boolean = this.apiUrl.includes('http');

    if (!validation) {
      throw new Error('Debe definir la api url');
    }

    return validation;

  }

}
