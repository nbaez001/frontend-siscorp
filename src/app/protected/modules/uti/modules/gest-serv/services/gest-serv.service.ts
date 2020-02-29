import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlataformaLista } from '../entities/plataforma-lista';
import { environment as env } from 'environments/environment';
import { Session } from '@shared/auth/Session';
import { Estado, EstadoActual, Servicios } from '../entities/estado';
import { Historial } from '../entities/historial';
import { UnidadMedida } from '../entities/unidad-medida';

@Injectable({
  providedIn: 'root'
})
export class GestServService {

  constructor(
    private http: HttpClient
  ) { }

  plataformas(pagina: number, cantidad: number, filtros: string): Observable<PlataformaLista> {
    return this.http.get<PlataformaLista>(`${env.backendUrlPref}/uti/gest-serv/plataformas/${pagina}/${cantidad}?${filtros}`);
  }

  estadoActual(tipo: Servicios, idServ: number): Observable<EstadoActual> {
    return this.http.get<EstadoActual>(`${env.backendUrlPref}/uti/gest-serv/estadoActual/${tipo}/${idServ}`);
  }

  estados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(`${env.backendUrlPref}/uti/gest-serv/estados`);
  }

  cambiarEstados(idServicio: number, idEstadoServicio: number, detalleHist: string, tipo: string): Observable<any> {

    const datos = {
      tipo: tipo === Servicios.internet ? 'EI' : 'ET',
      idServicio,
      idEstadoServicio,
      idUsuarioHist: Session.identity.id_usuario,
      detalleHist
    };

    return this.actualizarDatos(datos);
  }

  guardarInternet(datos: any) {
    datos.tipo = datos.idServicio === 0 ? 'RI' : 'AI';
    return this.actualizarDatos(datos);
  }

  guardarTelefonia(datos: any) {
    datos.tipo = datos.idServicio === 0 ? 'RT' : 'AT';
    return this.actualizarDatos(datos);
  }

  protected actualizarDatos(datos: any): Observable<any> {
    return this.http.post(`${env.backendUrlPref}/uti/gest-serv/actualizar-datos`, datos);
  }

  historial(idPlat: number): Observable<Historial[]> {
    return this.http.get<Historial[]>(`${env.backendUrlPref}/uti/gest-serv/historial/${idPlat}`);
  }

  unidadesMedida(): Observable<UnidadMedida[]> {
    return this.http.get<UnidadMedida[]>(`${env.backendUrlPref}/uti/gest-serv/unidades-medida`);
  }

  colorServ(servicio: Servicios): string {

    let color: 'green' | 'blue';

    switch (servicio) {
      case Servicios.internet:
        color = 'green'; break;
      case Servicios.telefonia:
        color = 'blue'; break;
    }

    return color || '';
  }
}
