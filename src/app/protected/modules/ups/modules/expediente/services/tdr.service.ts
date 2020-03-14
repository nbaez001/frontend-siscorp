
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { WsResponseItem } from '../dto/response/ItemBean';
import { WsResponseTdr } from '../entities/tdr';
import { WsResponseAlcance } from '../dto/response/AlcanceResponse';
import { WsResponseEntregable } from '../dto/response/EntregableResponse';
import { WsResponseActividad } from '../dto/response/ActividadResponse';
import { WsResponseCondicionGeneral } from '../dto/response/CondicionGeneralResponse';
import { WsResponseCondicionParticular } from '../dto/response/CondicionParticularResponse';
import { WsResponseBandejaTdr } from '../dto/response/BandejaTdrResponse';
import { WsResponseTdrEditar } from '../entities/detalleTdr';





@Injectable()
export class TdrService{
    _httpClient: any;

    constructor(private http: HttpClient) { }


    tdrFiltros(pagina : number, cantidad: number, filtrosTdrRequest): Observable<WsResponseBandejaTdr> {
        return this.http.post<WsResponseBandejaTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/bandejaTdr/${pagina}/${cantidad}`, filtrosTdrRequest);
    }
  

    listarCodigoFormato(): Observable<WsResponseItem> {
        return this.http.get<WsResponseItem>(`${environment.backendUrlProj}/prefactibilidadTdr/listarFormato`);
    }

    listarUnidad(): Observable<WsResponseItem> {
        return this.http.get<WsResponseItem>(`${environment.backendUrlProj}/prefactibilidadTdr/listarUnidad`);
    }

    comboPerfilContratacion(): Observable<WsResponseItem> {
        return this.http.get<WsResponseItem>(`${environment.backendUrlProj}/prefactibilidadTdr/comboPerfilContratacion`);
    }
      
    registrarTdrtab1(ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/registroTdrtab1`,ParametroRequest);
    }

    registrarTdrtab2(ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/registroTdrtab2`,ParametroRequest);
    }

    registrarAlcance(ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/registroAlcance`,ParametroRequest);
    }

    listaAlcance(ParametroRequest): Observable<WsResponseAlcance> {   
        return this.http.post<WsResponseAlcance>(`${environment.backendUrlProj}/prefactibilidadTdr/listaAlcance`,ParametroRequest);
    }

    obtenerAlcance(idAlcance: number): Observable<WsResponseAlcance> {   
        return this.http.post<WsResponseAlcance>(`${environment.backendUrlProj}/prefactibilidadTdr/obtenerAlcance/${idAlcance}`,null);
    }

    editarAlcance(idAlcance: number,ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/editarAlcance/${idAlcance}`,ParametroRequest);
    }

    eliminarAlcance(idAlcance: number): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/eliminarAlcance/${idAlcance}`,null);
    }

    //Registrar TabEntregable
    registrarEntregable(ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/registroEntregable`,ParametroRequest);
    }

    listaEntregable(ParametroRequest): Observable<WsResponseEntregable> {   
        return this.http.post<WsResponseEntregable>(`${environment.backendUrlProj}/prefactibilidadTdr/listaEntregable`,ParametroRequest);
    }


    obtenerEntregable(idEntregable: number): Observable<WsResponseEntregable> {   
        return this.http.post<WsResponseEntregable>(`${environment.backendUrlProj}/prefactibilidadTdr/obtenerdEntregable/${idEntregable}`,null);
    }

    editarEntregable(idEntregable: number,ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/editarEntregable/${idEntregable}`,ParametroRequest);
    }

    eliminarEntregable(idEntregable: number): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/eliminarEntregable/${idEntregable}`,null);
    }

    registrarDescripcionGeneralEntregable(ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/registroTab3`,ParametroRequest);
    }


    registrarActividad(ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/registroDetalleEntregable`,ParametroRequest);
    }

    listaActividad(idEntregable: number): Observable<WsResponseActividad> {   
        return this.http.post<WsResponseActividad>(`${environment.backendUrlProj}/prefactibilidadTdr/listaDetalleEntregable/${idEntregable}`,null);
    }


    // FORMA DE PAGO
    registroTdrtab4(ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/registroTab4`,ParametroRequest);
    } 

    registrarTdrtab5(ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/registroTab5`,ParametroRequest);
    }


    //Obtener, Editar y eliminar Actividades*/
    obtenerActividad(idDetalleEntregable: number): Observable<WsResponseActividad> {   
        return this.http.post<WsResponseActividad>(`${environment.backendUrlProj}/prefactibilidadTdr/obtenerdDetalleEntregable/${idDetalleEntregable}`,null);
    }

    editarActividad(idDetalleEntregable: number,ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/editarDetalleEntregable/${idDetalleEntregable}`,ParametroRequest);
    }

    eliminarActividad(idDetalleEntregable: number): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/eliminarDetalleEntregable/${idDetalleEntregable}`,null);
    }


    //Mostrar PDF generado
    visualizarTdr(idTdr: number) {
        return  this.http.get(`${environment.backendUrlProj}/prefactibilidadTdr/reporteTdr/${idTdr}`, {responseType: 'blob'});
    }


/*       downloadPsDF(idTdr): any {
        return this.http.get(`${environment.backendUrlProj}/prefactibilidadTdr/reporteTdr/${idTdr}`, { responseType: 'blob' as 'json' })
                .map(res => {
                return new Blob([res], { type: 'application/pdf', });
            });

    }   */     



    // *********************************************************  CONDICION GENERAL  ********************************************************************* 
    registrarCondicionGeneral(ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/registroCondicionGeneral`,ParametroRequest);
    }

    listaCondicionGeneral(ParametroRequest): Observable<WsResponseCondicionGeneral> {   
        return this.http.post<WsResponseCondicionGeneral>(`${environment.backendUrlProj}/prefactibilidadTdr/listaCondicionGeneral`,ParametroRequest);
    }

    obtenerCondicionGeneral(idCodigo: number): Observable<WsResponseCondicionGeneral> {   
        return this.http.post<WsResponseCondicionGeneral>(`${environment.backendUrlProj}/prefactibilidadTdr/obtenerCondicionGeneral/${idCodigo}`,null);
    }

    editarCondicionGeneral(idCodigo: number,ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/editarCondicionGeneral/${idCodigo}`,ParametroRequest);
    }

    eliminarCondicionGeneral(idCodigo: number): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/eliminarCondicionGeneral/${idCodigo}`,null);
    }


    // *******************************************************  CONDICION PARTICULAR  *******************************************************************
    registrarCondicionParticular(ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/registroCondicionParticular`,ParametroRequest);
    }

    listaCondicionParticular(ParametroRequest): Observable<WsResponseCondicionParticular> {   
        return this.http.post<WsResponseCondicionParticular>(`${environment.backendUrlProj}/prefactibilidadTdr/listaCondicionParticular`,ParametroRequest);
    }

    obtenerCondicionParticular(idCodigo: number): Observable<WsResponseCondicionParticular> {   
        return this.http.post<WsResponseCondicionParticular>(`${environment.backendUrlProj}/prefactibilidadTdr/obtenerCondicionParticular/${idCodigo}`,null);
    }

    editarCondicionParticular(idCodigo: number,ParametroRequest): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/editarCondicionParticular/${idCodigo}`,ParametroRequest);
    }

    eliminarCondicionParticular(idCodigo: number): Observable<WsResponseTdr> {   
        return this.http.post<WsResponseTdr>(`${environment.backendUrlProj}/prefactibilidadTdr/eliminarCondicionParticular/${idCodigo}`,null);
    }


    //EDITAR TDR
    cagarTdr(idTdr): Observable<WsResponseTdrEditar> {   
        return this.http.post<WsResponseTdrEditar>(`${environment.backendUrlProj}/prefactibilidadTdr/detalleTdr/${idTdr}`,null);
    }
	

}
