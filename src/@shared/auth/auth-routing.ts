import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Session } from './Session';
import { environment as env } from 'environments/environment';

@Injectable()
export class Routing {
  constructor(
    protected http: HttpClient,
    protected router: Router
  ) { }

  hasLogged(): Observable<boolean> {
    return this.http.get<boolean>(`${env.backendUrl}/api/status`);
  }
}

@Injectable()
export class AuthRouting extends Routing implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {

    return this.hasLogged().pipe(
      map(() => true),
      catchError(() => {
        Session.stop();
        return of(this.router.createUrlTree(['/anonimo/iniciar-sesion']));
      })
    );
  }
}

@Injectable()
export class DsAuthRouting extends Routing implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.hasLogged().pipe(
      map(() => this.router.createUrlTree(['/principal/inicio'])),
      catchError(() => of(true))
    );
  }

}
