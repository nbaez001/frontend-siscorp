import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WsItemBeanResponse } from '../dto/response/ItemBean';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemComboService {

  constructor(
    private http: HttpClient
  ) { }


  ObtenerEstadoProyecto(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/estado-preliquidacion.json`);
 /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }
  
  ObtenerRubroProyecto(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/rubro-preliquidacion.json`);
 /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }

  ObtenerTipoProyecto(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/tipo-preliquidacion.json`);
 /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }

  ObtenerEstadoComprobante(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/estadoComprobante-preliquidacion.json`);
 /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }
  
  
  // AGREGAR COMPROBANTES
  ObtenerMesADeclarar(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/mes-declarar-preliquidacion.json`);
 /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }
  
  ObtenerComprobantes(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/combo-comprobantes-preliquidacion.json`);
 /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }
  
  listarDepartamentos(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>('assets/listadoDepartamento.json');
 /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }
  
  listarProvincias(idDepartamento: number): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>('assets/listadoProvincia.json');
  }

  listarDistritos(idProvincia: number): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>('assets/listadoDistrito.json');
  }

  listarLocalidades(idDistrito: number): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>('assets/listadoLocalidad.json');
  }

  listarcargosNe(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>('assets/listadoCargosNE-preliquidacion.json');
  }

  listarReferencias(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>('assets/listadoReferencias-preliquidacion.json');
  }

  listarGastos(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>('assets/listadoGastos-preliquidacion.json');
  }

  //AGREGAR DOCUMENTO
  ObtenerDocumentos(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/documentos-preliquidacion.json`);
 /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }
  
  
}
