import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingInterceptor implements HttpInterceptor {

  constructor(
    private loadingService: LoadingService
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.reportProgress) {
      this.loadingService.loadingStart();
    }

    return next.handle(req).pipe(
      tap(
        event => {

          /*if (event.type === HttpEventType.DownloadProgress) {
            this.loadingService.loadingStart();
          }*/

          if (event.type === HttpEventType.Response && req.reportProgress) {
            this.loadingService.loadingStop();
          }

        },
        error => {

          if (error instanceof HttpErrorResponse && req.reportProgress) {
            this.loadingService.loadingStop();
          }

        }
      )
    );
  }

}
