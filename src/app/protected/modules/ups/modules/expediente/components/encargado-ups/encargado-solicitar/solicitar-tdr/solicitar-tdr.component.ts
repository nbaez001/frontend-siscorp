import { Component, OnInit, ɵConsole, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Animations } from '@shared/animations';
import { MatBottomSheet, MatDialog, MatSnackBar, PageEvent, MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';
import { Session } from '@shared/auth/Session';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import * as _moment from 'moment';
import { NumberValueAccessor } from '@angular/forms/src/directives';
import { MENSAJES, TIPO_USUARIO } from 'app/common';
import { MessageComponent } from '@shared/components/message/message.component';
import { IfStmt, debugOutputAstAsTypeScript } from '@angular/compiler';
import { Router } from '@angular/router';
import { ChatService } from 'app/protected/modules/chat/services/chat.service';
import { Socket } from 'ng-socket-io';
import { ProyectoRequest } from '../../../../dto/request/ProyectoRequest';
import { TdrRequest } from '../../../../dto/request/TdrRequest';
import { BandejaTdrResponse, WsResponseBandejaTdr } from '../../../../dto/response/BandejaTdrResponse';
import { TdrService } from '../../../../services/tdr.service';
import { WsResponseTdr } from '../../../../entities/tdr';




@Component({
  selector: 'app-solicitar-tdr',
  templateUrl: './solicitar-tdr.component.html',
  styleUrls: ['./solicitar-tdr.component.scss']
})
export class SolicitarTdrComponent implements OnInit {

  
  filtrosForm: FormGroup;

  fechaActual = new Date();

  estados: any[];
  alertas: any[];
  tdr: BandejaTdrResponse[];
  pagina = 1;
  cantidad = 15;
  total = 0;
  cantidadObservacion = 3;
  paginaObservacion = 1;

  totalObservacion = 0;
  step = 0;



  // LISTA EXCEL
  exportExcelPreliminar: string;


  filtrosTdrRequest: TdrRequest = new TdrRequest(); 


  public cidCodigo : string = " ";
  public fechaInicio : string = " ";
  public fechaFin : string = " ";


  // Tabla
  dataSource: MatTableDataSource<BandejaTdrResponse>;

  tdrResponse : BandejaTdrResponse[];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading: boolean;
  idPerfil: number; 
  codPerfil: string;
  columnas: string[] = [];
  mensaje: string;
  disableBuscar: boolean;
 
  expedienteSuscripcionEncargado : Subscription;
  idUsuarioCoordinador: number;
  dataItem: any;
  dataItemElaborado: any;
  dataItemUnidad: any;


    constructor(private formBuilder: FormBuilder,private dialog: MatDialog,
      private tdrService: TdrService,
      private router: Router) { 
      this.dataSource = new MatTableDataSource([]); 
    }


    cambiarPagina(event: PageEvent) {
        this.pagina = event.pageIndex + 1;
        this.cantidad = event.pageSize;
        this.cargarTdr();
    }

    crearFiltrosForm() {

      this.filtrosForm = new FormGroup({
        formatoCodigoFrmCtrl: new FormControl(null), 
        unidadOrganicaFrmCtrl: new FormControl(null), 
        fechaRegDesdeFrmCtrl: new FormControl(null),
        fechaRegHastaFrmCtrl: new FormControl(null)
      
      });
    }

    setStep(index: number) {
      this.step = index;
    }

    get formatoCodigoFrmCtrl() { return this.filtrosForm.get('formatoCodigoFrmCtrl'); }
    get unidadOrganicaFrmCtrl() { return this.filtrosForm.get('unidadOrganicaFrmCtrl'); }
    get fechaRegDesdeFrmCtrl() { return this.filtrosForm.get('fechaRegDesdeFrmCtrl'); }
    get fechaRegHastaFrmCtrl() { return this.filtrosForm.get('fechaRegHastaFrmCtrl'); }



    reiniciar() {
      this.filtrosForm.reset('');
      this.filtrosTdrRequest = new TdrRequest();
      this.cargarTdr();
    }
    
    public guardarFiltrosBusqueda(): void {
     
      this.filtrosTdrRequest.codDocumento = this.formatoCodigoFrmCtrl.value;
      this.filtrosTdrRequest.unidadOrganica =  this.unidadOrganicaFrmCtrl.value;
      this.filtrosTdrRequest.fechaInicio = this.fechaRegDesdeFrmCtrl.value !== null ? _moment(this.fechaRegDesdeFrmCtrl.value).format('DD-MM-YYYY'): null;
      this.filtrosTdrRequest.fechaFin = this.fechaRegHastaFrmCtrl.value !== null ?_moment(this.fechaRegHastaFrmCtrl.value).format('DD-MM-YYYY'): null;

    }

    public buscarTdr($event):void{
      $event.preventDefault();
      this.guardarFiltrosBusqueda();
      if(this.filtrosTdrRequest.codDocumento==null && this.filtrosTdrRequest.unidadOrganica == null &&
        this.filtrosTdrRequest.fechaInicio == null &&
        this.filtrosTdrRequest.fechaFin == null){
        
        this.mensaje = null;
        this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.WARNING_FILTROS, true, false, null);
        return;
      }

      else if(this.filtrosTdrRequest.codDocumento==null && this.filtrosTdrRequest.unidadOrganica == null &&
        this.filtrosTdrRequest.fechaInicio == null &&
        this.filtrosTdrRequest.fechaFin == null){
        
        this.mensaje = null;
        this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.WARNING_FILTROS, true, false, null);
        return;
      }

      else if(this.filtrosTdrRequest.codDocumento==null && this.filtrosTdrRequest.unidadOrganica == null &&
        this.filtrosTdrRequest.fechaInicio == null &&
        this.filtrosTdrRequest.fechaFin == null){
        
        this.mensaje = null;
        this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.WARNING_FILTROS, true, false, null);
        return;
      }


      else if(this.filtrosTdrRequest.codDocumento==null && this.filtrosTdrRequest.unidadOrganica == null &&
        this.filtrosTdrRequest.fechaInicio == null &&
        this.filtrosTdrRequest.fechaFin == null){
        
        this.mensaje = null;
        this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.WARNING_FILTROS, true, false, null);
        return;
      }
      this.cargarTdr();
    }

    ngOnInit() {

      this.crearFiltrosForm();
      this.generarCabeceraColumnasEncargado();
      this.cargarCodigoFormato();
      this.cargarUnidadElaborado();
      this.cargarTdr();

      
    }


    ngOnDestroy(){
      /* this.expedienteSuscripcionEncargado.unsubscribe(); */
    }




    cargarCodigoFormato() {
      this.tdrService.listarCodigoFormato().subscribe(dataItem => {
        this.dataItem= Object.assign({
          codigo: dataItem.response
        });
      });
    } 
  
    cargarUnidadElaborado() {
      this.tdrService.listarUnidad().subscribe(dataItemUnidad => {
        this.dataItemUnidad= Object.assign({
          unidadOrganica: dataItemUnidad.response
        });
      });
    } 


    nuevoTdr(){
      this.router.navigate(['/ups/expediente/registro-tdr']);
    }



    

    public cargarTablaTdr(): void {
      
      if (this.tdrResponse != null && this.tdrResponse.length > 0) {
        this.dataSource = new MatTableDataSource(this.tdrResponse);
      }
    }

    public openDialogMensaje(
      message: string,
      message2: string,
      alerta: boolean,
      confirmacion: boolean,
      valor: any
    ): void {
      const dialogRef = this.dialog.open(MessageComponent, {
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
            this.filtrosTdrRequest = null;
            this.filtrosTdrRequest = new ProyectoRequest();
            this.cargarTdr();
          }/* else{
            this.reiniciar();
            this.filtrosTdrRequest = null;
            this.filtrosTdrRequest = new ProyectoRequest();
          } */
        }
      });
    }


    public openDialogMensaje2(
      title:string,
      message: string,
      message2: string,
      alerta: boolean,
      confirmacion: boolean,
      valor: any
    ): void {
      const dialogRef = this.dialog.open(MessageComponent, {
        width: '400px',
        disableClose: true,
        data: {
          title: title,
          message: message,
          message2: message2,
          alerta: alerta,
          confirmacion: confirmacion,
          valor: valor
        }
      });
      dialogRef.afterClosed().subscribe((ok: number) => {
       

       this.cargarTdr();
          
      
      });
    }

    public openDialogMensajeConfirm(
    
      message: string,
      message2: string,
      alerta: boolean,
      confirmacion: boolean,
      valor: any
    ): void {
      
      const dialogRef = this.dialog.open(MessageComponent, {
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
      dialogRef.afterClosed().subscribe((confirm: boolean) => {
    
       
      });
    }


    public openDialogMensajeConfirmAprobacion(
    
      message: string,
      message2: string,
      alerta: boolean,
      confirmacion: boolean,
      valor: any
    ): void {
      
      const dialogRef = this.dialog.open(MessageComponent, {
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
      dialogRef.afterClosed().subscribe((confirm: boolean) => {
    
      
      });
    }


    public cargarTdr() : void{
      this.dataSource = null;
      this.disableBuscar = true;
      this.isLoading = true;
      this.tdrService.tdrFiltros(this.pagina,this.cantidad, this.filtrosTdrRequest)

      .subscribe(
        (wsResponseBandejaTdr : WsResponseBandejaTdr)=> {
          
          if(wsResponseBandejaTdr.codResultado == 1){
            this.tdrResponse = (wsResponseBandejaTdr.response != null) ? wsResponseBandejaTdr.response : [];
            this.total = (wsResponseBandejaTdr.total!=0)? wsResponseBandejaTdr.total: 0;
            this.cargarTablaTdr();
          }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            //this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);   
          }
          this.isLoading = false;
          this.disableBuscar = false;
        },
        error => {
          this.isLoading = false;
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);
          console.error(error);
          this.disableBuscar = false;
        }    
      ); 
    }



    generarCabeceraColumnasEncargado(): void{
      this.columnas = [
        'Nro','codigoFormato','unidadOrigen','fechaRegistro','acciones'];   
    }



    editarTdr(idCodigoTdr: number, idProyecto: number): void {
      
      let idCodigoTdrEncriptado = btoa(idCodigoTdr+"");
      let idProyectoEncriptado = btoa(idProyecto+"");
      this.router.navigate(['/ups/expediente/registro-tdr', { id: idCodigoTdrEncriptado, idProy: idProyectoEncriptado}]);

    } 





    verTdr(idCodigoTdr: number): void{
      this.tdrService.visualizarTdr(idCodigoTdr).subscribe(response => {

      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);

      window.open(url, "_blank");
      
      
      });
     



    }






}
