import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PrefijoEstado } from 'app/protected/modules/tickets-intervenciones/entities/prefijo-estado';
import { ProyectoRequest } from '../../../expediente/dto/request/ProyectoRequest';

import { MatTableDataSource, MatPaginator, MatDialog, PageEvent, MatDialogRef } from '@angular/material';
import { Observacion } from '../../../expediente/entities/observacion';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MENSAJES } from 'app/common';
import * as _moment from 'moment';
import { JefeElaboradorArchivoComponent } from '../../../expediente/components/jefe-elaborador/jefe-elaborador-archivo/jefe-elaborador-archivo.component';
import { ItemComboService } from '../../service/item-combo.service';
import { ProyectoEjecucionService } from '../../service/proyecto-ejecucion.service';

import { ItemBean } from '../../dto/response/ItemBean';
import { CustomIconService } from '../../../expediente/services/custom-icon.service';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { ProyectoVisualizarComponent } from './proyecto-visualizar/proyecto-visualizar.component';
import { AuthService } from 'app/protected/services/auth.service';
import { DatosGeneralesComponent } from './datos-generales/datos-generales.component';
import { ModalCronogramaValorizadoComponent } from './cronograma-valorizado/modal-cronograma-valorizado/modal-cronograma-valorizado.component';
import { TrabajadorComponent } from './trabajador/trabajador.component';
import { ModalRequerimientoComponent } from './requerimiento/modal-requerimiento/modal-requerimiento.component';

import { ParametroRequest } from '../../dto/request/ParametroRequest';
import { EquipoResponse } from '../../dto/response/EquipoResponse';
import { BandejaProyectoAutorizacionGasto, WsResponseBandejaProyectoAutorizacionGasto } from '../../dto/response/BandejaProyectoAutorizacionGasto';

@Component({
  selector: 'app-revisor',
  templateUrl: './revisor.component.html',
  styleUrls: ['./revisor.component.scss']

})
export class RevisorComponent implements OnInit {


  filtrosForm: FormGroup;

  fechaActual = new Date();

  estados: any[];
  alertas: any[];
  proyectos: BandejaProyectoAutorizacionGasto[];
  pagina = 1;
  cantidad = 10;
  total = 0;
  cantidadObservacion = 3;
  paginaObservacion = 1;

  totalObservacion = 0;

  prefijoEstado = PrefijoEstado;

  // LISTA EXCEL
  exportExcelPreliminar: string;
  dataItemEstado: ItemBean;
  dataItemAlerta: ItemBean;

  filtrosProyectoRequest: FiltroProyectoRequest = new FiltroProyectoRequest();
  asignarDerivarRequest: ParametroRequest;
  parametroRequest: ParametroRequest;

  public cidCodigo: string = " ";
  public fechaInicio: string = " ";
  public fechaFin: string = " ";


  // Tabla
  dataSource: MatTableDataSource<BandejaProyectoAutorizacionGasto>;
  wsResponseProyecto: BandejaProyectoAutorizacionGasto;
  proyectoResponse: BandejaProyectoAutorizacionGasto[];
  objproyectoResponse: BandejaProyectoAutorizacionGasto;
  observacionResponse: Observacion[];
  equipoElaborador: EquipoResponse[];
  equipoRevisor: EquipoResponse[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoading: boolean;
  idPerfil: number;
  codPerfil: string;
  columnas: string[] = [];
  mensaje: string;
  disableBuscar: boolean;
  datos: BandejaProyectoAutorizacionGasto;
  expedienteSuscripcionEncargado: Subscription;
  idUsuarioCoordinador: number;

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private itemComboService: ItemComboService,
    private proyectoEjecucionService: ProyectoEjecucionService,
    private customIconService: CustomIconService,
    private router: Router,
    private authService: AuthService) {
    this.dataSource = new MatTableDataSource([]);

  }

  ngOnInit() {
    this.customIconService.cargaIcono();
    this.crearFiltrosForm();
    this.generarCabeceraColumnasEncargado();
    this.cargarDataEstado();
    this.cargarPerfilPrefactibilidad();
    this.tituloBandejaProyecto();
    //this.expedienteSuscripcionEncargado = this.socket.fromEvent('expedienteCoordinador').subscribe(() => this.cargarPerfilPrefactibilidad());

  }


