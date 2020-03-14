import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { WsResponseItem } from '../dto/response/ItemBean';
import { Session } from '@shared/auth/Session';


@Injectable()
export class ItemComboService {

  constructor(
    private http: HttpClient
  ) { }



  ObtenerItemEstado(id: number): Observable<WsResponseItem> {
    return this.http.get<WsResponseItem>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarEstados`);
  }

  ObtenerItemAlerta(): Observable<WsResponseItem> {
    return this.http.get<WsResponseItem>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarAlertas`);
  }


  ObtenerModalidadEjecucion(): Observable<WsResponseItem> {
    return this.http.get<WsResponseItem>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarModalidad`);
  }

  obtenerTipoDocumentoArchivo(): Observable<WsResponseItem> {
    return this.http.get<WsResponseItem>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarTipoArchivo`);
  }


}
