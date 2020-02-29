import { Injectable } from '@angular/core';
import { environment as env } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoIntervenciones } from '../entities/ticket-atencion';
import { Datos } from '../entities/datos';
import { PantallaAtenciones } from '../entities/pantalla-atenciones';
import { Persona } from '../entities/persona';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IntervencionService {

  constructor(
    private http: HttpClient
  ) { }

  obtenerIntervenciones(pagina: number, cantidad: number, filtros: string): Observable<ResultadoIntervenciones> {
    return this.http.get<ResultadoIntervenciones>(`${env.backendUrlPref}/tickets-atenciones/listado/${pagina}/${cantidad}?${filtros}`);
  }

  cambiarEstado(idAtencion: number, codigoEstado: string): Observable<void> {
    return this.http.get<void>(`${env.backendUrlPref}/tickets-atenciones/cambiar-estado/${idAtencion}/${codigoEstado}`);
  }

  registrarAtencion(atencion: any): Observable<boolean> {
    return this.http.post<boolean>(`${env.backendUrlPref}/tickets-atenciones/registrar-atencion`, atencion);
  }

  pantallaAtenciones(ultimoModulo: number): Observable<PantallaAtenciones> {
    return this.http
      .get<PantallaAtenciones>(`${env.backendUrlPref}/tickets-atenciones/pantalla-atenciones/${ultimoModulo}`)
      .pipe(
        map(p => {

          p.modulos = p.modulos.map(m => {

            m.listadoPorAtender = (JSON.parse(m.porAtender || '[]') as any[]).map(pa => pa.p);

            return m;
          });

          return p;
        })
      );
  }

  datosForm(idPersona: number): Observable<Datos> {
    return this.http.get<Datos>(`${env.backendUrlPref}/tickets-atenciones/datos-form/${idPersona}`);
  }

  datosBandeja(): Observable<Datos> {
    return this.http.get<Datos>(`${env.backendUrlPref}/tickets-atenciones/datos-bandeja`);
  }

  subirArchivo(data: FormData): Observable<any> {
    return this.http.post<any>(`${env.backendUrlPref}/tickets-atenciones/subir-archivo`, data);
  }

  consultarPersona(dni: string): Observable<Persona> {
    return this.http.get<Persona>(`${env.backendUrlPref}/tickets-atenciones/consultar-persona/${dni}`);
  }
}
