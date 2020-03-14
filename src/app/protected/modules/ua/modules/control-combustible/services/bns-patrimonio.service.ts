import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WsApiOutResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/WsApiOutResponse';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { VehiculoRequest } from '../dto/request/vehiculo.request';
import { ObjBienPatrimonial } from '../dto/request/obj-bien-patrimonial.request';
import { ObjAtcloEmgciaVehiculo } from '../dto/request/obj-atclo-emgcia-vehiculo.request';
import { EmpleadoPuestoRequest } from '../dto/request/empleado-puesto.request';
import { DenominacionBienPorPlataformaRequest } from '../dto/request/denominacion-bien-por-plataforma.request';
import { Vehiculo } from '../entities/vehiculo.model';
import { ConductorVehiculoRequest } from '../dto/request/conductor-vehiculo.request';
import { ConductorBreveteRequest } from '../dto/request/conductor-brevete.request';
import { BreveteRequest } from '../dto/request/brevete.request';
import { TipoLbcteVhcloRequest } from '../dto/request/tipo-lbcte-vhclo.request';
import { EliminaConductorBreveteRequest } from '../dto/request/eliminar-conductor-brevete.request';

@Injectable({
  providedIn: 'root'
})
export class BnsPatrimonioService {

  constructor(private http: HttpClient) { }

  listarUnidadTerritorial(): Observable<WsApiOutResponse> {
    return this.http.get<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/listarUnidadTerritorial`);
  }

  listarPlataformas(unidad: any): Observable<WsApiOutResponse> {
    return this.http.get<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/listarPlataformasPorUnidadTerritorial/${unidad.idCodigo}`);
  }

  listarDenominaBienPorPlataforma(req: DenominacionBienPorPlataformaRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/listarDenominaBienPorPlataforma`, req);
  }

  buscarVehiculo(vehiculoReq: VehiculoRequest): Observable<WsApiOutResponse> {
    return this.http.get<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/buscarvehiculo/${vehiculoReq.idUnidadTerritorial}/${vehiculoReq.idPlataforma}/${vehiculoReq.idDenominacion}/${vehiculoReq.fechaInicio}/${vehiculoReq.fechaFin}`);
  }

  buscarAtcloEmgciaXVehiculo(obj: ObjBienPatrimonial): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/buscarAtcloEmgciaXVehiculo`, obj);
  }

  grabarAtcloEmgciaXVehiculo(lista: ObjAtcloEmgciaVehiculo[]): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/grabarAtcloEmgciaXVehiculo`, lista);
  }

  listarPuesto(): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/listarPuesto`, {});
  }

  buscarEmpleadoPuesto(req: EmpleadoPuestoRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/buscarEmpleadoPuesto`, req);
  }

  listarConductorVehiculo(req: ConductorVehiculoRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/listarConductorVehiculo`, req);
  }

  grabarActualizarConductorBrevete(req: ConductorBreveteRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/grabarActualizarConductorBrevete`, req);
  }

  modificarRenovarBrevete(req: BreveteRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/modificarRenovarBrevete`, req);
  }

  //GEESTION LUBRICANTES VEHICULOS
  listarLubricanteVehiculo(req: TipoLbcteVhcloRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/listarLubricanteVehiculo`, req);
  }

  listarTipoLubricante(): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/listarTipoLubricante`, {});
  }

  eliminarConductorBrevete(req: EliminaConductorBreveteRequest): Observable<WsApiOutResponse> {
    return this.http.post<WsApiOutResponse>(`${environment.backendUA}/bienesPatrimoniales/eliminarConductorBrevete`, req);
  }

}
