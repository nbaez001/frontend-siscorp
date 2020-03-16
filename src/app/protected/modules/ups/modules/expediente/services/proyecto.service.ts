import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { WsResponseProyecto } from '../dto/response/ProyectoResponse';
import { Session } from '@shared/auth/Session';
import { ExcelDownloadResponse } from '../entities/ExcelDownloadResponse';
import { WsApiOutResponse } from '../dto/response/WsApiOutResponse';
import { ArchivoResponse, WsResponseArchivo } from '../dto/response/ArchivoResponse';
import { WsResponseObservacion } from '../entities/observacion';
import { ArchivoRequest } from '../dto/request/ArchivoRequest';
import { map, catchError } from 'rxjs/operators';
import * as fileSaver from 'file-saver';
import { ChatService } from 'app/protected/modules/chat/services/chat.service';



@Injectable()
export class ProyectoService {

  constructor(private http: HttpClient, private chatService: ChatService) { }



  /*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
  /*----------------------------------------------------------- JEFE DE UNIDAD DE PLATAFORMA DE SERVICIOS --------------------------------------------------- */
  /*--------------------------------------------------------------------------------------------------------------------------------------------------------- */


  proyectoFiltros(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }


  asignarDerivarCorrdinador(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/derivarDesdeBandejaJefe`, ParametroRequest);
  }


  devolverPerfilPrefactbilidad(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/devolverDesdeBandejaJefe`, ParametroRequest);
  }

  generarExcelBandejaPrefactibilidad(pagina: number, cantidad: number, filtrosProyectoRequest): void {
    this.http
      .post(`${environment.backendUrlProj}/prefactibilidadProyectos/exportExcel/${pagina}/${cantidad}`, filtrosProyectoRequest, { responseType: 'blob' })
      .subscribe((b) => {
        fileSaver.saveAs(b, 'descarga_expediente.xls');
      });
  }



  visualizarroyecto(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/verDetalleBandejaJefe`, ParametroRequest);
  }


  totalPendientesProyecto(): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/totalPendientes`, null);
  }


  listarObservacionesProyecto(pagina: number, cantidad: number, ParametroRequest): Observable<WsResponseObservacion> {
    return this.http.post<WsResponseObservacion>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarObservaciones/${pagina}/${cantidad}`, ParametroRequest);
  }

  registrarObservacionProyecto(ParametroRequest): Observable<WsResponseObservacion> {
    return this.http.post<WsResponseObservacion>(`${environment.backendUrlProj}/prefactibilidadProyectos/registrarObservacion`, ParametroRequest);
  }

  registrarAusenciaJefe(AusenciaJefeRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/registrarAusenciaJefe`, AusenciaJefeRequest);
  }

  retornarAusenciaJefe(): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/registrarRetornoJefe`, null);
  }

  listarArchivoUpp(): Observable<WsApiOutResponse> {
    return this.http.get<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarArchivoUPP`);
  }

  aprobacionDelJefe(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/aprobacionDelJefe`, ParametroRequest);
  }


  rechazoDelJefe(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/rechazoDelJefe`, ParametroRequest);
  }


  obternerToken(idUsuario: number) {
    return this.http.get<any[]>(`${environment.backendUrlProj}/appChat/obtenerCidSocketUsuarioPorId?idUsuario=${idUsuario}`);
  }


  obtenerUsuarioPorTipoUsuario(tipoUsuario: string) {
    return this.http.get<number>(`${environment.backendUrlProj}/prefactibilidadProyectos/obtenerIdUsuario?tipoUsuario=${tipoUsuario}`);
  }


  /*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
  /*-------------------------------------------------------------- COORDINADOR DE PLATAFORMA FIJA ----------------------------------------------------------- */
  /*--------------------------------------------------------------------------------------------------------------------------------------------------------- */

  asignarEncargadoDeBandejaCoordinador(ParametroCoordinadorAsignarRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/asignarDesdeBandejaCoordinador`, ParametroCoordinadorAsignarRequest);
  }


  derivarEncargadoDeBandejaCoordinador(ParametroCoordinadorAsignarRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/derivarDesdeBandejaCoordinador`, ParametroCoordinadorAsignarRequest);
  }


  visualizarProyectoCoordinador(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/verDetalleBandejaCoordinador`, ParametroRequest);
  }

  devolverDesdeBandejaCordinador(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/devolverDesdeBandejaCoordinador`, ParametroRequest);
  }

  enviarParaAprobacionJefe(ParametroCoordinadorAsignarRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/aprobacionDelCoordinador`, ParametroCoordinadorAsignarRequest);
  }


  rechazoDelCoordinador(ParametroCoordinadorAsignarRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/rechazoDelCoordinador`, ParametroCoordinadorAsignarRequest);
  }

  enviarRechazoCoordinadorAEncargado(ParametroCoordinadorAsignarRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/enviarRechazoCoordinadorAEncargado`, ParametroCoordinadorAsignarRequest);
  }


  /*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
  /*------------------------------------------------------------- ENCARGADO DE EXPEDIENTE TECNICO ----------------------------------------------------------- */
  /*--------------------------------------------------------------------------------------------------------------------------------------------------------- */

  visualizarProyectoEncargado(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/verDetalleBandejaEncargado`, ParametroRequest);
  }

  darConformidadEncargado(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/darConformidad`, ParametroRequest);
  }

  asignarEquipoElaboradorEncargado(ProfesionalRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/asignarEquipoElaborador`, ProfesionalRequest);
  }

  asignarEquipoRevisorEncargado(ProfesionalRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/asignarEquipoEvaluador`, ProfesionalRequest);
  }

  listarArchivo(idMovimientoProyecto: number): Observable<WsApiOutResponse> {
    return this.http.get<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarArchivo/${idMovimientoProyecto}`);
  }

  eliminarArchivo(idCodigoArchivo: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/eliminarArchivo`, idCodigoArchivo);
  }

  observadoDesdeBandejaEncargado(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/obervadoDesdeBandejaEncargado`, ParametroRequest);
  }

  devolverDesdeBandejaEncargado(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/devolverDesdeBandejaEncargado`, ParametroRequest);
  }

  enviarParaAprobacionCoordinador(ParametroCoordinadorAsignarRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/enviaAlCoordinadorParaAprobacion`, ParametroCoordinadorAsignarRequest);
  }



  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------- */
  /*------------------------------------------------------------- JEFE ELABORADOR DE EXPEDIENTE TECNICO ----------------------------------------------------------- */
  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------- */


  visualizarProyectoJefeElaborador(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/verDetalleBandejaJefeElaborador`, ParametroRequest);
  }


  downloadFile(idCodigoArchivo, fileName) {
    const REQUEST_URI = `${environment.backendUrlProj}/prefactibilidadProyectos/descargarArchivo/${idCodigoArchivo}/${fileName}`;
    return this.http.get(REQUEST_URI, {
      responseType: 'arraybuffer'
    })
  }

  subirArchivo(request: ArchivoRequest): Observable<WsApiOutResponse> {

    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('nomArchivo', request.nomArchivo);
    formData.append('idMovimientoProyecto', request.idProyecto);
    formData.append('descripcion', request.descripcion);
    formData.append('idTipoArchivo', request.tipoDoc + "");

    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/subirArchivo`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }




  cargarExcelPresupuesto(request: ArchivoRequest): Observable<WsApiOutResponse> {

    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('idMovimientoProyecto', request.idProyecto);
    formData.append('descripcion', request.descripcion);
    /*formData.append('nomArchivo', request.nomArchivo);
      formData.append('idTipoArchivo', request.tipoDoc); */

    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/ejecucionProyectos/validarCargaExcelPresupuesto`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }

  cargarExcelPartida(request: ArchivoRequest): Observable<WsApiOutResponse> {

    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('idMovimientoProyecto', request.idProyecto);
    formData.append('descripcion', request.descripcion);
    /*formData.append('nomArchivo', request.nomArchivo);
      formData.append('idTipoArchivo', request.tipoDoc); */

    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/ejecucionProyectos/validarCargaExcelPartida`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }

  cargarExcelGastoGeneral(request: ArchivoRequest): Observable<WsApiOutResponse> {

    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('idMovimientoProyecto', request.idProyecto);
    formData.append('descripcion', request.descripcion);
    /*formData.append('nomArchivo', request.nomArchivo);
      formData.append('idTipoArchivo', request.tipoDoc); */

    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/ejecucionProyectos/validarCargaExcelGastoGeneral`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }



  cargarExcelGastoSupervicion(request: ArchivoRequest): Observable<WsApiOutResponse> {

    const formData = new FormData();
    formData.append('file', request.archivo);
    formData.append('idMovimientoProyecto', request.idProyecto);
    formData.append('descripcion', request.descripcion);
    /* formData.append('nomArchivo', request.nomArchivo);
       formData.append('idTipoArchivo', request.tipoDoc); */

    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/ejecucionProyectos/validarCargaExcelGastoSupervision`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError)
    );
  }



  cargarExcelPartidaTxtError(nombreListado: string): void {
    const formData = new FormData();
    formData.append('nombreListado', nombreListado);
    this.http
      .post(`${environment.backendUrlProj}/ejecucionProyectos/verTxtErrores`, formData, { responseType: 'blob' })
      .subscribe((b) => {
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


  obtenerTokenUsuarioEnviarSocket(idUsuario: number, expediente: string) {
    this.obternerToken(idUsuario).subscribe(response => {
      if (response) {

        response.forEach(element => {
          if (expediente == "expediente") {
            this.chatService.enviarCidSocketChannel(element.cidsocket, 'expediente');
            this.chatService.enviarCidSocketChannel(element.cidsocket, 'contadorMenu', 'expediente');
          } else {
            this.chatService.enviarCidSocketChannel(element.cidsocket, 'contadorMenu', 'expediente');
          }
        })
      }
    });
  }


  ejecucionProyectos(pagina: number, cantidad: number, filtrosProyectoRequest): void {
    this.http
      .post(`${environment.backendUrlProj}/prefactibilidadProyectos/ejecucionProyectos/${pagina}/${cantidad}`, filtrosProyectoRequest, { responseType: 'blob' })
      .subscribe((b) => {
        fileSaver.saveAs(b, 'erro_formato.xls');
      });
  }

  validarDocumentoExcel(idProyecto: number, tipoArchivo: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/validarFile/${idProyecto}/${tipoArchivo}`, { responseType: 'blob' });
  }


  /* INICIO VISUALIZAR ARCHIVOS TEMPORALES DEL PRESUPUESTO*/
  visualizarArchivoExcelPresupuesto(fidProyecto: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/listarFilePresupuesto/${fidProyecto}`, { reportProgress: true });
  }

  visualizarArchivoExcelPartida(fidProyecto: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/listarFilePrecioUnitario/${fidProyecto}`, { reportProgress: true });
  }

  visualizarArchivoExcelGeneral(fidProyecto: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/listarFileGastoGeneral/${fidProyecto}`, { reportProgress: true });
  }

  visualizarArchivoExcelSupervision(fidProyecto: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/listarFileGastoSupervision/${fidProyecto}`, { reportProgress: true });
  }
  /* FIN VISUALIZAR ARCHIVOS TEMPORALES DEL PRESUPUESTO*/


  aceptarConformidadArchivo(idCodigoArchivo: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/aceptarArchivo`, idCodigoArchivo);
  }

  /* VISUALIZAR ARCHIVOS FINALES DEL PRESUPUESTO */
  visualizarArchivoExcelPresupuestoFinal(fidProyecto: number, idPadre: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/listarFileTreePadre/${fidProyecto}/${idPadre}`, { reportProgress: true });
  }

  visualizarArchivoExcelPresupuestoFinalHijos(fidProyecto: number, idPadre: number, nivel: string): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/obtenerFileTreeHijoPresupuesto/${fidProyecto}/${idPadre}/${nivel}`, { reportProgress: true });
  }

  /* VISUALIZAR ARCHIVOS FINALES DE ANALISIS DE PRECIOS UNITARIOS */
  visualizarArchivoExcelPartidaFinal(fidProyecto: number, idPadre: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/listarFileTreePadre/${fidProyecto}/${idPadre}`, { reportProgress: true });
  }

  visualizarArchivoExcelPartidaFinalHijoPartida(fidProyecto: number, idPadre: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/obtenerFileTreePartida/${fidProyecto}/${idPadre}`, { reportProgress: true });
  }

  visualizarArchivoExcelPartidaFinalHijoCategoria(idPartida: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/obtenerFileTreePartidaCategoria/${idPartida}`, { reportProgress: true });
  }

  visualizarArchivoExcelPartidaFinalHijoInsumo(idPartida: number, idCategoria: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/obtenerFileTreePartidaInsumo/${idPartida}/${idCategoria}`, { reportProgress: true });
  }

  /* VISUALIZAR ARCHIVOS FINALES DE GASTOS GENERALES */
  visualizarArchivoExcelGeneralFinal(fidProyecto: number, idPadre: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/listarFileTreeGastoGeneralPadre/${fidProyecto}/${idPadre}`, { reportProgress: true });
  }

  visualizarArchivoExcelGeneralFinalHijos(fidProyecto: number, idPadre: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/obtenerFileTreeGastoGeneralHijo/${fidProyecto}/${idPadre}`, { reportProgress: true });
  }

  /* VISUALIZAR ARCHIVOS FINALES DE GASTOS SUPERVISIÓN */
  visualizarArchivoExcelSupervisionFinal(fidProyecto: number, idPadre: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/listarFileTreeGastoSupervisionPadre/${fidProyecto}/${idPadre}`, { reportProgress: true });
  }

  visualizarArchivoExcelSupervisionFinalHijos(fidProyecto: number, idPadre: number): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadFile/obtenerFileTreeGastoSupervisionHijo/${fidProyecto}/${idPadre}`, { reportProgress: true });
  }

}