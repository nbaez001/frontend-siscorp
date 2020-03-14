import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PrefijoEstado } from 'app/protected/modules/tickets-intervenciones/entities/prefijo-estado';
import { ProyectoRequest } from '../../../expediente/dto/request/ProyectoRequest';
import { ParametroRequest } from '../../../expediente/dto/request/ParametroRequest';
import { MatTableDataSource, MatPaginator, MatDialog, PageEvent, MatDialogRef } from '@angular/material';
import { Observacion } from '../../../expediente/entities/observacion';
import { EquipoResponse } from '../../../expediente/dto/response/EquipoResponse';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MENSAJES } from 'app/common';
import * as _moment from 'moment';
import { JefeElaboradorArchivoComponent } from '../../../expediente/components/jefe-elaborador/jefe-elaborador-archivo/jefe-elaborador-archivo.component';
import { ItemComboService } from '../../service/item-combo.service';
import { ProyectoEjecucionService } from '../../service/proyecto-ejecucion.service';
import { WsResponseProyecto, Proyecto } from '../../dto/response/Proyecto';
import { ItemBean } from '../../dto/response/ItemBean';
import { CustomIconService } from '../../../expediente/services/custom-icon.service';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { AuthService } from 'app/protected/services/auth.service';
import { ProyectoVisualizarCgpComponent } from './proyecto-visualizar/proyecto-visualizar.component';




@Component({
  selector: 'app-coordinador-cgp',
  templateUrl: './coordinador-cgp.component.html',
  styleUrls: ['./coordinador-cgp.component.scss']
})
export class CoordinadorCgpComponent implements OnInit {


  filtrosForm: FormGroup;

  fechaActual = new Date();

  estados: any[];
  alertas: any[];
  proyectos: Proyecto[];
  pagina = 1;
  cantidad = 2;
  total = 0;
  cantidadObservacion = 3;
  paginaObservacion = 1;

  totalObservacion = 0;

  prefijoEstado = PrefijoEstado;

  // LISTA EXCEL
  exportExcelPreliminar: string;

  dataItemEstado: ItemBean;
  dataItemAlerta: ItemBean;

  filtrosProyectoRequest: ProyectoRequest = new ProyectoRequest(); 
  asignarDerivarRequest: ParametroRequest;
  parametroRequest :ParametroRequest;

  public cidCodigo : string = " ";
  public fechaInicio : string = " ";
  public fechaFin : string = " ";


