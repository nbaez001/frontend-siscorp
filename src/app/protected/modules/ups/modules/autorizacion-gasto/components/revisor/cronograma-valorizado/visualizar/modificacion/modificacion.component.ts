import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NodeService } from 'app/protected/modules/ups/modules/expediente/services/node.service';
import { CronogramaComponent } from '../cronograma/cronograma.component';
import { MatDialogRef, PageEvent, MatTableDataSource, MatPaginator } from '@angular/material';
import { WsResponseProyecto, Proyecto } from '../../../../../dto/response/Proyecto';
import { Observacion } from 'app/protected/modules/ups/modules/expediente/entities/observacion';
import { EquipoResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/EquipoResponse';
import { Subscription } from 'rxjs';
import { ProyectoEjecucionService } from '../../../../../service/proyecto-ejecucion.service';
import { MENSAJES } from 'app/common';

@Component({
  selector: 'app-modificacion',
  templateUrl: './modificacion.component.html',
  styleUrls: ['./modificacion.component.scss']
})
export class ModificacionComponent implements OnInit {

  obraForm: FormGroup;
  step: number = 0;

  proyectos: Proyecto[];
  pagina = 1;
  cantidad = 15;
  total = 0;

  // Tabla
  dataSource: MatTableDataSource<Proyecto>;
  wsResponseProyecto: WsResponseProyecto;
  dataResponse: any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoading: boolean;
  idPerfil: number;
  codPerfil: string;
  columnas: string[] = [];
  mensaje: string;
  disableBuscar: boolean;
  expedienteSuscripcionEncargado: Subscription;
  idUsuarioCoordinador: number;


  constructor(private nodeService: NodeService,
    public dialogRef: MatDialogRef<CronogramaComponent>,
   ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.generarCabeceraColumnasEncargado();
    this.cargarPerfilPrefactibilidad();
  }

  setStep(index: number) {
    this.step = index;
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarPerfilPrefactibilidad();
  }

  public cargarTablaPrefactibilidad(): void {
    if (this.dataResponse != null && this.dataResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.dataResponse);
    }
  }

  public cargarPerfilPrefactibilidad(): void {
    this.dataSource = null;
    this.disableBuscar = true;
    this.dataResponse = [];
    this.isLoading = true;

    this.nodeService.obtenerModificacion(this.pagina, this.cantidad, null)
      .subscribe(
        (wsResponseProyecto: any) => {
          if (wsResponseProyecto.codResultado == 1) {
            this.dataResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
            this.cargarTablaPrefactibilidad();
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
          }
          this.isLoading = false;
          this.disableBuscar = false;
        },
        error => {
          console.error(error);
        }
      );
  }

  generarCabeceraColumnasEncargado(): void {
    this.columnas = [
      'Partida'
    ];
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

