import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { WsResponse } from '../dto/Response/BandejaProyectoAutorizacionGasto';
import { WsItemBeanResponse, ItemBean } from '../dto/Request/ItemBean';
import { Lugar } from '../dto/Response/Lugar';
import { WsApiOutResponse } from '../../expediente/dto/response/WsApiOutResponse';
import { ConsultaNombresUbigeoRequest } from '../dto/Request/ConsultaNombresUbigeoRequest';
import { ComboCRP } from '../dto/Response/ComboCRP';



@Injectable()
export class ItemComboServicio {

  constructor(
    private http: HttpClient
  ) { }


  //************************************************************* */
  //**************************** SERVICIOS ********************** */
  
  obtenerCRP(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/cargarDatosProyectoAG/cargarCRPProyectoAG/`);
  }

  obtenerCGP(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/cargarDatosProyectoAG/cargarCGPProyectoAG/`);
  }
  
  obtenerTipoDocumento(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/cargarDatosProyectoAG/comboTipoDocumento/`);
  }
  
  obtenerTipoGenero(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/cargarDatosProyectoAG/comboTipoGenero/`);
  }

  obtenerTipoColegiatura(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/cargarDatosProyectoAG/cargarColegiatura/`);
  }

  listarCombo(rpta): Observable<WsItemBeanResponse> {
    return this.http.post<WsItemBeanResponse>(`${environment.backendUrlProj}/cargarDatosProyectoAG/listarCombos/`,rpta);
  }
  
  // listarCombos(parametros): Observable<WsItemBeanResponse> {
  //   return this.http.post<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGastoTrabajador/listarCombos`, parametros);
  // }


  mostrarUbigeo(resp: ConsultaNombresUbigeoRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/cargarDatosProyectoAG/mostrarUbigeo`, resp);
    // return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/bandejaProyectoAurizacionGasto/listarProyectoEjecucion/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

 
}
