import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Autorizacion, WsResponseAutorizacion } from '../../../../dto/response/Autorizacion';
import { ItemBean } from '../../../../dto/response/ItemBean';
import { MatTableDataSource, MatPaginator, MatDialog, PageEvent, MatDialogRef, MatSnackBar } from '@angular/material';
import { ItemComboService } from '../../../../service/item-combo.service';
import { ProyectoEjecucionService } from '../../../../service/proyecto-ejecucion.service';
import { CustomIconService } from 'app/protected/modules/ups/modules/expediente/services/custom-icon.service';
import { Router } from '@angular/router';
import { MENSAJES } from 'app/common';
import { RegistrarComponent } from './registrar/registrar.component';
import { filter } from 'rxjs/operators';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { InformeTecnicoComponent } from './informe-tecnico/informe-tecnico.component';
import { TrabajadorService } from '../../../../service/trabajador.service';
import { AuthService } from 'app/protected/services/auth.service';

@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styleUrls: ['./autorizacion.component.scss']
})
export class AutorizacionComponent implements OnInit {

  autorizacionFiltroForm: FormGroup;

  fechaActual = new Date();

  estados: any[];
  alertas: any[];
  autorizacion: Autorizacion[];
  pagina = 1;
  cantidad = 15;
  total = 0;
  cantidadObservacion = 3;
  paginaObservacion = 1;

  totalObservacion = 0;

  // LISTA EXCEL
  exportExcelPreliminar: string;
  dataItemEstado: ItemBean;


  public cidCodigo : string = " ";
  public fechaInicio : string = " ";
  public fechaFin : string = " ";


  // Tabla
  dataSource: MatTableDataSource<Autorizacion>;
  wsResponseAutorizacion : WsResponseAutorizacion;
  autorizacionResponse : Autorizacion[];
  objproyectoResponse : Autorizacion;

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
      private proyectoEjecucionService: ProyectoEjecucionService,
      private trabajadorService: TrabajadorService,
      private customIconService: CustomIconService,
      private snackBar: MatSnackBar,
      private router: Router,
      private authService: AuthService) 
      { 
        this.tituloAutorizacionGasto();
      this.dataSource = new MatTableDataSource([]);
       
      }

    ngOnInit() {
      this.customIconService.cargaIcono();
      this.crearFiltrosForm();
      this.columnasAutorizacion();
      this.cargarDataEstado();
      this.cargarListaAutorizaciones();

      //this.expedienteSuscripcionEncargado = this.socket.fromEvent('expedienteCoordinador').subscribe(() => this.cargarPerfilPrefactibilidad());
      
    }


    
  tituloAutorizacionGasto() {
    this.authService.cabecera.next({
      titulo: MENSAJES.AUTORIZACION.TITLE_AUTORIZACION,
      icono: ''
    });
  }

  ngOnDestroy() {
    this.authService.cabecera.next({
      titulo: '',
      icono: ''
    });
  }

    columnasAutorizacion(): void{
      this.columnas = [
        'Nro','codigoAutorizacion','fechaPresentacion','fechaAprobacion','montoSolicitado',
        'montoAutorizado','saldoDisponible','estado','plazo','acciones']; 
    }

    cambiarPagina(event: PageEvent) {

        this.pagina = event.pageIndex + 1;
        this.cantidad = event.pageSize;
        this.cargarListaAutorizaciones();
    }

    crearFiltrosForm() {
      this.autorizacionFiltroForm = new FormGroup({
        fechaPresentacionFrmCtrl: new FormControl(null), 
        fechaAprobacionFrmCtrl: new FormControl(null),
        estadoFrmCtrl: new FormControl(null)
      });
    }

    get fechaPresentacionFrmCtrl() { return this.autorizacionFiltroForm.get('fechaPresentacionFrmCtrl'); }
    get fechaAprobacionFrmCtrl(){ return this.autorizacionFiltroForm.get('fechaAprobacionFrmCtrl');}
    get estadoFrmCtrl() { return this.autorizacionFiltroForm.get('estadoFrmCtrl'); }


   
    reiniciar() {
      this.autorizacionFiltroForm.reset('');
      //this.filtrosProyectoRequest = new ProyectoRequest();
      this.cargarListaAutorizaciones();
    }
    

    /* ngOnDestroy(){
      this.expedienteSuscripcionEncargado.unsubscribe();
    } */

    cargarDataEstado() {
      this.itemComboService.ObtenerEstadoAutorizacion().subscribe(dataItem => {
        this.dataItemEstado = Object.assign({
          estados: dataItem.response
        });
      }); 
    } 

    public cargarTablaAutorizaciones(): void {
      if (this.autorizacionResponse != null && this.autorizacionResponse.length > 0) {
        this.dataSource = new MatTableDataSource(this.autorizacionResponse);
      }
    }

   

    public cargarListaAutorizaciones() : void{

      this.dataSource = null;
      this.disableBuscar = true;
      this.autorizacionResponse = [];
     
      this.proyectoEjecucionService.autorizacionFiltros(this.pagina,this.cantidad,null)
      .subscribe(
        (wsResponseAutorizacion : WsResponseAutorizacion)=> {
           
          if(wsResponseAutorizacion.codResultado == 1){
            this.autorizacionResponse = (wsResponseAutorizacion.response != null) ? wsResponseAutorizacion.response : [];
            this.total = (wsResponseAutorizacion.total!=0)? wsResponseAutorizacion.total : 0;
            this.cargarTablaAutorizaciones();
          }else{
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



    descargarExcel($event){
      //$event.stopPropagation();
      $event.preventDefault();
      this.proyectoEjecucionService.generarExcelProyectoEjecucion(this.pagina, this.cantidad,null);
     
    }
        

  verCronograma(idProyecto: number): void{
    let idProyectoEncriptado = btoa(idProyecto+""); 
    this.router.navigate(['/ups/autorizacion/cronograma-valorizado', {idProy: idProyectoEncriptado}]);
  }


  agregarAutorizacion(){
      const dialogReg: MatDialogRef<RegistrarComponent> = this.dialog.open(RegistrarComponent, {
        panelClass: 'dialog-no-padding',
        width: '85%', 
        height: '95%',
        disableClose: true,
        data: {}
        }); 
      dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {           
            
      });
  }

  buscarAutorizacion($event){

  }

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
  }



  eliminarAutorizacion(autoView: Autorizacion){
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
  }




  
  public openDialogMensajeConfirm(message: string,confirmacion: boolean): void {

    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: {message: message, confirmacion: confirmacion}
    });
  }


  public openDialogMensaje(message: string, alerta: boolean): void {

    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: {message: message, alerta: alerta}
    });
  }


  generaReporteAutorizacionGasto() {
    this.trabajadorService.generaReporteAutorizacionGasto().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
    });
  }


  
  verAutorizacion(idProyecto: number): void{
    this.trabajadorService.generaReporteAutorizacionGasto().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
    });
  }


}