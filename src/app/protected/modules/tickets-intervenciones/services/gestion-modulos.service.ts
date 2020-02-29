import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModuloAtencion, PostModuloAtencion } from '../entities/modulo-atencion';
import { environment as env } from 'environments/environment';
import { Encargado } from '../entities/encargado';
import { Entidad } from '../entities/entidad';

@Injectable({
  providedIn: 'root'
})
export class GestionModulosService {

  constructor(
    private http: HttpClient
  ) { }

  listar(pagina: number, cantidad: number): Observable<{modulos: ModuloAtencion[], total: number}> {
    return this.http
      .get<{modulos: ModuloAtencion[], total: number}>(`${env.backendUrlPref}/tickets-atenciones/gestion-modulos/${pagina}/${cantidad}`);
  }

  registrar(modulo: PostModuloAtencion): Observable<number> {
    return this.http.post<number>(`${env.backendUrlPref}/tickets-atenciones/gestion-modulos/registrar`, modulo);
  }

  actualizar(modulo: PostModuloAtencion): Observable<number> {
    return this.http.post<number>(`${env.backendUrlPref}/tickets-atenciones/gestion-modulos/actualizar`, modulo);
  }

  eliminar(idModulo: number): Observable<number> {
    return this.http.delete<number>(`${env.backendUrlPref}/tickets-atenciones/gestion-modulos/eliminar/${idModulo}`);
  }

  datos(): Observable<{encargados: Encargado[], entidades: Entidad[]}> {
    return this.http
      .get<{encargados: Encargado[], entidades: Entidad[]}>(`${env.backendUrlPref}/tickets-atenciones/gestion-modulos/datos`);
  }
}
