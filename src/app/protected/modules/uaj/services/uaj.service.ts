import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UajService {

  constructor(
    private http: HttpClient
  ) { }

  listarDenominacion(): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-denominacion`);
  }

  listarTipoConvenio(): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-tipo-convenio`);
  }

  listarTipoGobierno(): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-tipo-gobierno`);
  }

  listarSector(IdGobierno: number): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-sector/${IdGobierno}`);
  }

  listarEntidad(IdSector: number): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-entidad/${IdSector}`);
  }

  listarCoordinadorPais(nombre: string): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-coordinador-pais/${nombre}`);
  }

  listarCoordinadorContraparte(id_entidad: number): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-coordinador-contraparte/${id_entidad}`);
  }

  listarConvenio(pageindex: number, pagesize: number): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-convenio/${pageindex}/${pagesize}`);
  }

  guardarConvenio(formData): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/guardarConvenio`, formData);
  }

  datoConvenio(id_convenio: number): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/datos-convenio/${id_convenio}`);
  }

  guardarAdenda(formData): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/guardarAdenda`, formData);
  }

  listarAdenda(id_convenio: number): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-adenda/${id_convenio}`);
  }

}
