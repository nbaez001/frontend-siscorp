import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ItemComboService } from './../../../../service/item-combo.service';
import { CotizacionService } from './../../../../service/cotizacion.service';
import { CustomIconService } from './../../../../../expediente/services/custom-icon.service';
import { TrabajadorService } from './../../../../service/trabajador.service';
import { Router } from '@angular/router';
import { WsResponseCotizacion } from '../../../../dto/response/Cotizacion';
import { Cotizacion } from './../../../../dto/response/Cotizacion';
import { ItemBean } from './../../../../dto/response/ItemBean';
import { MENSAJES } from 'app/common';
import { GenerarRequerimientoComponent } from './../generar-requerimiento/generar-requerimiento.component';
import { AdjuntarCotizacionComponent } from './../../proveedor/adjuntar-cotizacion/adjuntar-cotizacion.component';
import { InformeTecnicoComponent } from './../../cronograma-valorizado/autorizacion/informe-tecnico/informe-tecnico.component';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { GenerarSolicitudComponent } from './../../cotizacion/generar-solicitud/generar-solicitud.component';
import { filter } from 'rxjs/operators';
import { CuadroComparativoComponent } from './../../cotizacion/cuadro-comparativo/cuadro-comparativo.component';
import * as _moment from 'moment';
import { HistorialAutorizacionComponent } from '../historial-autorizacion/historial-autorizacion.component';

@Component({
  selector: 'app-modal-requerimiento',
  templateUrl: './modal-requerimiento.component.html',
  styleUrls: ['./modal-requerimiento.component.scss']
})
export class ModalRequerimientoComponent implements OnInit {

  nombreTambo: string;

