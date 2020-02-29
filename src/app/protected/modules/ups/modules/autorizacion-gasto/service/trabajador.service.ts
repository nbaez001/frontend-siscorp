import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { WsResponseProyecto } from '../dto/response/Proyecto';
import { Observable, throwError } from 'rxjs';
import { WsItemBeanResponse } from '../dto/response/ItemBean';
import { FileRequest } from '../dto/request/FileRequest';
import { WsApiOutResponse } from '../../expediente/dto/response/WsApiOutResponse';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Sunat } from '../dto/response/Sunat';
import { Reniec } from '../dto/response/Reniec';

@Injectable()
export class TrabajadorService {

  constructor(private http: HttpClient) { }

  obtenerListadoTrabajador(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/trabajador.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  obtenerTrabajador(idCodigo: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/obtenerTrabajador.json');
  }

  downloadFile(idCodigoArchivo, fileName) {
    const REQUEST_URI = `${environment.backendUrlProj}/prefactibilidadProyectos/descargarArchivo/${idCodigoArchivo}/${fileName}`;
    return this.http.get(REQUEST_URI, {
      responseType: 'arraybuffer'
    })
  }

  obtenerGeneroTrabajador(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboGenero.json`);
  }

  obtenerCargoProfesionalesNE(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboCargoProfesionalesNE.json`);
  }

  obtenerCargoMiembrosNE(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboCargoMiembrosNE.json`);
  }

  
  obtenerTipoColegiatura(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboTipoColegiatura.json`);
  }

  obtenerCategoriaTrabajador(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboCategoria.json`);
  }

  obtenerTipoTrabajador(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboTipo.json`);
  }

  obtenerTipoContratoTrabajador(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboTipoContrato.json`);
  }

  obtenerTipoDocumento(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboTipoDocumento.json`);
  }

  obtenerTipoPersona(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboTipoPersona.json`);
  }

  obtenerRubro(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboRubro.json`);
  }

  obtenerPeriodoAnio(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/listadoPeriodoAnio.json`);
  }

  obtenerPeriodoMes(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/listadoPeriodoMes.json`);
  }

  obtenerListadoAsistenciaTareo(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/listarAsistenciaTareo.json');
  }

  obtenerListadoAsistenciaTareoPorDia(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/listarAsistenciaTareo.json');
  }

  subirArchivo(request: FileRequest): Observable<WsApiOutResponse> {
    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('nomArchivo', request.nomArchivo);
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/subirArchivo`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }

  subirCotizacion(request: FileRequest): Observable<WsApiOutResponse> {
    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('nomArchivo', request.nomArchivo);
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/subirArchivo`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }

  private getEventMessage(event: HttpEvent<any>, formData) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);

      case HttpEventType.Response:
        return this.apiResponse(event);

      default:
        return `evento_${event.type}`;
    }
  }

  private fileUploadProgress(event) {
    const percentDone = Math.round(100 * event.loaded / event.total);
    return { status: 'progress', message: percentDone / 2 };
  }

  private apiResponse(event) {
    return event.body;
  }

  private handleError(error: HttpErrorResponse) {
    
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Algo malo sucedio. Por favor, inténtelo de nuevo más tarde.');
  }

  obtenerListadoDepartamento(): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/listadoDepartamento.json');
  }

  obtenerListadoProvincia(idDepartamento: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/listadoProvincia.json');
  }

  obtenerListadoDistrito(idProvincia: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/listadoDistrito.json');
  }

  obtenerEstado(): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/comboEstado.json');
  }

  // REPORTES
  generaReporteTareo() {
    return this.http.get(`${environment.backendUrlProj}/autorizacionGastoTrabajador/reporteTareoTrabajador`, { responseType: 'blob' });
  }

  generaReporteJornal() {
    return this.http.get(`${environment.backendUrlProj}/autorizacionGastoTrabajador/reporteJornalTrabajador`, { responseType: 'blob' });
  }

  generaCalculoPagoMensual() {
    return this.http.get(`${environment.backendUrlProj}/autorizacionGastoTrabajador/reportePagoMensual`, { responseType: 'blob' });
  }

  generaReporteAutorizacionGasto() {
    return this.http.get(`${environment.backendUrlProj}/autorizacionGastoTrabajador/reporteAutorizacionGasto`, { responseType: 'blob' });
  }

  generaReporteCuadroComparativo() {
    return this.http.get(`${environment.backendUrlProj}/autorizacionGastoTrabajador/reporteCuadroComparativo`, { responseType: 'blob' });
  }

  generaReporteInformeTecnico() {
    return this.http.get(`${environment.backendUrlProj}/autorizacionGastoTrabajador/reporteInformeTecnico`, { responseType: 'blob' });
  }

  // CALCULO PAGO MENSUAL
  obtenerTrabajadorCalculoPagoMensual(idCodigo: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/obtenerTrabajadorCalculoPagoMensual.json');
  }

  obtenerListadoCalculoPagoMensual(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/listadoTrabajadorCalculoPagoMensual.json');
  }

  obtenerCalculoPagoMensual(idCodigo: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/obtenerCalculoPagoMensual.json');
  }

  // PROVEEDOR
  obtenerListadoProveedor(pagina: number, cantidad: number, filtrosTrabajadorRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/proveedor.json');
  }

  obtenerProveedor(idCodigo: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/obtenerProveedor.json');
  }

  adjuntarCotizacionProveedor(idCodigo: number): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/obtenerAdjuntarCotizacionProveedor.json');
  }

  obtenerFormaPago(): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/comboFormaPago.json');
  }

  obtenerListadoCotizacion(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/listadoCotizacion.json');
  }

  busquedaDataProveedor(numero: string) {
    return this.http.get<WsResponseProyecto>('assets/dataSunat2.json');
  }

  busquedaDataPersona(numero: string) {
    return this.http.get<WsResponseProyecto>('assets/dataReniec.json');
  }

  obtenerDataWsSunat(numero: string): Observable<Sunat> {
    return this.http.get<any>(`http://192.168.10.23:8071/consultas/sunat?documento=${numero}`);
  }

  obtenerDataWsReniec(numero: string): Observable<Reniec> {
    return this.http.get<any>(`http://192.168.10.23:8071/consultas/reniec?documento=${numero}`);
  }

}