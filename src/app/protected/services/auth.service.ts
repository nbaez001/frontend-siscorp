import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ColeccionMenu } from './../entities/coleccion_menu';
import { Subject } from 'rxjs';
import { Cabecera, ContadorMenu } from '../entities/cabecera';

@Injectable()
export class AuthService {

  cabecera: Subject<Cabecera> = new Subject();

  contadorMenu: Subject<ContadorMenu> = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  loadMenu(): Promise<ColeccionMenu[]> {
    return this.http
      .get<ColeccionMenu[]>(`${environment.backendUrl}/api/menu`)
      .toPromise();
  }

  contadoresMenu(c: string = ''): Promise<ContadorMenu[]> {
    const codigo = c ? `/${c}` : '';

    return this.http
      .get<ContadorMenu[]>(`${environment.backendUrl}/api/contadores-menu${codigo}`)
      .toPromise();
  }

}
