import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { WsResponse, WsApiOutResponse, ArchivoRequest } from '../dto/archivo-pendiente';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import * as fileSaver from 'file-saver';

@Injectable()
export class ArchivoExpedienteService {

  constructor(
    private http: HttpClient
  ) { }

  listadoBandejaPendiente(pagina: number, cantidad: number, filtrosRequest): Observable<WsResponse> {
    return this.http.get<WsResponse>('assets/bandejaArchivosExpediente.json');
  }

  obtenerCrpProyecto(): Observable<WsResponse> {
    return this.http.get<WsResponse>(`assets/combo_crp.json`);
  }
  obtenerEstadoTambo(): Observable<WsResponse> {
    return this.http.get<WsResponse>(`assets/combo_estado_exp_tec.json`);
  }

  // ************************************** SUBIDA DE ARCHIVOS *************************************************
  listadoArchivoXlsProyecto(idProyecto: number): Observable<WsResponse> {
    return this.http.get<WsResponse>(`${environment.backendUrlProj}/filexlsproyecto/listarArchivoXlsPorProyecto/${idProyecto}`);
  }

  obtenerTipoModalidad(): Observable<WsResponse> {
    return this.http.get<WsResponse>(`${environment.backendUrlProj}/filexlsproyecto/listarModalidad`);
  }

  obtenerTipoDocumento(): Observable<WsResponse> {
    return this.http.get<WsResponse>(`${environment.backendUrlProj}/filexlsproyecto/listarTipoArchivo`);
  }

  validarDocumentoExcel(idProyecto: number, tipoArchivo: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/filexlsproyecto/validarFile/${idProyecto}/${tipoArchivo}`, { responseType: 'blob' });
  }

  downloadFile(idCodigoArchivo) {
    const REQUEST_URI = `${environment.backendUrlProj}/filexlsproyecto/descargarArchivo/${idCodigoArchivo}`;
    return this.http.get(REQUEST_URI, { responseType: 'arraybuffer' })
  }

  cargarRdExpedienteTecnico(request: ArchivoRequest): Observable<WsApiOutResponse> {
    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('idProyecto', request.idProyecto.toString());
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/filexlsproyecto/validarCargaRdExpedienteTecnico`, formData, {
      reportProgress: false,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }

  cargarExcelPresupuesto(request: ArchivoRequest): Observable<WsApiOutResponse> {
    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('idProyecto', request.idProyecto.toString());
    formData.append('idTipoModalidad', request.idTipoModalidad.toString());
    // formData.append('descripcion', request.descripcion);
    /*formData.append('nomArchivo', request.nomArchivo);
      formData.append('idTipoArchivo', request.tipoDoc); */
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/filexlsproyecto/validarCargaExcelPresupuesto`, formData, {
      reportProgress: false,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }

  cargarExcelPartida(request: ArchivoRequest): Observable<WsApiOutResponse> {
    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('idProyecto', request.idProyecto.toString());
    // formData.append('descripcion', request.descripcion);
    /*formData.append('nomArchivo', request.nomArchivo);
      formData.append('idTipoArchivo', request.tipoDoc); */
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/filexlsproyecto/validarCargaExcelPartida`, formData, {
      reportProgress: false,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }

  cargarExcelGastoGeneral(request: ArchivoRequest): Observable<WsApiOutResponse> {
    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('idProyecto', request.idProyecto.toString());
    // formData.append('descripcion', request.descripcion);
    /*formData.append('nomArchivo', request.nomArchivo);
      formData.append('idTipoArchivo', request.tipoDoc); */
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/filexlsproyecto/validarCargaExcelGastoGeneral`, formData, {
      reportProgress: false,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }

  cargarExcelGastoSupervicion(request: ArchivoRequest): Observable<WsApiOutResponse> {
    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('idProyecto', request.idProyecto.toString());
    // formData.append('descripcion', request.descripcion);
    /* formData.append('nomArchivo', request.nomArchivo);
       formData.append('idTipoArchivo', request.tipoDoc); */
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/filexlsproyecto/validarCargaExcelGastoSupervision`, formData, {
      reportProgress: false,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }

  cargarExcelPartidaTxtError(nombreListado: string): void {
    const formData = new FormData();
    formData.append('nombreListado', nombreListado);
    this.http.post(`${environment.backendUrlProj}/ejecucionProyectos/verTxtErrores`, formData, { responseType: 'blob' }).subscribe((b) => {
      fileSaver.saveAs(b, 'error_excel.txt');
    });
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

}
