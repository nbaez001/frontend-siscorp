import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { WsResponseProyecto } from '../dto/response/ProyectoResponse';
import { Session } from '@shared/auth/Session';
import { ExcelDownloadResponse } from '../entities/ExcelDownloadResponse';
import { WsApiOutResponse } from '../dto/response/WsApiOutResponse';
import { ArchivoResponse, WsResponseArchivo } from '../dto/response/ArchivoResponse';
import { WsResponseObservacion } from '../entities/observacion';
import { WsResponseItem } from '../dto/response/ItemBean';
import { WsResponsePersonal } from '../dto/response/PersonalResponse';
import { EquipoResponse, WsResponseEquipo } from '../dto/response/EquipoResponse';



@Injectable()
export class PersonalService{

    constructor(private http: HttpClient) { }
    
   


  asignarDerivarCorrdinador(ParametroRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUrlProj}/prefactibilidadProyectos/derivarDesdeBandejaJefe`,ParametroRequest);
  }

  obtenerPersonal(): Observable<WsResponsePersonal> {
    return this.http.get<WsResponsePersonal>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarPersonas`);
  }

  obtenerArquitectos(idMovimientoProyecto: string): Observable<WsResponsePersonal> {
    return this.http.get<WsResponsePersonal>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarArquitectos/${idMovimientoProyecto}`);
  }

  obtenerCiviles(idMovimientoProyecto: string): Observable<WsResponsePersonal> {
    return this.http.get<WsResponsePersonal>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarCiviles/${idMovimientoProyecto}`);
  }

  obtenerElectricos(idMovimientoProyecto: string): Observable<WsResponsePersonal> {
    return this.http.get<WsResponsePersonal>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarElectricos/${idMovimientoProyecto}`);
  }

  obtenerSanitarios(idMovimientoProyecto: string): Observable<WsResponsePersonal> {
    return this.http.get<WsResponsePersonal>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarSanitarios/${idMovimientoProyecto}`);
  }

  obtenerOtros(idMovimientoProyecto: string): Observable<WsResponsePersonal> {
    return this.http.get<WsResponsePersonal>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarOtrosProfesionales/${idMovimientoProyecto}`);
  }

  listarElaboradores(idMovimientoProyecto: number): Observable<WsResponseEquipo> {
    return this.http.get<WsResponseEquipo>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarElaboradores/${idMovimientoProyecto}`);
  }
   
  listarRevisores(idMovimientoProyecto: number): Observable<WsResponseEquipo> {
    return this.http.get<WsResponseEquipo>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarRevisores/${idMovimientoProyecto}`);
  }

  
  
}