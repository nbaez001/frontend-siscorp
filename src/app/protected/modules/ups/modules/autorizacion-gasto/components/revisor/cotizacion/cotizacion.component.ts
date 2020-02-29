import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Cotizacion, WsResponseCotizacion } from '../../../dto/response/Cotizacion';
import { ItemBean } from '../../../dto/response/ItemBean';
import { MatTableDataSource, MatDialogRef, MatPaginator, MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { ItemComboService } from '../../../service/item-combo.service';
import { ProyectoEjecucionService } from '../../../service/proyecto-ejecucion.service';
import { CustomIconService } from '../../../../expediente/services/custom-icon.service';
import { Router } from '@angular/router';
import { CotizacionService } from '../../../service/cotizacion.service';
import { MENSAJES } from 'app/common';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { GenerarSolicitudComponent } from './generar-solicitud/generar-solicitud.component';
import { filter } from 'rxjs/operators';
import { CuadroComparativoComponent } from './cuadro-comparativo/cuadro-comparativo.component';
import { AdjuntarCotizacionComponent } from '../proveedor/adjuntar-cotizacion/adjuntar-cotizacion.component';
import { TrabajadorService } from '../../../service/trabajador.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})
export class CotizacionComponent implements OnInit {


  cotizacionFiltroForm: FormGroup;

  fechaActual = new Date();

  estados: any[];
  alertas: any[];
  cotizacion: Cotizacion[];
  pagina = 1;
  cantidad = 15;
  total = 0;
  cantidadObservacion = 3;
  paginaObservacion = 1;

  totalObservacion = 0;

  // LISTA EXCEL
  exportExcelPreliminar: string;
  dataItemEstado: ItemBean;
  dataItemProveedor: ItemBean;


  public cidCodigo: string = " ";
  public fechaInicio: string = " ";
  public fechaFin: string = " ";


  // Tabla
  dataSource: MatTableDataSource<Cotizacion>;
  wsResponseCotizacion: WsResponseCotizacion;
  cotizacionResponse: Cotizacion[];
  objproyectoResponse: Cotizacion;

  dialogRefMessage: MatDialogRef<any>;


  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoading: boolean;
  idPerfil: number;
  codPerfil: string;
  columnas: string[] = [];
  mensaje: string;
  disableBuscar: boolean;
  /*   datos:Proyecto;
    expedienteSuscripcionEncargado : Subscription;
    idUsuarioCoordinador: number; */

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private itemComboService: ItemComboService,
    private cotizacionService: CotizacionService,
    private customIconService: CustomIconService,
    private snackBar: MatSnackBar,
    private trabajadorService: TrabajadorService,
    private router: Router) {
    this.dataSource = new MatTableDataSource([]);

  }

  ngOnInit() {
    this.customIconService.cargaIcono();
    this.crearFiltrosForm();
    this.columnasAutorizacion();
    this.cargarDataEstado();
    this.cargarDataProveedores();
    this.cargarListaCotizaciones();

    //this.expedienteSuscripcionEncargado = this.socket.fromEvent('expedienteCoordinador').subscribe(() => this.cargarPerfilPrefactibilidad());

  }

  columnasAutorizacion(): void {
    this.columnas = [
      'Nro', 'codigoCotizacion', 'fechaCreacion', 'rubro', 'proveedor',
      'nroRuc', 'estado', 'acciones'];
  }

  cambiarPagina(event: PageEvent) {

    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarListaCotizaciones();
  }

  crearFiltrosForm() {
    this.cotizacionFiltroForm = new FormGroup({
      rubroFrmCtrl: new FormControl(null),
      proveeedorFrmCtrl: new FormControl(null),
      estadoFrmCtrl: new FormControl(null)
    });
  }

  get rubroFrmCtrl() { return this.cotizacionFiltroForm.get('rubroFrmCtrl'); }
  get proveeedorFrmCtrl() { return this.cotizacionFiltroForm.get('proveeedorFrmCtrl'); }
  get estadoFrmCtrl() { return this.cotizacionFiltroForm.get('estadoFrmCtrl'); }



  reiniciar() {
    this.cotizacionFiltroForm.reset('');
    //this.filtrosProyectoRequest = new ProyectoRequest();
    this.cargarListaCotizaciones();
  }


  /* ngOnDestroy(){
    this.expedienteSuscripcionEncargado.unsubscribe();
  } */

  cargarDataEstado() {
    this.itemComboService.obtenerEstadoCotizacion().subscribe(dataItem => {
      this.dataItemEstado = Object.assign({
        estados: dataItem.response
      });
    });
  }

  cargarDataProveedores() {
    this.itemComboService.obtenerProveedores().subscribe(dataItem => {
      this.dataItemProveedor = Object.assign({
        proveedores: dataItem.response
      });
    });

  }

  public cargarTablaCotizaciones(): void {
    if (this.cotizacionResponse != null && this.cotizacionResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.cotizacionResponse);
    }
  }


  buscarCotizaciones($event) {

  }
  public cargarListaCotizaciones(): void {

    this.dataSource = null;
    this.disableBuscar = true;
    this.cotizacionResponse = [];

    this.cotizacionService.listarCotizaciones(this.pagina, this.cantidad, null)
      .subscribe(
        (wsResponseCotizacion: WsResponseCotizacion) => {

          if (wsResponseCotizacion.codResultado == 1) {
            this.cotizacionResponse = (wsResponseCotizacion.response != null) ? wsResponseCotizacion.response : [];
            this.total = (wsResponseCotizacion.total != 0) ? wsResponseCotizacion.total : 0;
            this.cargarTablaCotizaciones();
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            //this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);     
          }
          this.isLoading = false;
          this.disableBuscar = false;
        },
        error => {
          console.error(error);

        }
      );
  }



  descargarExcel($event) {
    //$event.stopPropagation();
    $event.preventDefault();
    this.cotizacionService.generarExcelCotizacion(this.pagina, this.cantidad, null);

  }


  verCronograma(idProyecto: number): void {
    let idProyectoEncriptado = btoa(idProyecto + "");
    this.router.navigate(['/ups/cotizacion/cronograma-valorizado', { idProy: idProyectoEncriptado }]);
  }

  verAutorizaciones(idProyecto: number): void {
    let idProyectoEncriptado = btoa(idProyecto + "");
    this.router.navigate(['/ups/autorizacion/cotizacion', { idProy: idProyectoEncriptado }]);
  }

  generarCotizacion() {
    const dialogReg: MatDialogRef<GenerarSolicitudComponent> = this.dialog.open(GenerarSolicitudComponent, {
      panelClass: 'dialog-no-padding',
      width: '85%',
      height: '95%',
      disableClose: true,
      data: {}
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

    });
  }

  adjuntarCotizacion(idCodigo: number) {
    this.trabajadorService.adjuntarCotizacionProveedor(idCodigo).subscribe(data => {
      const dialogReg: MatDialogRef<AdjuntarCotizacionComponent> = this.dialog.open(AdjuntarCotizacionComponent, {
        panelClass: 'dialog-no-padding',
        width: '40%',
        height: '85%',
        disableClose: true,
        data: {
          //dataAdjuntarCotizacion: data.response,
        }
      });
    });
  }

  /*
    editarAutorizacion(){
      const dialogReg: MatDialogRef<RegistrarComponent> = this.dialog.open(RegistrarComponent, {
        panelClass: 'dialog-no-padding',
        width: '85%', 
        height: '95%',
        disableClose: true,
        data: {}
        }); 
      dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {           
            
      });
    } */



  /*   eliminarAutorizacion(autoView: Cotizacion){
      this.openDialogMensajeConfirm(MENSAJES.AUTORIZACION.ELIMINAR_AUTORIZACION_CONFIRM + ' ' + autoView.codigo + '?', true);
  
      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => {
          this.snackBar.open("Autorización " + autoView.codigo + " eliminada");
          //autoView.item = this.indexInsumo--;
          this.autorizacionResponse.splice(this.autorizacionResponse.indexOf(autoView), 1);
          this.dataSource = new MatTableDataSource(this.autorizacionResponse);     
        });
    }
   */
  /* 
    generarInformeTecnico(idAutorizacion: number): void{
  
      const dialogReg: MatDialogRef<InformeTecnicoComponent> = this.dialog.open(InformeTecnicoComponent, {
        panelClass: 'dialog-no-padding',
        width: '85%', 
        height: '95%',
        disableClose: true,
        data: {}
        }); 
      dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {           
            
      });
    } */

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


  verSolicitud(idCodigo: number) {
    this.cotizacionService.generaInsumoCotizacion().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
    });

  }

  editarCotizacion(idCodigo: number) {
    const dialogReg: MatDialogRef<GenerarSolicitudComponent> = this.dialog.open(GenerarSolicitudComponent, {
      panelClass: 'dialog-no-padding',
      width: '85%',
      height: '95%',
      disableClose: true,
      data: {}
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

    });
  }

  eliminarAutorizacion(viewCotizacion: Cotizacion) {

    this.openDialogMensajeConfirm(MENSAJES.COTIZACION.ELIMINAR_COTIZACION_CONFIRM + ' ' + viewCotizacion.codigo + '?', true);

    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open(viewCotizacion.codigo + " eliminada");
        // viewInsumo.item = this.indexInsumo--;
        this.cotizacionResponse.splice(this.cotizacionResponse.indexOf(viewCotizacion), 1);
        this.dataSource = new MatTableDataSource(this.cotizacionResponse);
        this.dataSource.paginator = this.paginator;
      });

  }

  verCuadroComparativo(idCodigo: number) {
    const dialogReg: MatDialogRef<CuadroComparativoComponent> = this.dialog.open(CuadroComparativoComponent, {
      // panelClass: 'dialog-no-padding',
      width: '85%',
      height: '95%',
      disableClose: true,
      data: {}
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

    });
  }

}