import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { WsResponseProyecto } from '../dto/response/Proyecto';
import { WsResponseValorizacionAvance, ValorizacionAvance } from '../dto/response/ValorizacionAvance';
import { WsApiOutResponse } from '../../expediente/dto/response/WsApiOutResponse';
import { WsResponseRegistroComprobante } from '../dto/response/RegistroComprobante';
import { WsResponseRegistroComprobanteSubTotal } from '../dto/response/RegistroComprobanteSubTotal';


@Injectable({
  providedIn: 'root'
})
export class GestionPreliquidacionService {

  constructor(
    private http: HttpClient
  ) { }

  get urlBase(): string {
    return environment.backendUrlProj + '/preLiquidacion';
  }

  proyectoPreliquidacionFiltros(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/proyecto.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  comprobantesPreliquidacionFiltros(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/comprobantes-preliquidacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  gastosViaticos(pagina : number, cantidad: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/viaticos-preliquidacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  documentosSuntentatorios(pagina : number, cantidad: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/documentos-sustentatorios-preliquidacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  //REGISTRO COMPROBANTES
  listarRegistroComprobante(pagina : number, cantidad: number): Observable<WsResponseRegistroComprobante> {
    return this.http.get<WsResponseRegistroComprobante>('assets/tbl-registroComprobante-preliquidacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarRegistroComprobanteSubTotal(pagina : number, cantidad: number): Observable<WsResponseRegistroComprobanteSubTotal> {
    return this.http.get<WsResponseRegistroComprobanteSubTotal>('assets/tbl-registroComprobanteSubTotal-preliquidacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }
  

  //REPORTES
  generaReporteManifiestoGasto() {
    return this.http.get(`${environment.backendUrlProj}/preLiquidacion/reporteManifiestoGasto`, { responseType: 'blob' });
  }
  
   generaReporteResumenEstadoFinanciero() {
    return this.http.get(`${environment.backendUrlProj}/preLiquidacion/reporteResumenEstadoFinanciero`, { responseType: 'blob' });
  }
  
  generarReporteValorizacionAvance() {
    return this.http.get(`${environment.backendUrlProj}/preLiquidacion/reporteValorizacionAvance`, { responseType: 'blob' });
  }

  generarReporteCronogramaAvanceProyecto() {
    return this.http.get(`${environment.backendUrlProj}/preLiquidacion/reporteCronogramaAvanceProyecto`, { responseType: 'blob' });
  }
  //AGREGAR DOCUMENTO

  documentosTabla(pagina : number, cantidad: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/documentos-tabla-preliquidacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  //VALORIZACION AVANCE
  listarValorizacionAvance(pagina : number, cantidad: number): Observable<WsResponseValorizacionAvance> {
    return this.http.get<WsResponseValorizacionAvance>('assets/tbl-valorizacionAvance-preliquidacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  grabarFilaValorizacion(lista: ValorizacionAvance[]): Observable<WsResponseValorizacionAvance> {
     return this.http.post<WsResponseValorizacionAvance>(`${environment.backendUrlProj}/preLiquidacion/grabarFilaValorizacion`, lista);
  }

  //RESUMEN MOVIMIENTO ALMACEN
  listarResumenMovimientosAlmacen(pagina : number, cantidad: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/tbl-resumenMovimientosAlmacen-preliquidacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  
}
