import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilModulo } from '../entities/perfil-modulo';
import { environment as env } from 'environments/environment';
import { ErrorTransaccion } from '../entities/error-transaccion';
import { Perfil } from '../entities/perfil';

@Injectable({
  providedIn: 'root'
})
export class PerfilModuloService {

  constructor(
    private httpClient: HttpClient
  ) { }

  lista(codigoModulo: number): Observable<PerfilModulo[]> {
    return this.httpClient.get<PerfilModulo[]>(`${env.backendUrl}/perfil-modulo/lista/${codigoModulo}`);
  }

  agregar(datos: any): Observable<ErrorTransaccion> {
    return this.httpClient.post<ErrorTransaccion>(`${env.backendUrl}/perfil-modulo/agregar`, datos);
  }

  quitar(codigoPerfilModulo: number): Observable<any> {
    return this.httpClient.delete(`${env.backendUrl}/perfil-modulo/quitar/${codigoPerfilModulo}`);
  }

  perfiles(codigoModulo: number): Observable<Perfil[]> {
    return this.httpClient.get<Perfil[]>(`${env.backendUrl}/perfil-modulo/perfiles/${codigoModulo}`);
  }

}
