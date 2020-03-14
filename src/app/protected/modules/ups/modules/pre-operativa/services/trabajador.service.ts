import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Reniec } from '../dto/Response/Reniec';
import { Sunat } from '../dto/Response/Sunat';
import { WsResponseDatoProyecto } from '../dto/Response/DatoProyectoResponse';
import { WsItemBeanResponse } from '../dto/Request/ItemBean';


@Injectable()
export class TrabajadorService {

  constructor(private http: HttpClient) { }

  obtenerListadoTrabajador(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseDatoProyecto> {
    return this.http.get<WsResponseDatoProyecto>('assets/trabajador.json');
    //return this.http.post<WsResponseProyecto>(`${environment.backendUrlProj}/prefactibilidadProyectos/listar/${pagina}/${cantidad}`, filtrosProyectoRequest);
  }

  obtenerTrabajador(idCodigo: number): Observable<WsResponseDatoProyecto> {
    return this.http.get<WsResponseDatoProyecto>('assets/obtenerTrabajador.json');
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

  busquedaDataPersona(numero: string) {
    return this.http.get<WsResponseDatoProyecto>('assets/dataReniec.json');
  }


  obtenerDataWsSunat(numero: string): Observable<Sunat> {
    return this.http.get<any>(`http://192.168.10.23:8071/consultas/sunat?documento=${numero}`);
  }

  obtenerDataWsReniec(numero: string): Observable<Reniec> {
    return this.http.get<any>(`http://192.168.10.23:8071/consultas/reniec?documento=${numero}`);
  }

}