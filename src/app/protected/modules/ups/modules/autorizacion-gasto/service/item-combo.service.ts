import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WsItemBeanResponse } from '../dto/response/ItemBean';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { WsResponse } from '../dto/response/Proyecto';


@Injectable()
export class ItemComboService {

  constructor(
    private http: HttpClient
  ) { }


  //******************************************************************** */
  //**************************** HECTOR SERVICIOS ********************** */
  obtenerEstadoAutorizacionGasto(): Observable<WsResponse> {
    return this.http.get<WsResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstadoAutorizacionGasto/`);
  }
  //******************************************************************** */
  //******************************************************************** */



  obtenerEstadoCotizacion(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/estado_cotizacion.json`);
  }

  ObtenerEstadoProyecto(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/estado.json`);
    /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }


  ObtenerPagoMensual(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/pagoMensual.json`);
    /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }

  ObtenerEstadoCartaFianza(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/estadoCarta.json`);
    /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }

  ObtenerNivel1(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/nivel1.json`);
  }
  ObtenerNivel2(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/nivel2.json`);
  }
  ObtenerNivel3(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/nivel3.json`);
  }
  ObtenerNivel4(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/nivel4.json`);
  }

  ObtenerTipoInsumo(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/tipoInsumo.json`);
  }

  ObtenerMeses(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/meses.json`);
  }

  ObtenerCodigoPartida(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/codigoPartida.json`);
  }


  ObtenerEstadoAutorizacion(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/estado_autorizacion.json`);
    /*    return this.http.get<WsItemBeanResponse>(`${environment.backendUrlProj}/autorizacionGasto/listarEstado`); */
  }
  /* 
    ObtenerModalidadEjecucion(): Observable<WsResponseItem> {
      return this.http.get<WsResponseItem>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarModalidad`);
    }
  
    obtenerTipoDocumentoArchivo(): Observable<WsResponseItem> {
      return this.http.get<WsResponseItem>(`${environment.backendUrlProj}/prefactibilidadProyectos/listarTipoArchivo`);
    } */


  obtenerTipoDocumentoArchivo(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/tipoDocumento.json`);
  }

 


  obtenerProveedores(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/proveedores_combo.json`);
  }


  ObtenerFechaCronograma(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/fechaCronograma.json`);
  }

  ObtenerListadoPartida(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/dataListadoPartida.json`);
  }

  ObtenerComboPagoJornal(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/comboPagoJornal.json`);
  }


  obtenerTipoDocumentoTambo(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/combo_tipo_documento_tambo.json`);
  }

  obtenerEstadoTambo(): Observable<WsItemBeanResponse> {
    return this.http.get<WsItemBeanResponse>(`assets/combo_estado_tambo.json`);
  }



}