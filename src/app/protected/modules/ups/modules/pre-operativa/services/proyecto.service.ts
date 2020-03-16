import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import * as fileSaver from 'file-saver';

import { environment } from 'environments/environment';

import { WsResponseDatoProyecto } from '../dto/Response/DatoProyectoResponse';
import { WsBandejaProyectoGestionResponse } from '../dto/Response/BandejaProyectoGestionResponse';





@Injectable()
export class ProyectoService{


  constructor(private http: HttpClient) { }

  proyectoEjecucionFiltros(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseDatoProyecto> {
    return this.http.get<WsResponseDatoProyecto>('assets/proyecto.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  listaProyectoGestion(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsBandejaProyectoGestionResponse> {
    // return this.http.get<WsResponseProyecto>('assets/proyecto.json');
    return this.http.post<WsBandejaProyectoGestionResponse>(`${environment.backendUrlProj}/cargarDatosProyecto/listarProyectoGestion/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

 
  
  listaProyectoCRP(pagina : number, cantidad: number, filtrosProyectoRequest): Observable<WsBandejaProyectoGestionResponse> {
    // return this.http.get<WsResponseProyecto>('assets/proyecto.json');
    return this.http.post<WsBandejaProyectoGestionResponse>(`${environment.backendUrlProj}/bandejaProyectoAurizacionGasto/listarProyectoEjecucion/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  cargarDatosProyecto(proyecto): Observable<WsBandejaProyectoGestionResponse> {
    // return this.http.get<WsResponseProyecto>('assets/proyecto.json');
    return this.http.post<WsBandejaProyectoGestionResponse>(`${environment.backendUrlProj}/cargarDatosProyecto/cargarDatosProyecto/`, proyecto);
  }

  eliminarProyectoGestion(idProyecto): Observable<WsBandejaProyectoGestionResponse> {
    // return this.http.get<WsResponseProyecto>('assets/proyecto.json');
    return this.http.get<WsBandejaProyectoGestionResponse>(`${environment.backendUrlProj}/cargarDatosProyecto/eliminarProyectoGestion/${idProyecto}`);
  }

  actualizarProyectoGestion(proyecto): Observable<WsBandejaProyectoGestionResponse> {
    // return this.http.get<WsResponseProyecto>('assets/proyecto.json');
    return this.http.post<WsBandejaProyectoGestionResponse>(`${environment.backendUrlProj}/cargarDatosProyecto/actualizarProyecto/`, proyecto);
  }


}