  tituloBandejaProyecto() {
    this.authService.cabecera.next({
      titulo: MENSAJES.PROYECTO.TITLE_BANDEJA_PROYECTO,
      icono: ''
    });
  }

  ngOnDestroy() {
    this.authService.cabecera.next({
      titulo: '',
      icono: ''
    });
  }


  cambiarPagina(event: PageEvent) {

    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarPerfilPrefactibilidad();
  }

  crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
      tamboFrmCtrl: new FormControl(null),
      codigoFrmCtrl: new FormControl(null),
      convenioFrmCtrl: new FormControl(null),
    });
  }

  get tamboFrmCtrl() { return this.filtrosForm.get('tamboFrmCtrl'); }
  get codigoFrmCtrl() { return this.filtrosForm.get('codigoFrmCtrl'); }
  get convenioFrmCtrl() { return this.filtrosForm.get('convenioFrmCtrl'); }


  reiniciar() {
    this.filtrosForm.reset('');
    this.filtrosProyectoRequest = null;
    this.filtrosProyectoRequest = new FiltroProyectoRequest();
    this.cargarPerfilPrefactibilidad();
  }

  public guardarFiltrosBusqueda(): void {
    this.filtrosProyectoRequest.tambo = this.tamboFrmCtrl.value;
    this.filtrosProyectoRequest.codigo = this.codigoFrmCtrl.value;
    this.filtrosProyectoRequest.convenio = this.convenioFrmCtrl.value;
  }

  public buscarPerfilPrefactibilidad($event): void {
    $event.preventDefault();
    this.guardarFiltrosBusqueda();
    this.cargarPerfilPrefactibilidad();
  }

  cargarDataEstado() {
    this.itemComboService.ObtenerEstadoProyecto().subscribe(dataItem => {
      this.dataItemEstado = Object.assign({
        estados: dataItem.response
      });
    });
  }

  public cargarTablaPrefactibilidad(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

  public cargarPerfilPrefactibilidad(): void {
    this.dataSource = null;
    this.disableBuscar = true;
    this.proyectoResponse = [];
    this.isLoading = true;
    this.proyectoEjecucionService.listaProyectoEjecucionFiltros(this.pagina, this.cantidad, this.filtrosProyectoRequest)
      .subscribe(
        (wsResponseProyecto: WsResponseBandejaProyectoAutorizacionGasto) => {
          console.log("DDD");
          console.log(wsResponseProyecto.codResultado);
          if (wsResponseProyecto.codResultado == 1) {
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
            this.cargarTablaPrefactibilidad();
            console.log("EEE");
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            console.log("fff");
          }
          this.isLoading = false;
          this.disableBuscar = false;
        },
        error => {

          console.error(error);

        }
      );
  }

  // public openDialogMensaje(
  //   message: string,
  //   message2: string,
  //   alerta: boolean,
  //   confirmacion: boolean,
  //   valor: any
  // ): void {
  //   const dialogRef = this.dialog.open(InfoMessageComponent, {
  //     width: '400px',
  //     disableClose: true,
  //     data: {
  //       title: MENSAJES.PREFACTIBILIDAD.TITLE,
  //       message: message,
  //       message2: message2,
  //       alerta: alerta,
  //       confirmacion: confirmacion,
  //       valor: valor
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((ok: number) => {
  //     if (ok == 0) {
  //       if (valor == "1") {
  //         this.reiniciar();
  //         this.filtrosProyectoRequest = null;
  //         this.filtrosProyectoRequest = new FiltroProyectoRequest();
  //         this.cargarPerfilPrefactibilidad();
  //       }
  //     }
  //   });
  // }

  // public cargarPerfilPrefactibilidad(): void {
  //   console.log("filtros2");
  //   console.log(this.filtrosProyectoRequest);
  //   this.dataSource = null;
  //   this.disableBuscar = true;
  //   this.proyectoResponse = [];
  //   this.isLoading = true;

  //   this.proyectoEjecucionService.proyectoEjecucionFiltros(this.pagina, this.cantidad, this.filtrosProyectoRequest)
  //     .subscribe(
  //       (wsResponseProyecto: WsResponseBandejaProyectoAutorizacionGasto) => {

  //         if (wsResponseProyecto.codResultado == 1) {
  //           this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
  //           this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
  //           this.cargarTablaPrefactibilidad();
  //         } else {
  //           this.mensaje = MENSAJES.ERROR_NOFUNCION;

  //         }
  //         this.isLoading = false;
  //         this.disableBuscar = false;
  //       },
  //       error => {

  //         console.error(error);

  //       }
  //     );
  // }



  generarCabeceraColumnasEncargado(): void {
    this.columnas = [
      'item',
      'nroCodigo',
      'nroConvenio',
      'tambo',
      'inicioObra',
      'planEjecucion',
      'ampliacionPlazo',
      'diasRetraso',
      'terminoObra',
      'plazoEjecucionReal',
      'avanceFisicoProgramado',
      'avanceFisicoEjecutado',
      'avanceFinanciero',
      'estado',
      'prestandoServicio',
      'acciones'];
  }

  datosGenerales(idProyecto: number) {
    const dialogReg: MatDialogRef<DatosGeneralesComponent> = this.dialog.open(DatosGeneralesComponent, {
      disableClose: true,
      width: '1200px',
      autoFocus: false,
      data: {
        idProyecto:idProyecto
      }
    });

  }

  descargarDocumentos(idProyecto: number): void {
    const dialogReg: MatDialogRef<ProyectoVisualizarComponent> = this.dialog.open(ProyectoVisualizarComponent, {
      width: '800px',
      data: {
        idProyecto
      },
      disableClose: true
    });

  }

  verCronograma(idProyecto: number): void {
    const dialogReg: MatDialogRef<ModalCronogramaValorizadoComponent> = this.dialog.open(ModalCronogramaValorizadoComponent, {
      width: '1800px',
      data: {
        nombreTambo: 'TAMBO QUILLE'
      },
      disableClose: true
    });
  }

  verCotizaciones(idProyecto: number): void {
    const dialogReg: MatDialogRef<ModalRequerimientoComponent> = this.dialog.open(ModalRequerimientoComponent, {
      disableClose: true,
      width: '1800px',
      autoFocus: false,
      data: {
        nombreTambo: '',
        idProyecto: idProyecto
      },
    });
  }

  bandejaTrabajador(idProyecto: number): void {
    const dialogReg: MatDialogRef<TrabajadorComponent> = this.dialog.open(TrabajadorComponent, {
      disableClose: true,

      width: '1800px',
      // autoFocus: false,
      data: {}
    });

  }

  // bandejaProveedor(idProyecto: number): void {
  //   let idProyectoEncriptado = btoa(idProyecto + "");
  //   this.router.navigate(['/ups/autorizacion/bandeja-proveedor', { idProy: idProyectoEncriptado }]);
  // }

  // descargarExcel($event) {
  //   //$event.stopPropagation();
  //   $event.preventDefault();
  //   this.proyectoEjecucionService.generarExcelProyectoEjecucion(this.pagina, this.cantidad, this.filtrosProyectoRequest);

  // }

  // cargarArchivo(idProyecto: number, fidProyecto: number): void {
  //   this.objproyectoResponse = null;
  //   const dialogReg: MatDialogRef<JefeElaboradorArchivoComponent> = this.dialog.open(JefeElaboradorArchivoComponent, {
  //     panelClass: 'dialog-no-padding',
  //     width: '1200px',
  //     data: {
  //       idProyecto,
  //       fidProyecto
  //     },
  //     disableClose: true
  //   });
  // }


  // verAutorizaciones(idProyecto: number): void {
  //   let idProyectoEncriptado = btoa(idProyecto + "");
  //   this.router.navigate(['/ups/autorizacion/autorizacion', { idProy: idProyectoEncriptado }]);
  // }



}

export class FiltroProyectoRequest {
  convenio?: string;
  codigo?: string;
  tambo?: string;
}

