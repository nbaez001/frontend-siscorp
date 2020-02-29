import { Component, OnInit, ViewChild } from '@angular/core';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { MENSAJES } from 'app/common';
import { PageEvent, MatTableDataSource, MatPaginator, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { WsResponseProyecto } from '../../../../dto/response/Proyecto';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomIconService } from 'app/protected/modules/ups/modules/expediente/services/custom-icon.service';
import { CotizacionService } from '../../../../service/cotizacion.service';
import { WsResponseCotizacion, Cotizacion } from '../../../../dto/response/Cotizacion';
import { filter } from 'rxjs/operators';
import { CuadroComparativoComponent } from '../cuadro-comparativo/cuadro-comparativo.component';
import { TrabajadorService } from '../../../../service/trabajador.service';
import { AdjuntarCotizacionComponent } from '../../proveedor/adjuntar-cotizacion/adjuntar-cotizacion.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalculoPagoComponent } from '../../trabajador/calculo-pago/calculo-pago.component';
import { CuadroComparativoDinamicoComponent } from '../cuadro-comparativo-dinamico/cuadro-comparativo-dinamico.component';
import { Insumo } from '../../../../dto/response/Insumo';

@Component({
  selector: 'app-generar-solicitud',
  templateUrl: './generar-solicitud.component.html',
  styleUrls: ['./generar-solicitud.component.scss']
})
export class GenerarSolicitudComponent implements OnInit {


  filtrosForm: FormGroup;
  fechaActual = new Date();
  estados: any[];
  pagina = 1;
  cantidad = 2;
  total = 0;

  listRubro: any[];
  listCategoria: any[];
  listTipo: any[];
  public fechaInicio: string = " ";
  public fechaFin: string = " ";


  columnasGastoGeneral:  string[] = [];
  columnasGastoResidente: string[] = [];

  columnasGastoFinanciero: string[] = [];
  columnasGastoNucleoEjecutor: string[] = [];
  columnasGastoSupervisor: string[] = [];

  // Tabla
  dataSource: MatTableDataSource<any>;
  dataSourceGastoGeneral: MatTableDataSource<any>;
  dataSourceCotizacion: MatTableDataSource<Cotizacion>;
  dataSourceGastoResidente: MatTableDataSource<any>;
  dataSourceGastoFinanciero: MatTableDataSource<any>;
  dataSourceGastoNucleoEjecutor: MatTableDataSource<any>;
  dataSourceGastoSupervisor: MatTableDataSource<any>;
  dataSourceDocumentos: MatTableDataSource<any>;
  wsResponseProyecto: WsResponseProyecto;
  proyectoResponse: Cotizacion[];
  objproyectoResponse: any;
  cotizacionResponse: Cotizacion[];
  // Checked
  selectionCotizacion = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dialogRefMessage: MatDialogRef<any>;

  isLoading: boolean;
  columnas: string[] = [];
  mensaje: string;
  disableBuscar: boolean;
  dataTrabajador: any;
  columnasCotizacion: string[];
  gastoGeneralResponse: any[];
  gastoResidenteResponse: any[];
  gastoFinancieroResponse: any[];
  gastoNucleoEjecutorResponse: any[];
  gastoSupervisorResponse: any[];

  spans = [];

  constructor(public dialogRef: MatDialogRef<GenerarSolicitudComponent>,
    private dialog: MatDialog,
    private cotizacionService: CotizacionService,
    private customIconService: CustomIconService,
    private snackBar: MatSnackBar,
    private trabajadorService: TrabajadorService,
    private spinner: NgxSpinnerService
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.dataSourceGastoGeneral = new MatTableDataSource([]);
    this.dataSourceCotizacion = new MatTableDataSource([]);
    this.dataSourceGastoFinanciero = new MatTableDataSource([]);
    this.dataSourceGastoNucleoEjecutor = new MatTableDataSource([]);
    this.dataSourceGastoSupervisor = new MatTableDataSource([]);
    this.dataSourceDocumentos = new MatTableDataSource([]);

 
  }

