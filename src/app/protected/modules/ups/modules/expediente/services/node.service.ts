import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WsResponseProyecto } from '../dto/response/ProyectoResponse';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { WsResponseCronograma } from '../../autorizacion-gasto/dto/response/Cronograma';
import { WsApiOutResponse } from '../dto/response/WsApiOutResponse';

@Injectable()
export class NodeService {


  constructor(private http: HttpClient) { }

  getCronoPadre() {
    return this.http.get<any>('assets/crono.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  getCrononogramaTotales() {
    return this.http.get<any>('assets/cronogramaTotalJsonWebService.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  cronogramaJsonFullChildren(parametroRequest) {
    const formData = new FormData();
    formData.append('idMovimientoProyecto', parametroRequest.idMovimientoProyecto);
    return this.http.post<any>(`${environment.backendUrlProj}/ejecucionProyectos/llenarCronogramaPartidas`, formData, { reportProgress: true })
      .toPromise().then(res => <TreeNode[]>res.data);
  }

  getInsumoTotales() {
    return this.http.get<any>('assets/insumoTotalJsonWebService.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }



  obtenerInsumo() {
    return this.http.get<any>('assets/obtenerInsumo.json')
      .toPromise()
      .then(res => <any>res.response);
  }


  obtenerPartidasPorInsumo() {
    return this.http.get<any>('assets/partidaListado.json')
      .toPromise()
      .then(res => <any>res.response);
  }
  
  getInsumoPadre(parametroRequest) {
    const formData = new FormData();
    formData.append('idMovimientoProyecto', parametroRequest.idMovimientoProyecto);
    return this.http.post<any>(`${environment.backendUrlProj}/ejecucionProyectos/llenarCronogramaInsumos`, formData, { reportProgress: true })
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  /*   return this.http.get<any>('assets/insumo.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data); */
  }



  /*  getFilesystem() {
     return this.http.get('showcase/resources/data/filesystem.json')
                 .toPromise()
                 .then(res => <TreeNode[]> res.json().data);
 }
  */

  getCronoHijo() {
    return this.http.get<any>('assets/cronoHijo.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }


  getInsumoHijo() {
    return this.http.get<any>('assets/insumoHijo.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  obtenerModificacion(pagina: number, cantidad: number, filtrosProyectoRequest): Observable<WsResponseProyecto> {
    return this.http.get<WsResponseProyecto>('assets/modificacion.json');
  }

  getAutorizacionCostoDirectoPadre() {
    return this.http.get<any>('assets/auto-coso-directo.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  getAutorizacionCostoDirectoHijo() {
    return this.http.get<any>('assets/auto-costo-directo-hijo.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  getGastoGeneralPadre() {
    return this.http.get<any>('assets/gasto-general-padre.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  getGastoGeneralHijo() {
    return this.http.get<any>('assets/gasto-general-hijo.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  getGastoSupervisionPadre() {
    return this.http.get<any>('assets/gasto-supervision-padre.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  getGastoSupervisionHijo() {
    return this.http.get<any>('assets/gasto-supervision-hijo.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  cronogramaPruebaData(idMovimientoProyecto: number): Observable<WsResponseCronograma> {
    return this.http.get<WsResponseCronograma>(`${environment.backendUrlProj}/ejecucionProyectos/llenarCronogramaPartidas/${idMovimientoProyecto}`);
  }

}

export interface TreeNode {
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
}
