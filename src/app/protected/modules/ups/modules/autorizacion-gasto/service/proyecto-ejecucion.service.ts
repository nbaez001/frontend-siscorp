import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WsResponseProyecto } from '../dto/response/Proyecto';
import { Observable } from 'rxjs';
import * as fileSaver from 'file-saver';
import { WsResponseInsumo } from '../dto/response/Insumo';
import { WsResponseProgramacion } from '../dto/response/Programacion';
import { WsResponseAutorizacion } from '../dto/response/Autorizacion';
import { environment } from 'environments/environment';
import { WsResponseArchivoProyecto } from '../dto/response/ArchivoProyecto';
import { WsResponseDatoProyecto } from '../dto/response/DatoProyecto';
import { WsResponseDatoProfesional } from '../dto/response/DatoProfesional';


@Injectable()
export class ProyectoEjecucionService{


  constructor(private http: HttpClient) { }

  proyectoEjecucionFiltros(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/proyecto.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listaProyectoEjecucionFiltros(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    // return this.http.get<WsResponseProyecto>('assets/proyecto.json');
    return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/bandejaProyectoAurizacionGasto/listarProyectoEjecucion/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  // cronogramaJsonFullChildren(parametroRequest) {
  //   const formData = new FormData();
  //   formData.append('idMovimientoProyecto', parametroRequest.idMovimientoProyecto);
  //   return this.http.post<any>(`${environment.backendUrlProj}/ejecucionProyectos/llenarCronogramaPartidas`, formData, { reportProgress: true })
  //     .toPromise();
   
  // }

  listadoBandejaPendiente(pagina : number, cantidad: number, filtrosRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/bandejaDocumentosPendientes.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }


  listarCartaFianza(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/cartaFianza.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }


  generarExcelProyectoEjecucion(pagina : number, cantidad: number,filtrosProyectoRequest): void {
    this.http
     // .post(`${environment.backendUrlProj}/prefactibilidadProyectos/exportExcel/${pagina}/${cantidad}`, filtrosProyectoRequest, {responseType: 'blob'})
     .get('assets/proyecto.json', {responseType: 'blob'})
      .subscribe((b) => {
        fileSaver.saveAs(b, 'proyecto_ejecución.xls');
      });
  }


  insumoListar(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseInsumo> {
    return this.http.get<WsResponseInsumo>('assets/insumolista.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  programacionListar(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProgramacion> {
    return this.http.get<WsResponseProgramacion>('assets/programacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }


  autorizacionFiltros(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseAutorizacion> {
    return this.http.get<WsResponseAutorizacion>('assets/autorizacion.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarArchivoProyecto(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseArchivoProyecto> {
    return this.http.get<WsResponseArchivoProyecto>('assets/archivoProyecto.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }


  detalleProyecto(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/proyectoDetalle.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listarArchivoInforme(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseArchivoProyecto> {
    return this.http.get<WsResponseArchivoProyecto>('assets/listadoArchivo.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }


  cartaFianzaDetalle(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/cartaFianzaDetalle.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  //*******************************************************************

  // CARGA CRONOGRAMA DE EJECUCIÃ“N
  cronogramaJsonFullChildren(parametroRequest) {
    const formData = new FormData();
    formData.append('idMovimientoProyecto', parametroRequest.idMovimientoProyecto);
    return this.http.post<any>(`${environment.backendUrlProj}/ejecucionProyectos/llenarCronogramaPartidas`, formData, { reportProgress: true })
      .toPromise();
      // .then(res => <TreeNode[]>res.data);
  }

  // CARGA CRONOGRAMA INSUMO
  insumoJsonFullChildren(parametroRequest) {  
    const formData = new FormData();
    formData.append('idMovimientoProyecto', parametroRequest.idMovimientoProyecto);
    return this.http.post<any>(`${environment.backendUrlProj}/ejecucionProyectos/llenarCronogramaInsumos`, formData, { reportProgress: true })
      .toPromise();
      // .then(res => <TreeNode[]>res.data);
  }

  obtenerTotalCronogramaEjecucion() {
    return this.http.get<any>('assets/totalCronogramaEjecucion.json').toPromise();//.then(res => <any>res.data);
  }

  obtenerTotalCronogramaInsumo() {
    return this.http.get<any>('assets/totalCronogramaInsumo.json').toPromise();//.then(res => <any>res.data);
  }

  getInsumoTotales() {
    return this.http.get<any>('assets/insumoTotalJsonWebService.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  listarPartidaRecurso(pagina: number, cantidad: number): Observable<any> {
    return this.http.get<any>('assets/requerimiento.json');
  }

/*WHR INICIO*/
  cargarListaEncargados(parametrosBody): Observable<WsResponseDatoProfesional> { 
    return this.http.post<WsResponseDatoProfesional>(`${environment.backendUrlProj}/datosProyectoAutorizacion/cargarListaEncargados`, parametrosBody);
  }
  cargarListaEjecutores(parametrosBody): Observable<WsResponseDatoProfesional> { 
    return this.http.post<WsResponseDatoProfesional>(`${environment.backendUrlProj}/datosProyectoAutorizacion/cargarListaEjecutores`, parametrosBody);
  }
  cargarDatosProyecto(parametrosBody): Observable<WsResponseDatoProyecto> {
    return this.http.post<WsResponseDatoProyecto>(`${environment.backendUrlProj}/datosProyectoAutorizacion/cargarDatosProyecto`, parametrosBody);
  }
  listarCarrusel(parametrosBody): Observable<WsResponseDatoProfesional> {
    return this.http.post<WsResponseDatoProfesional>(`${environment.backendUrlProj}/datosProyectoAutorizacion/cargarListaEjecutores`, parametrosBody);
  }
  
/*WHR FIN*/
  //*******************************************************************
}

export interface TreeNode {
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
}
