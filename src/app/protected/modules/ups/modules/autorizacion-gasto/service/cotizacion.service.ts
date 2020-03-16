import { Injectable } from '@angular/core';
import { WsResponseCotizacion } from '../dto/response/Cotizacion';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as fileSaver from 'file-saver';
import { WsItemBeanResponse } from '../dto/response/ItemBean';
import { WsResponseInsumoProveedor } from '../dto/response/InsumoProveedor';
import { environment } from 'environments/environment';
import { Car } from '../components/revisor/cotizacion/cuadro-comparativo/cuadro-comparativo.component';
import { WsResponse } from '../dto/response/Proyecto';

@Injectable()
export class CotizacionService {


  constructor(private http: HttpClient) { }

  //******************************************************************** */
  //**************************** HECTOR SERVICIOS ********************** */
  listarBandejaAutorizacionGasto(idProyecto: number, pagina: number, cantidad: number, filtrosRequest): Observable<any> {
    return this.http.post<WsResponse>(`${environment.backendUrlProj}/autorizacionGasto/listar/${idProyecto}/${pagina}/${cantidad}`, filtrosRequest);
  }

  listarHistorialAutorizacionGasto(idProyecto: number, pagina: number, cantidad: number): Observable<any> {
    return this.http.get<WsResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarHistorial/${idProyecto}/${pagina}/${cantidad}`);
  }

  listarCargarDataCostoDirecto(idProyecto: number, idAutoGasto: number, filtrosRequestCostoDirecto): Observable<any> {
    return this.http.post<WsResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarInsumoCostoDirecto/${idProyecto}/${idAutoGasto}/`, filtrosRequestCostoDirecto);
  }

  registroAutorizacionGasto(autorizacionGasto) {
    return this.http.post<any>(`${environment.backendUrlProj}/autorizacionGasto/registroAutoGastoCostoDirecto/`, autorizacionGasto);
  }

  eliminarAutoGastoCostoDirecto(idAutoGasto: number) {
    return this.http.get<any>(`${environment.backendUrlProj}/autorizacionGasto/eliminarAutoGastoCostoDirecto/${idAutoGasto}`);
  }



  listarCargarDataGastosGenerales(idProyecto: number): Observable<any> {
    return this.http.get<WsResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarInsumoGastosGenerales/${idProyecto}`);
  }

  listarCargarDataGastosResidente(idProyecto: number): Observable<any> {
    return this.http.get<WsResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarInsumoGastosResidente/${idProyecto}`);
  }

  listarAutocompleteInsumos(idProyecto: number, idCategoria: number): Observable<any> {
    return this.http.get<WsResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarAutocompleteInsumos/${idProyecto}/${idCategoria}`);
  }

  listarAutocompletePartida(idProyecto: number): Observable<any> {
    return this.http.get<WsResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarPartidaAutocompleteInsumos/${idProyecto}/`);
  }

  cargaCategoriaAutocompleteInsumo(): Observable<any> {
    return this.http.get<WsResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarCategoriaAutocompleteInsumos/`);
  }

  crearRecurso(idProyecto: number, idAutoGasto: number, recurso, sustento): Observable<any> {
    return this.http.post<WsResponse>(`${environment.backendUrlProj}/autorizacionGasto/crearRecurso/${idProyecto}/${idAutoGasto}/`, recurso, sustento);
  }


  //*********************** PDF ********************************************** */
  generaReporteDetalleAutoGasto() {
    return this.http.get(`${environment.backendUrlProj}/autorizacionGasto/reporteDetalleAutoGasto`, { responseType: 'blob' });
  }

  generaReporteDescuentoSupervisorAutoGasto() {
    return this.http.get(`${environment.backendUrlProj}/autorizacionGasto/reporteDescuentoSupervisorAutoGasto`, { responseType: 'blob' });
  }

  reporteCuadroControlAutoGasto() {
    return this.http.get(`${environment.backendUrlProj}/autorizacionGasto/reporteCuadroControlAutoGasto`, { responseType: 'blob' });
  }

  // reporteJasperToWord() {
  //  return this.http.get(`${environment.backendUrlProj}/autorizacionGasto/reporteJasperToWord`, { responseType: 'blob' });
  // }



  //******************************************************************** */
  //******************************************************************** */















  listarRequerimientos(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/requerimiento.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarCotizaciones(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseCotizacion> {
    return this.http.get<WsResponseCotizacion>('assets/cotizacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarResumenAutorizacion(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/resumenRegistroAutorizacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  dataProyecto(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/dataGeneralProyecto.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }


  generarExcelCotizacion(pagina: number, cantidad: number, filtrosProyectoRequest): void {
    this.http
      // .post(`${environment.backendUrlProj}/prefactibilidadProyectos/exportExcel/${pagina}/${cantidad}`, filtrosProyectoRequest, {responseType: 'blob'})
      .get('assets/cotizacion.json', { responseType: 'blob' })
      .subscribe((b) => {
        fileSaver.saveAs(b, 'cotizacion.xls');
      });
  }

  //#######################################################################################


  listarCargarDataGastosSupervision(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/dataGastosSupervision.json');
  }

  totalCargarDataGastosSupervision(id: number): Observable<any> {
    return this.http.get<any>('assets/dataGastosSupervisionTotal.json');
  }

  listarCargarDataGastosFinanciero(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/dataGastosFinanciero.json');
  }

  totalCargarDataGastosFinanciero(id: number): Observable<any> {
    return this.http.get<any>('assets/dataGastosFinancieroTotal.json');
  }

  listarCargarDataGastosNucleo(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/dataGastosNucleo.json');
  }

  totalCargarDataGastosNucleo(id: number): Observable<any> {
    return this.http.get<any>('assets/dataGastosNucleoTotal.json');
  }


  listarCargarRecursoPartida(id: number): Observable<any> {
    return this.http.get<any>('assets/dataRecursoPartida.json');
  }

  listarCargarEditarRecursoPartida(id: number): Observable<any> {
    return this.http.get<any>('assets/dataEditarRecursoPartida.json');
  }





  //#######################################################################################

  listarInsumos(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/insumoCotizacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarInsumosGastoGeneral(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/insumoCotizacionGastoGenerales.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarInsumosGastoResidente(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/insumoGastoResidente.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }


  listarInsumosGastoFinanciero(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/insumoGastoFinanciero.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarInsumosGastoNucleoEjecutor(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/insumoNucleoEjecutor.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarInsumosGastoSupervisor(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<any> {
    return this.http.get<any>('assets/insumoGastoSupervision.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  //#############################

  obtenerRubro(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboRubro.json`);
    /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }


  obtenerProveedores(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboProveedor.json`);
    /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }

  listarInsumosCotizados(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseInsumoProveedor> {
    return this.http.get<WsResponseInsumoProveedor>('assets/listarInsumosCotizados.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarInsumosCotizadosProv01(pagina: number, cantidad: number, filtrosProyectoRequest) {
    return this.http.get<WsResponseInsumoProveedor>('assets/listarInsumosCotizadosProv01.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
    /* return this.http.get<any>('assets/cronogramaTotalJsonWebService.json')
      .toPromise()
      .then(res => <any>res.data); */
  }

  getCarsSmall() {
    return this.http.get<any>('assets/cars.json')
      .toPromise()
      .then(res => <Car[]>res.data)
      .then(data => { return data; });
  }




  listarInsumosCotizadosProv02(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseInsumoProveedor> {
    return this.http.get<WsResponseInsumoProveedor>('assets/listarInsumosCotizadosProv02.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarInsumosCotizadosProv03(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseInsumoProveedor> {
    return this.http.get<WsResponseInsumoProveedor>('assets/listarInsumosCotizadosProv03.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }
  listarInsumosCotizadosProv04(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseInsumoProveedor> {
    return this.http.get<WsResponseInsumoProveedor>('assets/listarInsumosCotizadosProv04.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  // REPORTES
  generaInsumoCotizacion() {
    return this.http.get(`${environment.backendUrlProj}/autorizacionGastoTrabajador/reporteInsumoCotizacion`, { responseType: 'blob' });
  }

  listarInsumosDinamico(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseInsumoProveedor> {
    return this.http.get<WsResponseInsumoProveedor>('assets/listarInsumoDinamico.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

}