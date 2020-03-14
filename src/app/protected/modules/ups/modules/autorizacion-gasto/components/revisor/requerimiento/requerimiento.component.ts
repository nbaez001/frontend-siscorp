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
import { filter } from 'rxjs/operators';
import { AdjuntarCotizacionComponent } from '../proveedor/adjuntar-cotizacion/adjuntar-cotizacion.component';
import { TrabajadorService } from '../../../service/trabajador.service';
import { GenerarRequerimientoComponent } from './generar-requerimiento/generar-requerimiento.component';
import { CuadroComparativoComponent } from '../cotizacion/cuadro-comparativo/cuadro-comparativo.component';
import { GenerarSolicitudComponent } from '../cotizacion/generar-solicitud/generar-solicitud.component';
import { AuthService } from 'app/protected/services/auth.service';
import { InformeTecnicoComponent } from '../cronograma-valorizado/autorizacion/informe-tecnico/informe-tecnico.component';

@Component({
  selector: 'app-requerimiento',
  templateUrl: './requerimiento.component.html',
  styleUrls: ['./requerimiento.component.scss']
})
export class RequerimientoComponent implements OnInit {


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
  requerimientoResponse: any[];
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
    private router: Router,
    private authService: AuthService) {
    this.dataSource = new MatTableDataSource([]);

    this.tituloRequerimiento();

  }

  ngOnInit() {
    this.customIconService.cargaIcono();
    this.crearFiltrosForm();
    this.columnasAutorizacion();
    this.cargarDataEstado();
    this.cargarDataProveedores();
    this.cargarListaRequerimiento();

    //this.expedienteSuscripcionEncargado = this.socket.fromEvent('expedienteCoordinador').subscribe(() => this.cargarPerfilPrefactibilidad());

  }


  tituloRequerimiento() {
    this.authService.cabecera.next({
      titulo: MENSAJES.REQUERIMIENTO.TITLE_REQUERIMIENTO + " - " + 'TAMBO QUILLE',
      icono: ''
    });
  }


  ngOnDestroy() {
    this.authService.cabecera.next({
      titulo: '',
      icono: ''
    });
  }


  columnasAutorizacion(): void {
    this.columnas = [
      'nro',
      'numeroHojaTramite',
      'numeroAutorizacionGasto',
      'fechaPresentacionPrograma',
      'montoSolicitado',
      'montoAutorizado',
      'estado',
      'fechaAprobacionAutorizacion',
      'acciones'
    ];
  }

  cambiarPagina(event: PageEvent) {

    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarListaRequerimiento();
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



  reiniciar() {
    this.cotizacionFiltroForm.reset('');
    //this.filtrosProyectoRequest = new ProyectoRequest();
    this.cargarListaRequerimiento();
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

  public cargarTablaRequerimiento(): void {
    if (this.requerimientoResponse != null && this.requerimientoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.requerimientoResponse);
    }
  }


  buscarCotizaciones($event) {

  }
  /*   public cargarListaCotizaciones(): void {
  
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
    } */


  public cargarListaRequerimiento(): void {

    this.dataSource = null;
    this.disableBuscar = true;
    this.cotizacionResponse = [];

    this.cotizacionService.listarRequerimientos(this.pagina, this.cantidad, null)
      .subscribe(
        (wsResponseRequerimiento: any) => {

          if (wsResponseRequerimiento.codResultado == 1) {
            this.requerimientoResponse = (wsResponseRequerimiento.response != null) ? wsResponseRequerimiento.response : [];
            this.total = (wsResponseRequerimiento.total != 0) ? wsResponseRequerimiento.total : 0;
            this.cargarTablaRequerimiento();
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

  generarRequerimiento() {
    const dialogReg: MatDialogRef<GenerarRequerimientoComponent> = this.dialog.open(GenerarRequerimientoComponent, {
      panelClass: 'dialog-no-padding',
      width: '85%',
      height: '93%',
      disableClose: true,
      autoFocus: false,
      data: { flag: 0 }
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


  generarInformeTecnico(idAutorizacion: number): void {

    const dialogReg: MatDialogRef<InformeTecnicoComponent> = this.dialog.open(InformeTecnicoComponent, {
      panelClass: 'dialog-no-padding',
      width: '85%',
      height: '95%',
      disableClose: true,
      data: {}
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

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


  verRequerimiento(idCodigo: number) {
    /*   this.cotizacionService.generaInsumoCotizacion().subscribe(response => {
        let pdf = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdf);
        window.open(url, "_blank");
      }); */

    const dialogReg: MatDialogRef<GenerarRequerimientoComponent> = this.dialog.open(GenerarRequerimientoComponent, {
      panelClass: 'dialog-no-padding',
      width: '85%',
      height: '95%',
      disableClose: true,
      data: { flag: 2 }
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

    });
  }

  editarCotizacion(idCodigo: number) {
    const dialogReg: MatDialogRef<GenerarRequerimientoComponent> = this.dialog.open(GenerarRequerimientoComponent, {
      panelClass: 'dialog-no-padding',
      width: '85%',
      height: '95%',
      disableClose: true,
      data: { flag: 1 }
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

    });
  }

  generarCotizacion(idCodigo: number) {
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

  eliminarAutorizacion(viewCotizacion: string) {

    this.openDialogMensajeConfirm('Está seguro de eliminar la Autorización de Gasto ' + viewCotizacion + '?', true);

    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open('La Autorización de Gasto '+viewCotizacion + " eliminada");
        // viewInsumo.item = this.indexInsumo--;
        /*  this.cotizacionResponse.splice(this.cotizacionResponse.indexOf(viewCotizacion), 1);
         this.dataSource = new MatTableDataSource(this.cotizacionResponse);
         this.dataSource.paginator = this.paginator; */
      });

  }

  enviarRequerimiento(viewCotizacion: Cotizacion) {

    this.openDialogMensajeConfirm(MENSAJES.REQUERIMIENTO.DERIVAR_REQUERIMIENTO_CONFIRM + ' ' + viewCotizacion.codigo + '?', true);

    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open(MENSAJES.REQUERIMIENTO.INFO_SUCCESS_ENVIAR);
        // viewInsumo.item = this.indexInsumo--;
        /*  this.cotizacionResponse.splice(this.cotizacionResponse.indexOf(viewCotizacion), 1);
         this.dataSource = new MatTableDataSource(this.cotizacionResponse);
         this.dataSource.paginator = this.paginator; */
      });

  }

  verCuadroComparativo(idCodigo: number) {
    const dialogReg: MatDialogRef<CuadroComparativoComponent> = this.dialog.open(CuadroComparativoComponent, {
      panelClass: 'dialog-no-padding',
      width: '85%',
      height: '95%',
      disableClose: true,
      data: {}
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

    });
  }

}