  // Tabla
  dataSource: MatTableDataSource<Proyecto>;
  wsResponseProyecto : WsResponseProyecto;
  proyectoResponse : Proyecto[];
  objproyectoResponse : Proyecto;
  observacionResponse : Observacion[];
  equipoElaborador: EquipoResponse[];
  equipoRevisor: EquipoResponse[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoading: boolean;
  idPerfil: number; 
  codPerfil: string;
  columnas: string[] = [];
  mensaje: string;
  disableBuscar: boolean;
  datos:Proyecto;
  expedienteSuscripcionEncargado : Subscription;
  idUsuarioCoordinador: number;
  
    constructor(private formBuilder: FormBuilder,
      private dialog: MatDialog,
      private itemComboService: ItemComboService,
      private proyectoEjecucionService: ProyectoEjecucionService,
      private customIconService: CustomIconService,
      private router: Router,
      private authService: AuthService) 
      { 
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
        codDocFrmCtrl: new FormControl(null), 
        codigoFrmCtrl: new FormControl(null), 
        desProyectoFrmCtrl: new FormControl(null),
        fechaRegDesdeFrmCtrl: new FormControl(null),
        fechaRegHastaFrmCtrl: new FormControl(null),
        estadoFrmCtrl: new FormControl(null)
      });
    }

    get codDocFrmCtrl() { return this.filtrosForm.get('codDocFrmCtrl'); }
    get codigoFrmCtrl() { return this.filtrosForm.get('codigoFrmCtrl'); }
    get desProyectoFrmCtrl(){ return this.filtrosForm.get('desProyectoFrmCtrl');}
    get fechaRegDesdeFrmCtrl() { return this.filtrosForm.get('fechaRegDesdeFrmCtrl'); }
    get fechaRegHastaFrmCtrl() { return this.filtrosForm.get('fechaRegHastaFrmCtrl'); }
    get estadoFrmCtrl() { return this.filtrosForm.get('estadoFrmCtrl'); }


   
    reiniciar() {
      this.filtrosForm.reset('');
      this.filtrosProyectoRequest = new ProyectoRequest();
      this.cargarPerfilPrefactibilidad();
    }
    
    public guardarFiltrosBusqueda(): void {
      //this.filtrosProyectoRequest =  new ProyectoRequest();
      this.filtrosProyectoRequest.codDocumento = this.codDocFrmCtrl.value;
      this.filtrosProyectoRequest.fechaInicio = this.fechaRegDesdeFrmCtrl.value !== null ? _moment(this.fechaRegDesdeFrmCtrl.value).format('DD-MM-YYYY'): null;
      this.filtrosProyectoRequest.fechaFin = this.fechaRegHastaFrmCtrl.value !== null ?_moment(this.fechaRegHastaFrmCtrl.value).format('DD-MM-YYYY'): null;
      this.filtrosProyectoRequest.idEstado = this.estadoFrmCtrl.value;  
    }

    public buscarPerfilPrefactibilidad($event):void{
      $event.preventDefault();
      this.guardarFiltrosBusqueda();
      if(this.filtrosProyectoRequest.codDocumento==null &&
        this.filtrosProyectoRequest.fechaInicio == null &&
        this.filtrosProyectoRequest.fechaFin == null &&
        this.filtrosProyectoRequest.idAlerta == null &&
        this.filtrosProyectoRequest.idEstado == null){
        
        this.mensaje = null;
        this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.WARNING_FILTROS, true, false, null);
        return;
      }

      else if(this.filtrosProyectoRequest.codDocumento==null &&
        this.filtrosProyectoRequest.fechaInicio == null &&
        this.filtrosProyectoRequest.fechaFin == null &&
        this.filtrosProyectoRequest.idAlerta == -1 &&
        this.filtrosProyectoRequest.idEstado == -1){
        
        this.mensaje = null;
        this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.WARNING_FILTROS, true, false, null);
        return;
      }

      else if(this.filtrosProyectoRequest.codDocumento==null &&
        this.filtrosProyectoRequest.fechaInicio == null &&
        this.filtrosProyectoRequest.fechaFin == null &&
        this.filtrosProyectoRequest.idAlerta == null &&
        this.filtrosProyectoRequest.idEstado == -1){
        
        this.mensaje = null;
        this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.WARNING_FILTROS, true, false, null);
        return;
      }

      else if(this.filtrosProyectoRequest.codDocumento==null &&
        this.filtrosProyectoRequest.fechaInicio == null &&
        this.filtrosProyectoRequest.fechaFin == null &&
        this.filtrosProyectoRequest.idAlerta == -1 &&
        this.filtrosProyectoRequest.idEstado == null){
        
        this.mensaje = null;
        this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.WARNING_FILTROS, true, false, null);
        return;
      }
      this.cargarPerfilPrefactibilidad();
    }

    /* ngOnDestroy(){
      this.expedienteSuscripcionEncargado.unsubscribe();
    } */

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

    public openDialogMensaje(
      message: string,
      message2: string,
      alerta: boolean,
      confirmacion: boolean,
      valor: any
    ): void {
      const dialogRef = this.dialog.open(InfoMessageComponent, {
        width: '400px',
        disableClose: true,
        data: {
          title: MENSAJES.PREFACTIBILIDAD.TITLE,
          message: message,
          message2: message2,
          alerta: alerta,
          confirmacion: confirmacion,
          valor: valor
        }
      });
      dialogRef.afterClosed().subscribe((ok: number) => {    
        if (ok == 0) { 
          if(valor == "1"){
            this.reiniciar();
            this.filtrosProyectoRequest = null;
            this.filtrosProyectoRequest = new ProyectoRequest();
            this.cargarPerfilPrefactibilidad();
          }
        }
      });
    }

    public cargarPerfilPrefactibilidad() : void{
      this.dataSource = null;
      this.disableBuscar = true;
      this.proyectoResponse = [];
      this.isLoading = true;
      if(this.filtrosProyectoRequest.idAlerta == -1){
        this.filtrosProyectoRequest.idAlerta = null;
      }else if(this.filtrosProyectoRequest.idEstado == -1){
        this.filtrosProyectoRequest.idEstado = null;
      }
      this.proyectoEjecucionService.proyectoEjecucionFiltros(this.pagina,this.cantidad,null)
      .subscribe(
        (wsResponseProyecto : WsResponseProyecto)=> {
           
          if(wsResponseProyecto.codResultado == 1){
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            this.total = (wsResponseProyecto.total!=0)? wsResponseProyecto.total : 0;
            this.cargarTablaPrefactibilidad();
          }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            //this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);     
          }
          this.isLoading = false;
          this.disableBuscar = false;
        },
        error => {
       /*    this.isLoading = false;
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null); */
          console.error(error);
         /*  this.disableBuscar = false; */
        }   
      ); 
    }

    generarCabeceraColumnasEncargado(): void{

    /*     this.columnas = [
          'item','nroCodigo','nroConvenio','tambo','inicioObra','planEjecucion','terminoObra', 'plazoEjecucionReal',
          'ultimaActualizacion','avanceFisico','avanceFinanciero','estado','prestandoServicio','acciones'];  */
            
        this.columnas = [
            'item','tambo','inicioObra','planEjecucion','terminoObra', 'plazoEjecucionReal',
            'ultimaActualizacion','avanceFisico','avanceFinanciero','estado','prestandoServicio','acciones'];      
    }

    descargarExcel($event){
      //$event.stopPropagation();
      $event.preventDefault();
      this.proyectoEjecucionService.generarExcelProyectoEjecucion(this.pagina, this.cantidad,this.filtrosProyectoRequest);
     
  }
          
  cargarArchivo(idProyecto: number, fidProyecto: number): void {
    this.objproyectoResponse = null;
    const dialogReg: MatDialogRef<JefeElaboradorArchivoComponent> = this.dialog.open(JefeElaboradorArchivoComponent, {
      panelClass: 'dialog-no-padding',
      width: '1200px',
      data: {
        idProyecto,
        fidProyecto
      },
      disableClose: true
    } );
  }

  verCronograma(idProyecto: number): void{
    let idProyectoEncriptado = btoa(idProyecto+""); 
    this.router.navigate(['/ups/autorizacion/cronograma-valorizado', {idProy: idProyectoEncriptado}]);
   
  }

  verAutorizaciones(idProyecto: number): void{
    let idProyectoEncriptado = btoa(idProyecto+""); 
    this.router.navigate(['/ups/autorizacion/autorizacion', {idProy: idProyectoEncriptado}]);
  }

  bandejaTrabajador(idProyecto: number): void{
    let idProyectoEncriptado = btoa(idProyecto+""); 
    this.router.navigate(['/ups/autorizacion/bandeja-trabajador', {idProy: idProyectoEncriptado}]);
  }

  bandejaProveedor(idProyecto: number): void{
    let idProyectoEncriptado = btoa(idProyecto+""); 
    this.router.navigate(['/ups/autorizacion/bandeja-proveedor', {idProy: idProyectoEncriptado}]);
  }

  getRecord(row){
    console.log(row);
    let proyectoEncriptado = btoa(row+""); 
    this.router.navigate(['/ups/autorizacion/datos-generales', {proyectoData: proyectoEncriptado}]);
   
  }


  verProyecto(idProyecto: number): void{
    const dialogReg: MatDialogRef<ProyectoVisualizarCgpComponent> = this.dialog.open(ProyectoVisualizarCgpComponent, {
      panelClass: 'dialog-no-padding',
      width: '1000px',
      data: {
        idProyecto
      },
      disableClose: true
    } );

  }
  verCotizaciones(idProyecto: number): void{
    let idProyectoEncriptado = btoa(idProyecto+""); 
    this.router.navigate(['/ups/autorizacion/requerimiento', {idProy: idProyectoEncriptado}]);
  }



}

