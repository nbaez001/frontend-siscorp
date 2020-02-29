import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaPlataforma, DatosFormPlataforma } from '../entities/plataforma';
import { environment as env } from 'environments/environment';
import { Recurso, CondicionesTambos } from '../entities/recurso';
import { Condicion } from '../entities/condicion';
import { ErrorRespuesta } from '../entities/error-respuesta';
import { Rol } from '../entities/rol';

@Injectable({
  providedIn: 'root'
})
export class GestionTambosService {

  constructor(
    private http: HttpClient
  ) { }

  get urlBase(): string {
    return env.backendUrlPref + '/ups/gestion-plataformas';
  }

  tambos(pagina: number, cantidad: number, filtros: string): Observable<RespuestaPlataforma> {
    return this.http.get<RespuestaPlataforma>(`${this.urlBase}/plataformas/${pagina}/${cantidad}?${filtros}`, { reportProgress: true });
  }

  registrar(datos: DatosFormPlataforma): Observable<ErrorRespuesta> {
    return this.http.post<ErrorRespuesta>(`${this.urlBase}/registrar-plataforma`, datos);
  }

  actualizar(datos: DatosFormPlataforma): Observable<ErrorRespuesta> {
    return this.http.put<ErrorRespuesta>(`${this.urlBase}/actualizar-plataforma`, datos);
  }

  eliminar(idPlat: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/eliminar-plataforma/${idPlat}`);
  }

  situaciones(): Promise<Recurso[]> {
    return this.recursos('SI', 0).toPromise();
  }

  estados(idSituacion: number): Promise<Recurso[]> {
    return this.recursos('ES', idSituacion).toPromise();
  }

  subEstados(idEstado: number): Promise<Recurso[]> {
    return this.recursos('SE', idEstado).toPromise();
  }

  ssubEstados(idSubEstado: number): Promise<Recurso[]> {
    return this.recursos('SS', idSubEstado).toPromise();
  }

  private recursos(tipo: 'SI' | 'ES' | 'SE' | 'SS', id: number): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(`${this.urlBase}/recursos/${tipo}/${id}`);
  }

  historial(idPlat: number): Observable<Condicion[]> {
    return this.http.get<Condicion[]>(`${this.urlBase}/historial/${idPlat}`);
  }

  plataformaActividad(datos: any): Observable<void> {
    return this.http.post<void>(`${this.urlBase}/pltaforma-actividad`, datos);
  }

  centrosPoblados(filtro: string): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(`${this.urlBase}/centros-poblados/${filtro}`);
  }

  actualizarCondiciones(datos: any): Observable<void> {
    return this.http.post<void>(`${this.urlBase}/actualizar-condiciones`, datos);
  }

  // UBICACION
  departamentos(): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(`${this.urlBase}/datos-ubicacion/DE/0`);
  }

  provincias(idDep: number): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(`${this.urlBase}/datos-ubicacion/PR/${idDep}`);
  }

  distritos(idProv: number): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(`${this.urlBase}/datos-ubicacion/DI/${idProv}`);
  }

  filtrarCCPP(lon: string, lat: string, alt: string): Observable<Recurso> {
    return this.http.get<Recurso>(`${this.urlBase}/filtrar-ccpp-por-ubicacion/${lon}/${lat}/${alt}`);
  }

  actualizarCondicion(idPlat: number, idSsubEstado: number, fecha: string): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/actualizar-condicion-plataforma/${idPlat}/${idSsubEstado}/${fecha}`, {});
  }

  jerarquiaCondiciones(): Observable<CondicionesTambos[]> {
    return this.http.get<CondicionesTambos[]>(`${this.urlBase}/jerarquia-condiciones`);
  }

  roles(opcionUrl: string): Promise<Rol[]> {
    return this.http.get<Rol[]>(`${this.urlBase}/roles?rutaOpcion=${opcionUrl}`).toPromise();
  }
}
