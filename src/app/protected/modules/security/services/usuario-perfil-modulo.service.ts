import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UsuarioPerfilModulo } from '../entities/usuario-perfil-modulo';
import { environment as env } from 'environments/environment';
import { ErrorTransaccion } from '../entities/error-transaccion';
import { UsuarioBuscado } from '../entities/usuario-buscado';

@Injectable({
  providedIn: 'root'
})
export class UsuarioPerfilModuloService {

  usuarioAgregado: Subject<void> = new Subject();

  constructor(
    private httpClient: HttpClient
  ) { }

  lista(codigoPerfilModulo: number): Observable<UsuarioPerfilModulo[]> {
    return this.httpClient.get<UsuarioPerfilModulo[]>(`${env.backendUrl}/usuario-perfil-modulo/lista/${codigoPerfilModulo}`);
  }

  agregar(codigoPerfilModulo: number, codigosUsuarios: number[]): Observable<ErrorTransaccion> {

    const datos = {
      codigoPerfilModulo,
      codigosUsuarios
    };

    return this.httpClient.post<ErrorTransaccion>(`${env.backendUrl}/usuario-perfil-modulo/agregar`, datos);
  }

  quitar(codigoUsuarioPerfilModulo: number): Observable<any> {
    return this.httpClient.delete(`${env.backendUrl}/usuario-perfil-modulo/quitar/${codigoUsuarioPerfilModulo}`);
  }

  filtrarUsuario(codigoPerfilModulo: number, filtroUsuario: string): Observable<UsuarioBuscado[]> {
    return this.httpClient
      .get<UsuarioBuscado[]>(`${env.backendUrl}/usuario-perfil-modulo/filtrar-usuario/${codigoPerfilModulo}/${filtroUsuario}`);
  }
}
