import { Injectable } from '@angular/core';
import { PerfilUsuarioModuloRequest } from '../dto/request/perfil-usuario-modulo.request';
import { Observable } from 'rxjs';
import { WsApiOutResponse } from '../../ups/modules/expediente/dto/response/WsApiOutResponse';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UaCommonService {

  constructor(private http: HttpClient) { }

  listarPerfilUsuarioModulo(req: PerfilUsuarioModuloRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/listarPerfilUsuarioModulo`, req);
  }
}
