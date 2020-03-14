import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  listarConvenio(data): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/lista-convenio`, data);
  }

  guardarConvenio(formData: FormData): Observable<any> {
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

  guardarPlanTrabajo(formData): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/guardarPlanTrabajo`, formData);
  }

  datoPlanTrabajo(id_convenio: number): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/datos-plan-trabajo/${id_convenio}`);
  }

  guardarActividad(formData): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/guardarActividad`, formData);
  }

  listarActividad(id_plan: number): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-actividad/${id_plan}`);
  }

  eliminarAdenda(formData): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/eliminarAdenda`, formData);
  }

  eliminarActividad(formData): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/eliminarActividad`, formData);
  }

  upload(formData: FormData): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/upload`, formData);
  }

  unlink(file: string): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/unlink`, file);
  }

  viewFile(path: string): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/viewFile`, path, {
      responseType: 'blob'
    });
  }

  descargarExcel(id_plan: number): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/descargar-excel/${id_plan}`, { responseType: 'arraybuffer' });
  }

  datoActividad(id_actividad: number): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/datos-actividad/${id_actividad}`);
  }

  actualizarActividad(formData): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/actualizarActividad`, formData);
  }

  actualizarConvenio(formData): Observable<any> {
    return this.http.post(`${env.backendUAJ}/convenio-general/actualizarConvenio`, formData);
  }

  listaArea(): Observable<any> {
    return this.http.get(`${env.backendUAJ}/convenio-general/lista-area`);
  }
}