  cotizacionFiltroForm: FormGroup;
  pagina = 1;
  cantidad = 10;
  total = 0;
  dataItemEstado: any;
  dataSource: MatTableDataSource<Cotizacion>;
  cotizacionResponse: Cotizacion[];
  filtrosRequest: busquedaRequestAutorizacionGasto = new busquedaRequestAutorizacionGasto();
  dialogRefMessage: MatDialogRef<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoading: boolean;
  columnas: string[] = [];
  mensaje: string;
  disableBuscar: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private itemComboService: ItemComboService,
    private cotizacionService: CotizacionService,
    private customIconService: CustomIconService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<ModalRequerimientoComponent>,
    @Inject(MAT_DIALOG_DATA)
    private datos: DatosModalRequerimiento,
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.cargarListaRequerimiento();
    this.cargarDataEstado();
    this.nombreTambo = this.datos.nombreTambo;
    this.customIconService.cargaIcono();
    this.crearFiltrosForm();
    this.columnasAutorizacion();
  }

  columnasAutorizacion(): void {
    this.columnas = [
      'item',
      'numeroHojaTramite',
      'numeroAutorizacionGasto',
      'fechaPresentacionPrograma',
      'montoSolicitado',
      'montoAutorizado',
      'estado',
      'puestoActual',
      'fechaAprobacionAutorizacion',
      'acciones'
    ];
  }

  crearFiltrosForm() {
    this.cotizacionFiltroForm = new FormGroup({
      fechaRegDesdeFrmCtrl: new FormControl(null),
      fechaRegHastaFrmCtrl: new FormControl(null),
      estadoFrmCtrl: new FormControl(null)
    });
  }
  get fechaRegDesdeFrmCtrl() { return this.cotizacionFiltroForm.get('fechaRegDesdeFrmCtrl'); }
  get fechaRegHastaFrmCtrl() { return this.cotizacionFiltroForm.get('fechaRegHastaFrmCtrl'); }
  get estadoFrmCtrl() { return this.cotizacionFiltroForm.get('estadoFrmCtrl'); }

  public guardarFiltrosBusqueda(): void {
    this.filtrosRequest.fechaInicio = this.fechaRegDesdeFrmCtrl.value !== null ? _moment(this.fechaRegDesdeFrmCtrl.value).format('DD-MM-YYYY') : null;
    this.filtrosRequest.fechaFin = this.fechaRegHastaFrmCtrl.value !== null ? _moment(this.fechaRegHastaFrmCtrl.value).format('DD-MM-YYYY') : null;
    this.filtrosRequest.idEstado = + this.estadoFrmCtrl.value;
  }

  buscarCotizaciones($event): void {
    $event.preventDefault();
    this.guardarFiltrosBusqueda();
    this.cargarListaRequerimiento();
  }

  reiniciar() {
    this.cotizacionFiltroForm.reset('');
    this.filtrosRequest = null;
    this.filtrosRequest = new busquedaRequestAutorizacionGasto();
    this.cargarListaRequerimiento();
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarListaRequerimiento();
  }

  public cargarTablaRequerimiento(): void {
    if (this.cotizacionResponse != null && this.cotizacionResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.cotizacionResponse);
    }
  }

  public cargarListaRequerimiento(): void {
    this.dataSource = null;
    this.disableBuscar = true;
    this.cotizacionResponse = [];
    this.isLoading = true;
    this.cotizacionService.listarBandejaAutorizacionGasto(this.datos.idProyecto, this.pagina, this.cantidad, this.filtrosRequest).subscribe(
      (wsResponseRequerimiento: any) => {
        if (wsResponseRequerimiento.codResultado == 1) {
          this.cotizacionResponse = (wsResponseRequerimiento.response != null) ? wsResponseRequerimiento.response : [];
          this.total = (wsResponseRequerimiento.total != 0) ? wsResponseRequerimiento.total : 0;
          this.cargarTablaRequerimiento();
        } else {
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          // this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);     
        }
        this.isLoading = false;
        this.disableBuscar = false;
      },
      error => {
        console.error(error);

      }
    );
  }

  cargarDataEstado() {
    this.itemComboService.obtenerEstadoAutorizacionGasto().subscribe(dataItem => {
      this.dataItemEstado = dataItem.response;
    });
  }


  verHistorial(idAutorizacionGasto: number, numeroAutoGasto: string) {
    const dialogReg: MatDialogRef<HistorialAutorizacionComponent> = this.dialog.open(HistorialAutorizacionComponent, {
      disableClose: true,
      width: '1000px',
      autoFocus: false,
      data: {
        idAutorizacionGasto: idAutorizacionGasto,
        numeroAutoGasto: numeroAutoGasto
      }
    });
  }

























  generarCotizacion(idCodigo: number) {
    const dialogReg: MatDialogRef<GenerarSolicitudComponent> = this.dialog.open(GenerarSolicitudComponent, {
      panelClass: 'dialog-no-padding',
      autoFocus: false,
      width: '1800px',
      height: '800px',
      disableClose: true,
      data: {}
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

    });
  }

  eliminarAutorizacion(viewCotizacion: string) {

    this.openDialogMensajeConfirm('Está seguro de eliminar la Autorización de Gasto ' + viewCotizacion + '?', true);

    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open('La Autorización de Gasto ' + viewCotizacion + " eliminada");
        // viewInsumo.item = this.indexInsumo--;
        /*  this.cotizacionResponse.splice(this.cotizacionResponse.indexOf(viewCotizacion), 1);
         this.dataSource = new MatTableDataSource(this.cotizacionResponse);
         this.dataSource.paginator = this.paginator; */
      });

  }

  generarRequerimiento() {
    const dialogReg: MatDialogRef<GenerarRequerimientoComponent> = this.dialog.open(GenerarRequerimientoComponent, {
      width: '1600px',
      disableClose: true,
      autoFocus: false,
      data: { flag: 0 }
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

    });
  }

  // cargarDataProveedores() {
  //   this.itemComboService.obtenerProveedores().subscribe(dataItem => {
  //     this.dataItemProveedor = Object.assign({
  //       proveedores: dataItem.response
  //     });
  //   });
  // }

  // descargarExcel($event) {
  //   //$event.stopPropagation();
  //   $event.preventDefault();
  //   this.cotizacionService.generarExcelCotizacion(this.pagina, this.cantidad, null);
  // }


  // verCronograma(idProyecto: number): void {
  //   let idProyectoEncriptado = btoa(idProyecto + "");
  //   this.router.navigate(['/ups/cotizacion/cronograma-valorizado', { idProy: idProyectoEncriptado }]);
  // }

  // verAutorizaciones(idProyecto: number): void {
  //   let idProyectoEncriptado = btoa(idProyecto + "");
  //   this.router.navigate(['/ups/autorizacion/cotizacion', { idProy: idProyectoEncriptado }]);
  // }



  // adjuntarCotizacion(idCodigo: number) {
  //   this.trabajadorService.adjuntarCotizacionProveedor(idCodigo).subscribe(data => {
  //     const dialogReg: MatDialogRef<AdjuntarCotizacionComponent> = this.dialog.open(AdjuntarCotizacionComponent, {
  //       panelClass: 'dialog-no-padding',
  //       width: '40%',
  //       height: '85%',
  //       disableClose: true,
  //       data: {
  //         //dataAdjuntarCotizacion: data.response,
  //       }
  //     });
  //   });
  // }


  // generarInformeTecnico(idAutorizacion: number): void {
  //   const dialogReg: MatDialogRef<InformeTecnicoComponent> = this.dialog.open(InformeTecnicoComponent, {
  //     panelClass: 'dialog-no-padding',
  //     width: '85%',
  //     height: '95%',
  //     disableClose: true,
  //     data: {}
  //   });
  //   dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

  //   });
  // }

  public openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

  public openDialogMensaje(message: string, alerta: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, alerta: alerta }
    });
  }

  // verRequerimiento(idCodigo: number) {
  //   const dialogReg: MatDialogRef<GenerarRequerimientoComponent> = this.dialog.open(GenerarRequerimientoComponent, {
  //     panelClass: 'dialog-no-padding',
  //     width: '85%',
  //     height: '95%',
  //     disableClose: true,
  //     data: { flag: 2 }
  //   });
  //   dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

  //   });
  // }

  // editarCotizacion(idCodigo: number) {
  //   const dialogReg: MatDialogRef<GenerarRequerimientoComponent> = this.dialog.open(GenerarRequerimientoComponent, {
  //     panelClass: 'dialog-no-padding',
  //     width: '85%',
  //     height: '95%',
  //     disableClose: true,
  //     data: { flag: 1 }
  //   });
  //   dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

  //   });
  // }

  // enviarRequerimiento(viewCotizacion: Cotizacion) {

  //   this.openDialogMensajeConfirm(MENSAJES.REQUERIMIENTO.DERIVAR_REQUERIMIENTO_CONFIRM + ' ' + viewCotizacion.codigo + '?', true);

  //   this.dialogRefMessage.afterClosed()
  //     .pipe(filter(verdadero => !!verdadero))
  //     .subscribe(() => {
  //       this.snackBar.open(MENSAJES.REQUERIMIENTO.INFO_SUCCESS_ENVIAR);
  //       // viewInsumo.item = this.indexInsumo--;
  //       /*  this.cotizacionResponse.splice(this.cotizacionResponse.indexOf(viewCotizacion), 1);
  //        this.dataSource = new MatTableDataSource(this.cotizacionResponse);
  //        this.dataSource.paginator = this.paginator; */
  //     });

  // }

  // verCuadroComparativo(idCodigo: number) {
  //   const dialogReg: MatDialogRef<CuadroComparativoComponent> = this.dialog.open(CuadroComparativoComponent, {
  //     panelClass: 'dialog-no-padding',
  //     width: '85%',
  //     height: '95%',
  //     disableClose: true,
  //     data: {}
  //   });
  //   dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

  //   });
  // }

}

interface DatosModalRequerimiento {
  nombreTambo?: string;
  idProyecto?: number;
}

export class busquedaRequestAutorizacionGasto {
  idEstado?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