  ngOnInit() {
    this.customIconService.cargaIcono();
    this.crearFiltrosForm();
    this.generarCabeceraColumnas();
    this.generarCabeceraColumnasGastoGeneral();
    this.generarCabeceraColumnasGastoResidente();

    this.generarCabeceraColumnasGastoFinanciero();
    this.generarCabeceraColumnasGastoNucleoEjecutor();
    this.generarCabeceraColumnasGastoSupervisor();

    this.cargarCombos();
    this.cargarInsumoCotizacion();
    //this.cargarListaCotizaciones();
    this.cargarInsumoCotizacionGastoGeneral();
    this.cargarInsumoGastoResidente();
    this.cargarInsumoGastoFinanciero();
    this.cargarInsumoGastoNucleoEjecutor();
    this.cargarInsumoGastoSupervisor();
  }

  // **************** BANDEJA ****************
  public cargarTablaInsumoCotizacion(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

/*   public cargarTablaCotizaciones(): void {
    if (this.cotizacionResponse != null && this.cotizacionResponse.length > 0) {
      this.dataSourceCotizacion = new MatTableDataSource(this.cotizacionResponse);
    }
  } */

  public cargarTablaInsumoCotizacionGastoGeneral(): void {
    if (this.gastoGeneralResponse != null && this.gastoGeneralResponse.length > 0) {
      this.dataSourceGastoGeneral = new MatTableDataSource(this.gastoGeneralResponse);
     
     /*  if(this.datos.flag == 1 || this.datos.flag == 2){
        this.selectionCotizacion = new SelectionModel<any>(true, [this.dataSource.data[1].checked = true ,this.dataSource.data[2].checked = true]);
      }else{
        this.selectionCotizacion = new SelectionModel<any>(true, []);
      } */
    }
  }

  public cargarTablaInsumoCotizacionGastoResidente(): void {
    if (this.gastoResidenteResponse != null && this.gastoResidenteResponse.length > 0) {
      this.dataSourceGastoResidente = new MatTableDataSource(this.gastoResidenteResponse);
    }
  }

  public cargarTablaInsumoCotizacionGastoFinanciero(): void{
    if (this.gastoFinancieroResponse != null && this.gastoFinancieroResponse.length > 0) {
      this.dataSourceGastoFinanciero = new MatTableDataSource(this.gastoFinancieroResponse);
    }
  }

  public cargarTablaInsumoCotizacionGastoNucleoEjecutor(): void{
    if (this.gastoNucleoEjecutorResponse != null && this.gastoNucleoEjecutorResponse.length > 0) {
      this.dataSourceGastoNucleoEjecutor = new MatTableDataSource(this.gastoNucleoEjecutorResponse);
    }
  }

  public cargarTablaInsumoCotizacionGastoSupervisor(): void{
    if (this.gastoSupervisorResponse != null && this.gastoSupervisorResponse.length > 0) {
      this.dataSourceGastoSupervisor= new MatTableDataSource(this.gastoSupervisorResponse);
    }
  }

  public cargarInsumoCotizacion(): void {

    this.dataSource = null;
    this.disableBuscar = true;
    this.proyectoResponse = [];
    this.isLoading = true;

    this.cotizacionService.listarInsumos(this.pagina, this.cantidad,null)
      .subscribe(
        (wsResponseCotizacion: WsResponseCotizacion) => {
          if (wsResponseCotizacion.codResultado == 1) {
            
            this.proyectoResponse = (wsResponseCotizacion.response != null) ? wsResponseCotizacion.response : [];
            console.log(this.proyectoResponse);
            this.cacheSpan('solicitud', d => d.solicitud, this.proyectoResponse);
            this.cacheSpan('estado', d => d.solicitud + d.estado, this.proyectoResponse);
            this.cacheSpan('accion', d => d.solicitud + d.estado + d.accion, this.proyectoResponse);
            this.total = (wsResponseCotizacion.total != 0) ? wsResponseCotizacion.total : 0;
            this.cargarTablaInsumoCotizacion();
            
            console.log("insumo")
            console.log(this.dataSource)
           
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

  columnas2: string[] = ['nro',
  'documento',
  'archivo',];
  cargarColumas1(){
    this.columnas = [
    'nro',
    'cargo',
    'nombre',
    'dni',
   
    ];
    }
    
      
   


  public cargarInsumoCotizacionGastoGeneral(): void {

    this.dataSourceGastoGeneral = null;
    this.disableBuscar = true;
    this.gastoGeneralResponse = [];
    this.isLoading = true;

    this.cotizacionService.listarInsumosGastoGeneral(this.pagina, this.cantidad,null)
      .subscribe(
        (wsResponseCotizacion: WsResponseCotizacion) => {
          if (wsResponseCotizacion.codResultado == 1) {
            this.gastoGeneralResponse = (wsResponseCotizacion.response != null) ? wsResponseCotizacion.response : [];
    /*         this.cacheSpan('solicitud', d => d.solicitud, this.gastoGeneralResponse);
            this.cacheSpan('estado', d => d.solicitud + d.estado, this.gastoGeneralResponse);
            this.cacheSpan('accion', d => d.solicitud + d.estado + d.accion, this.gastoGeneralResponse);
 */            this.total = (wsResponseCotizacion.total != 0) ? wsResponseCotizacion.total : 0;
            this.cargarTablaInsumoCotizacionGastoGeneral();
           
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

  
  public cargarInsumoGastoResidente(): void {

    this.disableBuscar = true;
    this.gastoGeneralResponse = [];
    this.isLoading = true;

    this.cotizacionService.listarInsumosGastoResidente(this.pagina, this.cantidad,null)
      .subscribe(
        (wsResponseCotizacion: WsResponseCotizacion) => {
          if (wsResponseCotizacion.codResultado == 1) {
            this.gastoResidenteResponse = (wsResponseCotizacion.response != null) ? wsResponseCotizacion.response : [];
            this.total = (wsResponseCotizacion.total != 0) ? wsResponseCotizacion.total : 0;
            this.cargarTablaInsumoCotizacionGastoResidente();
           
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

  public cargarInsumoGastoFinanciero(): void {
    this.disableBuscar = true;
    this.gastoGeneralResponse = [];
    this.isLoading = true;

    this.cotizacionService.listarInsumosGastoFinanciero(this.pagina, this.cantidad,null)
      .subscribe(
        (wsResponseCotizacion: WsResponseCotizacion) => {
          if (wsResponseCotizacion.codResultado == 1) {
            this.gastoFinancieroResponse = (wsResponseCotizacion.response != null) ? wsResponseCotizacion.response : [];
            this.total = (wsResponseCotizacion.total != 0) ? wsResponseCotizacion.total : 0;
            this.cargarTablaInsumoCotizacionGastoFinanciero();
           
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


  public cargarInsumoGastoNucleoEjecutor(): void {
    this.disableBuscar = true;
    this.gastoGeneralResponse = [];
    this.isLoading = true;

    this.cotizacionService.listarInsumosGastoNucleoEjecutor(this.pagina, this.cantidad,null)
      .subscribe(
        (wsResponseCotizacion: WsResponseCotizacion) => {
          if (wsResponseCotizacion.codResultado == 1) {
            this.gastoNucleoEjecutorResponse = (wsResponseCotizacion.response != null) ? wsResponseCotizacion.response : [];
            this.total = (wsResponseCotizacion.total != 0) ? wsResponseCotizacion.total : 0;
            this.cargarTablaInsumoCotizacionGastoNucleoEjecutor();
           
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


  public cargarInsumoGastoSupervisor(): void {

    this.dataSourceGastoGeneral = null;
    this.disableBuscar = true;
    this.gastoGeneralResponse = [];
    this.isLoading = true;

    this.cotizacionService.listarInsumosGastoSupervisor(this.pagina, this.cantidad,null)
      .subscribe(
        (wsResponseCotizacion: WsResponseCotizacion) => {
          if (wsResponseCotizacion.codResultado == 1) {
            this.gastoSupervisorResponse = (wsResponseCotizacion.response != null) ? wsResponseCotizacion.response : [];
            this.total = (wsResponseCotizacion.total != 0) ? wsResponseCotizacion.total : 0;
            this.cargarTablaInsumoCotizacionGastoSupervisor();
           
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

  generarCabeceraColumnas(): void {
    this.columnas = [
      'checked',
      'recurso',
      'subrubro',
      'unidad',
      'cantidad',
      'cuExp',
      'parcialExp',
      'cuCotiz',
      'parcialCotiz',
      'diferenciaCu',
      'diferenciaParcial',
      'variacionParcial',

      //'precio',
      
      // 'cantidad_solicitada',
      // 'saldo_disponible',
      //'cantidad_cotizacion',
      'solicitud',
      //'estado',
      'acciones',
      'observaciones'
    ];
  }

  generarCabeceraColumnasGastoGeneral(): void {
    this.columnasGastoGeneral = [
      // 'checked2',
      'recurso2',
      'unidad2',
      'cantidad2',
      'cuExp2',
      'parcialExp2',
      'cuCotiz2',
      'parcialCotiz2',
      'diferenciaCu2',
      'diferenciaParcial2',
      'variacionParcial2',
      // 'unidad2',
      // 'cantidad2',
      // 'precio2',
      // 'cantidad_solicitada2',
      // 'saldo_disponible2',
      // 'cantidad_cotizacion2',
      'solicitud2',
      // 'estado2',
      // 'acciones2'
    ];
  }


  generarCabeceraColumnasGastoResidente(): void {
    this.columnasGastoResidente = [
      'checked3',
      'recurso3',
      'unidad3',
      'cantidad3',
      'precio3',
      'cantidad_solicitada3',
      'saldo_disponible3',
      'cantidad_cotizacion3',
      'solicitud3',
      'estado3',
      'acciones3'
    ];
  }

  generarCabeceraColumnasGastoFinanciero(): void {
    this.columnasGastoFinanciero = [
      'checked4',
      'recurso4',
      'unidad4',
      'cantidad4',
      'precio4',
      'cantidad_solicitada4',
      'saldo_disponible4',
      'cantidad_cotizacion4',
      'solicitud4',
      'estado4',
      'acciones4'
    ];
  }

  generarCabeceraColumnasGastoNucleoEjecutor(): void {
    this.columnasGastoNucleoEjecutor = [
      'checked5',
      'recurso5',
      'unidad5',
      'cantidad5',
      'precio5',
      'cantidad_solicitada5',
      'saldo_disponible5',
      'cantidad_cotizacion5',
      'solicitud5',
      'estado5',
      'acciones5'
    ];
  }

  generarCabeceraColumnasGastoSupervisor(): void {
    this.columnasGastoSupervisor = [
      'checked6',
      'recurso6',
      'unidad6',
      'cantidad6',
      'precio6',
      'cantidad_solicitada6',
      'saldo_disponible6',
      'cantidad_cotizacion6',
      'solicitud6',
      'estado6',
      'acciones6'
    ];
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarInsumoCotizacion();
  }

  seleccionarCotizacion(trabajador) {
    this.selectionCotizacion.toggle(trabajador);
  }

  // ****************  FILTROS  ****************
  crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
      comboRubroFrmCtrl: new FormControl(null)
    });
  }

  get comboRubroFrmCtrl() { return this.filtrosForm.get('comboRubroFrmCtrl'); }


  cargarCombos() {
     this.cotizacionService.obtenerRubro().subscribe(data => {
      this.listRubro = data.response;
    });

    /*
    this.trabajadorService.obtenerCategoriaTrabajador().subscribe(data => {
      this.listCategoria = data.response;
    });
    this.trabajadorService.obtenerTipoTrabajador().subscribe(data => {
      this.listTipo = data.response
    }); */
  }

  public guardarFiltrosBusqueda(): void {
  /*   this.filtrosTrabajadorRequest.apellidoNombre = this.apellidoNombreFrmCtrl.value;
    this.filtrosTrabajadorRequest.genero = this.comboGeneroFrmCtrl.value;
    this.filtrosTrabajadorRequest.categoria = this.comboCategoriaFrmCtrl.value;
    this.filtrosTrabajadorRequest.tipo = this.comboTipoFrmCtrl.value;
    this.filtrosTrabajadorRequest.fechaInicio = this.fechaDesdeFrmCtrl.value !== null ? _moment(this.fechaDesdeFrmCtrl.value).format('DD-MM-YYYY') : null;
    this.filtrosTrabajadorRequest.fechaFin = this.fechaHastaFrmCtrl.value !== null ? _moment(this.fechaHastaFrmCtrl.value).format('DD-MM-YYYY') : null;
    this.filtrosTrabajadorRequest.semana = this.semanaFrmCtrl.value; */
  }

  public filtrarTrabajador($event): void {
    $event.preventDefault();
    this.guardarFiltrosBusqueda();
    this.cargarInsumoCotizacion();
  }

  reiniciar() {
    this.filtrosForm.reset('');
    //this.filtrosTrabajadorRequest = new TrabajadorRequest();
    this.cargarInsumoCotizacion();
  }

  // **************** TRABAJADOR ****************
/*   modalTrabajador(idCodigo: number) {
    if (idCodigo) {
      this.trabajadorService.obtenerTrabajador(idCodigo).subscribe(data => {
        const dialogReg: MatDialogRef<RegistoTrabajadorComponent> = this.dialog.open(RegistoTrabajadorComponent, {
          disableClose: true,
          panelClass: 'dialog-no-padding',
          width: '40%',
          data: {
            dataTrabajador: data.response
          }
        });
        dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {
          this.cargarTrabajador();
        });
      });
    } else {
      const dialogReg: MatDialogRef<RegistoTrabajadorComponent> = this.dialog.open(RegistoTrabajadorComponent, {
        disableClose: true,
        panelClass: 'dialog-no-padding',
        width: '40%',
        data: {}
      });
      dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {
        this.cargarTrabajador();
      });
    }
  } */

 

  eliminarTrabajador(idCodigo: number, trabajador: string) {
    this.openDialogMensajeConfirm(MENSAJES.TRABAJADOR.ELIMINAR_TRABAJADOR_CONFIRM + trabajador + '?', true);
    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open("Trabajador " + trabajador + " eliminado");
        this.cargarInsumoCotizacion();
      });
  }

  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

  // **************** TAREO ****************
/*   registrarAsistenciaTareo() {
    if (this.selectionCotizacion.selected.length != 0) {
      let idSelect = "";
      this.selectionCotizacion.selected.forEach(response => {
        idSelect = idSelect + response.idCodigo + ',';
      });
      const dialogReg: MatDialogRef<AsistenciaTareoComponent> = this.dialog.open(AsistenciaTareoComponent, {
        disableClose: true,
        panelClass: 'dialog-no-padding',
        width: '30%',
        data: {
          dataTrabajadorSelected: idSelect.substr(0, idSelect.length - 1)
        }
      });
    }else{
      console.log("seleccionar");
    }
  } */


   /*  this.openDialogMensajeConfirm(MENSAJES.COTIZACION.GUARDAR_COTIZACION, true);

    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open("Insumo " + viewInsumo.descripcion + " eliminado");
        viewInsumo.item = this.indexInsumo--;
        this.insumoResponse.splice(this.insumoResponse.indexOf(viewInsumo), 1);
        this.dataSource = new MatTableDataSource(this.insumoResponse);
        this.dataSource.paginator = this.paginator;
      });
      this.limpiarFormularioInsumo(); */

  


  /*
  if (this.selectionTrabajador.selected.length != 0) {
      let idSelect = "";
      this.selectionTrabajador.selected.forEach(response => {
        idSelect = idSelect + response.idCodigo + ',';
      });
      const dialogReg: MatDialogRef<AsistenciaTareoComponent> = this.dialog.open(AsistenciaTareoComponent, {
        disableClose: true,
        panelClass: 'dialog-no-padding',ss
        width: '30%',
        data: {
          dataTrabajadorSelected: idSelect.substr(0, idSelect.length - 1)
        }
      });
    } else {
      this.snackBar.open("Seleccionar un trabajador ");
    }
  */
  // **************** REPORTE ****************


  generarSolicitudCotizacion() {
    this.cotizacionService.generaInsumoCotizacion().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
    });
  }


  finalizarSolicitudCotizacion(){
    /* if(this.selectionCotizacion.selected.length != 0){ */
     /*  this.openDialogMensajeConfirm(MENSAJES.COTIZACION.AUTORIZACION_GASTO, true);

      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => { */
          //this.snackBar.open(MENSAJES.COTIZACION.INFO_SUCCESS_FINALIZAR);
      /*     this.dialogRef.close();
        }); */
    /*} else {
      this.snackBar.open("Seleccionar al menos un insumo ");
    } */
    this.trabajadorService.generaReporteAutorizacionGasto().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
    });
  }

    /* 
  verAutorizacion(idProyecto: number): void{
    this.trabajadorService.generaReporteAutorizacionGasto().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
    });
  } */

  
  verSolicitud(idCodigo: number) {
    this.cotizacionService.generaInsumoCotizacion().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
    });

  }



  // **************** GENERAR HOJA DE TAREO ****************
  generaHojaTareo(idCodigo: number) {
   
      this.spinner.show();
      this.trabajadorService.generaReporteTareo().subscribe(response => {
        let pdf = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdf);
        window.open(url, "_blank");
      });


      this.trabajadorService.generaReporteJornal().subscribe(response => {
        let pdf = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdf);
        window.open(url, "_blank");
        this.spinner.hide()
      });

   
  }


  editarCotizacion(idCodigo: number) {
    /* const dialogReg: MatDialogRef<GenerarSolicitudComponent> = this.dialog.open(GenerarSolicitudComponent, {
      panelClass: 'dialog-no-padding',
      width: '85%',
      height: '95%',
      disableClose: true,
      data: {}
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

    }); */
  }

  eliminarAutorizacion(viewCotizacion: Cotizacion) {

    this.openDialogMensajeConfirm(MENSAJES.COTIZACION.ELIMINAR_COTIZACION_CONFIRM, true);

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
      // width: '85%',
      // height: '95%',
      
      width: '85%',
      height: '93%',
      disableClose: true,
      data: {}
    });
    dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {

    });
  }

  verCuadroComparativoDinamico(idCodigo: number) {
    const dialogReg: MatDialogRef<CuadroComparativoDinamicoComponent> = this.dialog.open(CuadroComparativoDinamicoComponent, {
      panelClass: 'dialog-no-padding',
      width: '85%',
      height: '95%',
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


  
  /**
   * Evaluated and store an evaluation of the rowspan for each row.
   * The key determines the column it affects, and the accessor determines the
   * value that should be checked for spanning.
   */
  cacheSpan(key, accessor, any) {

    for (let i = 0; i < any.length;) {
      let currentValue = accessor(any[i]);
      let count = 1;

      console.log(currentValue);
      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < any.length; j++) {        
        if (currentValue != accessor(any[j])) {
          break;
        }
        count++;
      } 

      if (!this.spans[i]) {
        this.spans[i] = {};
      }
      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  calculoPagoMensual(idCodigo: number) {
    this.trabajadorService.obtenerTrabajadorCalculoPagoMensual(idCodigo).subscribe(data => {
      const dialogReg: MatDialogRef<CalculoPagoComponent> = this.dialog.open(CalculoPagoComponent, {
        panelClass: 'dialog-no-padding',
        width: '45%',
        height: '98%',
        disableClose: true,
        data: {
          dataPagoMensualTrabajador: data.response
        }
      });
    });
  }

  // **************** REPORTE ****************
    verCalculoPagoMensual(idCodigo: number) {
      this.trabajadorService.generaCalculoPagoMensual().subscribe(response => {
        let pdf = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdf);
        window.open(url, "_blank");
      });
  }

  
  pdfCuadroComparativo(){
    this.trabajadorService.generaReporteCuadroComparativo().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
    });
  }

}
