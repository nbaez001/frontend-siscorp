import { Component, OnInit, ɵConsole, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Animations } from '@shared/animations';
import { Proyecto} from '../../entities/proyecto';
import { PrefijoEstado } from '../../entities/prefijo-estado';
import { MatBottomSheet, MatDialog, MatSnackBar, PageEvent, MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { SharedService } from '../../services/shared.service';
import { EncargadoService } from '../../services/encargado.service';
import { ItemComboService } from '../../services/item-combo.service';
//import { DataFormProyecto } from "../../entities/DataFormProyecto";
import { Session } from '@shared/auth/Session';
import { ProyectoService } from '../../services/proyecto.service';
import { ProyectoRequest } from '../../dto/request/ProyectoRequest';
import { ProyectoResponse, WsResponseProyecto } from '../../dto/response/ProyectoResponse';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { ItemBean } from '../../dto/response/ItemBean';
import * as _moment from 'moment';
import { NumberValueAccessor } from '@angular/forms/src/directives';
import { MENSAJES, TIPO_USUARIO } from 'app/common';
import { MessageComponent } from '@shared/components/message/message.component';
import { ExcelDownloadResponse } from '../../entities/ExcelDownloadResponse';
import { ParametroRequest } from '../../dto/request/ParametroRequest';
import { WsApiOutResponse } from '../../dto/response/WsApiOutResponse';
import { VisualizarComponent } from '../jefe-ups/visualizar/visualizar.component';
import { ObservacionComponent } from '../jefe-ups/observacion/observacion.component';
import { WsResponseObservacion, Observacion } from '../../entities/observacion';
import { IfStmt } from '@angular/compiler';
import { CoordinadorAsignarComponent } from '../coordinador-ups/coordinador-asignar/coordinador-asignar.component';
import { SolicitarEvaluacionComponent } from '../encargado-ups/encargado-solicitar/solicitar-evaluacion/solicitar-evaluacion.component';
import { CoordinadorDetalleComponent } from './coordinador-detalle/coordinador-detalle.component';
import { CoordinadorAprobarComponent } from './coordinador-aprobar/coordinador-aprobar.component';
import { Socket } from 'ng-socket-io';
import { ChatService } from 'app/protected/modules/chat/services/chat.service';
import { ObservarDevueltoComponent } from './observar-devuelto/observar-devuelto.component';



@Component({
  selector: 'app-coordinador',
  templateUrl: './coordinador.component.html',
  styleUrls: ['./coordinador.component.scss'],
  animations: Animations
})
export class CoordinadorComponent implements OnInit {

  filtrosForm: FormGroup;

  fechaActual = new Date();

  estados: any[];
  alertas: any[];
  proyectos: Proyecto[];
  pagina = 1;
  cantidad = 15;
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

  parameterRequest: ParametroRequest;

  parametroRequest :ParametroRequest;

  public cidCodigo : string = " ";
  public fechaInicio : string = " ";
  public fechaFin : string = " ";


  // Tabla
  dataSource: MatTableDataSource<ProyectoResponse>;
  wsResponseProyecto : WsResponseProyecto;

  proyectoResponse : ProyectoResponse[];

  objproyectoResponse : ProyectoResponse;

  observacionResponse : Observacion[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading: boolean;

  idPerfil: number; 
  codPerfil: string;
  columnas: string[] = [];

  mensaje: string;
  disableBuscar: boolean;

  
  datos:Proyecto;
 
  columnaAusenciaNoMostrar: string = "mostrar";

  expedienteSuscripcionCoordinador: Subscription;
  //expedienteSuscripcionEncargadoDevolver : Subscription;
  
  idUsuarioEncargado: number;
  idUsuarioJefe: number;

  
    constructor(private formBuilder: FormBuilder,private dialog: MatDialog,
      private itemComboService: ItemComboService,
      private proyectoService: ProyectoService,
      private chatService: ChatService,
      private socket: Socket,
      private data: SharedService,) { 
    //this.idPerfil = Session.identity.id_perfil;
    //this.codPerfil = Session.identity.codPerfil;
      this.dataSource = new MatTableDataSource([]);
       
    }



    cambiarPagina(event: PageEvent) {
        this.pagina = event.pageIndex + 1;
        this.cantidad = event.pageSize;
        this.cargarPerfilPrefactibilidad();
    }

    crearFiltrosForm() {

      this.filtrosForm = new FormGroup({
        codDocFrmCtrl: new FormControl(null), 
        fechaRegDesdeFrmCtrl: new FormControl(null),
        fechaRegHastaFrmCtrl: new FormControl(null),
        alertaFrmCtrl: new FormControl(null),
        estadoFrmCtrl: new FormControl(null)
      });
    }

    get codDocFrmCtrl() { return this.filtrosForm.get('codDocFrmCtrl'); }
    get fechaRegDesdeFrmCtrl() { return this.filtrosForm.get('fechaRegDesdeFrmCtrl'); }
    get fechaRegHastaFrmCtrl() { return this.filtrosForm.get('fechaRegHastaFrmCtrl'); }
    get alertaFrmCtrl() { return this.filtrosForm.get('alertaFrmCtrl'); }
    get estadoFrmCtrl() { return this.filtrosForm.get('estadoFrmCtrl'); }

/*
    public limpiarControl($event: Event, tipo: string, codigo: string) {
      this.filtrosForm.get(tipo).setValue(null);
      this[codigo] = null;
    }
*/

obtenerIdUsuario(){
  
  this.proyectoService.obtenerUsuarioPorTipoUsuario(TIPO_USUARIO.ENCARGADO_EXPEDIENTE).subscribe(response =>{
    if(response){
     this.idUsuarioEncargado = response;
    }
  });
}

obtenerIdUsuarioJefe(){
  
  this.proyectoService.obtenerUsuarioPorTipoUsuario(TIPO_USUARIO.JEFE_UPS).subscribe(response =>{
    if(response){
     this.idUsuarioJefe = response;
    }
  });
}



observarProyectoCoordinador(idProyecto: number, cidEstado: string, codigoProyecto: string) : void {
  this.parametroRequest = new ParametroRequest();
  this.parametroRequest.idProyecto = idProyecto;//codigo;

  this.proyectoService.listarObservacionesProyecto(this.paginaObservacion,this.cantidadObservacion,this.parametroRequest)
  .subscribe(
    (wsResponseProyecto : WsResponseObservacion)=> {

      
      if(wsResponseProyecto.codResultado == 1){
        this.observacionResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
        this.totalObservacion = (wsResponseProyecto.total!=0)? wsResponseProyecto.total : 0;
        const dialogReg: MatDialogRef<ObservacionComponent> = this.dialog.open(ObservacionComponent, {
          panelClass: 'dialog-no-padding',
          width: '800px',
          data: {
            idProyecto,
            cidEstado,
            codigoProyecto,
            observacionArray: this.observacionResponse,
            total: this.totalObservacion
          }
        }); 
        dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {           
          console.log(parametroRequestDialog);
          if(typeof parametroRequestDialog  === 'undefined' || parametroRequestDialog === null ){
           
          }else{
            if(parametroRequestDialog.valorDevolver == 1){
              this.devolverDesdeBandejaCoordinador(this.parametroRequest);

              this.proyectoService.obtenerTokenUsuarioEnviarSocket(Session.identity.id_usuario, "");

  
            
            }
          }
        });
    

      }else{
       
        this.observacionResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
        this.totalObservacion = (wsResponseProyecto.total!=0)? wsResponseProyecto.total : 0;
        const dialogReg: MatDialogRef<ObservacionComponent> = this.dialog.open(ObservacionComponent, {
          panelClass: 'dialog-no-padding',
          width: '800px',
          data: {
            idProyecto,
            cidEstado,
            codigoProyecto,
            observacionArray: this.observacionResponse,
            total: this.totalObservacion
          }
        }); 
        dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {           
          
          console.log(parametroRequestDialog);
          if(typeof parametroRequestDialog  === 'undefined' || parametroRequestDialog === null ){
           
          }else{
            if(parametroRequestDialog.valorDevolver == 1){
              this.devolverDesdeBandejaCoordinador(this.parametroRequest);
              this.proyectoService.obtenerTokenUsuarioEnviarSocket(Session.identity.id_usuario, "");
            }
          }
        });


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


observarProyectoDevolverAEncargado(idProyecto: number, cidEstado: string, codigoProyecto: string) : void {
  this.parametroRequest = new ParametroRequest();
  this.parametroRequest.idProyecto = idProyecto;//codigo;

  this.proyectoService.listarObservacionesProyecto(this.paginaObservacion,this.cantidadObservacion,this.parametroRequest)
  .subscribe(
    (wsResponseProyecto : WsResponseObservacion)=> {

      
      if(wsResponseProyecto.codResultado == 1){
        this.observacionResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
        this.totalObservacion = (wsResponseProyecto.total!=0)? wsResponseProyecto.total : 0;
        const dialogReg: MatDialogRef<ObservarDevueltoComponent> = this.dialog.open(ObservarDevueltoComponent, {
          panelClass: 'dialog-no-padding',
          width: '800px',
          data: {
            idProyecto,
            cidEstado,
            codigoProyecto,
            observacionArray: this.observacionResponse,
            total: this.totalObservacion
          }
        }); 
        dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {           
          console.log(parametroRequestDialog);
          if(typeof parametroRequestDialog  === 'undefined' || parametroRequestDialog === null ){
           
          }else{
            if(parametroRequestDialog.valorDevolver == 1){
              this.observarProyectoDevolverAEncargadoOk(this.parametroRequest);  
            }
          }
        });
    

      }
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


observarProyectoDevolverAEncargadoOk(parametroRequest: ParametroRequest){
  
  this.proyectoService.enviarRechazoCoordinadorAEncargado(parametroRequest)
  .subscribe(
    (wsApiOutResponse : WsApiOutResponse)=> {
      if(wsApiOutResponse.codResultado == 1){
        this.proyectoResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
        this.total = (wsApiOutResponse.total!=0)? wsApiOutResponse.total : 0;
        this.cargarPerfilPrefactibilidad();
        this.proyectoService.obternerToken(this.idUsuarioEncargado).subscribe(response =>{
          if(response){              
            response.forEach(element =>{               
              this.chatService.enviarCidSocketChannel(element.cidsocket, 'expedienteCoordinador');
            })
           
          }
        });
      }else{
        this.mensaje = MENSAJES.ERROR_NOFUNCION;
        this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, null);
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


    reiniciar() {
      this.filtrosForm.reset('');
      this.filtrosProyectoRequest = new ProyectoRequest();
      this.cargarPerfilPrefactibilidad();
    }
    
    public guardarFiltrosBusqueda(): void {
      //this.filtrosProyectoRequest =  new ProyectoRequest();
      this.filtrosProyectoRequest.codDocumento = this.codDocFrmCtrl.value;
      this.filtrosProyectoRequest.fechaInicio = this.fechaRegDesdeFrmCtrl.value !== null ? _moment(this.fechaRegDesdeFrmCtrl.value).format('DD-MM-YYYY'): null;
      this.filtrosProyectoRequest.fechaFin = this.fechaRegHastaFrmCtrl.value !== null ?_moment(this.fechaRegHastaFrmCtrl.value).format('DD-MM-YYYY'): null;;
      this.filtrosProyectoRequest.idAlerta = this.alertaFrmCtrl.value;
      this.filtrosProyectoRequest.idEstado = this.estadoFrmCtrl.value;  
    }

    show = true;
    mostrarOcultarColumnas($event):void{
      this.show = !this.show;

      if(this.show == false){
        this.columnas =[
          'Nro','fechaAsignada','fechaRecepcionProyecto','codProyecto','modalidadEjecucion','acciones'];
      }else{
        this.columnas =[
          'Nro','fechaAsignada','fechaRecepcionProyecto','codProyecto','modalidadEjecucion',
          'encargadoAsignado', 'fechaAsignadaEncargado','estado','plazo','acciones'];
      }
   
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


/*  
    public addSolicitud($event): void {
      $event.preventDefault();
  
      if (this.codSolicitudFrmCtrl.invalid) {
        this.codSolicitudFrmCtrl.markAsTouched();
        return;
      }
  
      const codigoIngresado = this.codSolicitudFrmCtrl.value;
      let agregado = false;
  
      this.listaSeleccionados.forEach((evaluacion: ListaEvaluaciones) => {
        if (evaluacion.codSolEvaluacion === codigoIngresado || evaluacion.numeroSolEvaluacion === codigoIngresado) {
          agregado = true;
          return;
        }
      });
  
      if (agregado) {
        this.codSolicitudFrmCtrl.setValue(null);
        this.openDialogMensaje('Evaluación ya se encuentra en la lista: ', null, true, false, codigoIngresado);
        return;
      }
  
      this.busquedaXCodigo();
    }
   */

    ngOnInit() {
      this.crearFiltrosForm();
      this.generarCabeceraColumnasCoordinador();
      this.cargarDataEstado(Number(this.idPerfil));
      this.cargarDataAlerta();
      this.cargarPerfilPrefactibilidad();
      this.obtenerIdUsuario();
      this.obtenerIdUsuarioJefe();
      this.expedienteSuscripcionCoordinador = this.socket.fromEvent('expediente').subscribe(() => this.cargarPerfilPrefactibilidad());
    }


    ngOnDestroy(){
      this.expedienteSuscripcionCoordinador.unsubscribe();
    }

    cargarDataEstado(codPerfil:number) {
      this.itemComboService.ObtenerItemEstado(codPerfil).subscribe(dataItem => {
        this.dataItemEstado = Object.assign({
          estados: dataItem.response
        });
      });
    } 

    cargarDataAlerta() {
      this.itemComboService.ObtenerItemAlerta().subscribe(dataItem => {
        this.dataItemAlerta = Object.assign({
          alertas: dataItem.response
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
            this.filtrosProyectoRequest = null;
            this.filtrosProyectoRequest = new ProyectoRequest();
            this.cargarPerfilPrefactibilidad();
          }/*else{
            this.reiniciar();
            this.filtrosProyectoRequest = null;
            this.filtrosProyectoRequest = new ProyectoRequest();
        }*/
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
    
        if (confirm) {        
          this.derivarEncargadoOk();
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
      

      this.proyectoService.proyectoFiltros(this.pagina,this.cantidad, this.filtrosProyectoRequest)
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
          this.isLoading = false;
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);
          console.error(error);
          this.disableBuscar = false;
        }
      
      ); 

    }

    /*
    descargarExcel() {
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      this.pagina = 0;
      this.cantidad = 0;
      this.guardarFiltrosBusqueda();
      a.href = this.proyectoService.generarExcel(this.pagina,this.cantidad, this.filtrosProyectoRequest);
      a.click();
    }*/



    descargarExcel($event){
      //$event.stopPropagation();
      $event.preventDefault();
      this.proyectoService.generarExcelBandejaPrefactibilidad(this.pagina, this.cantidad,this.filtrosProyectoRequest);
     
    }

    derivarEncargado(idProyecto : number, codigo: string) : void{

      this.parameterRequest = new ParametroRequest();
      this.parameterRequest.idProyecto = idProyecto;
      this.parameterRequest.ip = "127.0.0.1";
      this.openDialogMensajeConfirm(null,  MENSAJES.PREFACTIBILIDAD_COORDINADOR.DERIVAR_ENCARGADO_CONFIRM + ' ' + codigo + '?',false, true, null);

    }


    derivarEncargadoOk(){

      this.proyectoService.derivarEncargadoDeBandejaCoordinador(this.parameterRequest)
      .subscribe(
        (wsApiOutResponse : WsApiOutResponse)=> {
          if(wsApiOutResponse.codResultado == 1){
            this.proyectoResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
            this.total = (wsApiOutResponse.total!=0)? wsApiOutResponse.total : 0;
            this.cargarPerfilPrefactibilidad();


            /* this.proyectoService.obternerToken(this.idUsuarioEncargado).subscribe(response =>{

              if(response){              
                response.forEach(element =>{               
                  this.chatService.enviarCidSocketChannel(element.cidsocket, 'expedienteCoordinador');
                })
               
              }
            }); */

            this.obtenerTokenUsuarioEnviarSocket(Session.identity.id_usuario, "");
            this.obtenerTokenUsuarioEnviarSocket(this.idUsuarioEncargado, "expedienteCoordinador");


          }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, null);
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

    AprobarExpediente(idMovimientoProyecto : number, cidEstado : string) : void{
      this.parameterRequest = new ParametroRequest();
      this.parameterRequest.idProyecto = idMovimientoProyecto;
      this.parameterRequest.ip = "127.0.0.1";

     // this.objproyectoResponse = null;


    /*   this.proyectoService.visualizarProyectoCoordinador(this.parameterRequest)
      .subscribe(
        (wsResponseProyecto : WsResponseProyecto)=> {
          
          if(wsResponseProyecto.codResultado == 1){
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
             */
            const dialogReg: MatDialogRef<CoordinadorAprobarComponent> = this.dialog.open(CoordinadorAprobarComponent, {
              panelClass: 'dialog-no-padding',
              width: '800px', height: '700px',
              data: {
                idMovimientoProyecto,
                cidEstado,
                parameterRequest: this.parameterRequest
              }
            }); 
             dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {           
                    
              if(parametroRequestDialog.valorDevolver == 'ENVIAR_APROBACION_AL_JEFE'){
                  this.cargarPerfilPrefactibilidad(); 
                  this.proyectoService.obternerToken(this.idUsuarioJefe).subscribe(response =>{
                    if(response){              
                      response.forEach(element =>{               
                        this.chatService.enviarCidSocketChannel(element.cidsocket, 'expedienteJefe');
                      })
                     
                    }
                  });
                  
              }
        
            }); 
          /* }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);
      
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
      
      );  */
    }


    
    AprobarExpedienteOk(idMovimientoProyecto : number, cidEstado : string) : void{
      this.parameterRequest = new ParametroRequest();
      this.parameterRequest.idProyecto = idMovimientoProyecto;
      this.parameterRequest.ip = "127.0.0.1";

      this.objproyectoResponse = null;


      this.proyectoService.visualizarProyectoCoordinador(this.parameterRequest)
      .subscribe(
        (wsResponseProyecto : WsResponseProyecto)=> {
          
          if(wsResponseProyecto.codResultado == 1){
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];    
            const dialogReg: MatDialogRef<CoordinadorAprobarComponent> = this.dialog.open(CoordinadorAprobarComponent, {
              panelClass: 'dialog-no-padding',
              width: '800px', height: '750px',
              data: {
                idMovimientoProyecto,
                cidEstado,
                proyectos: this.proyectoResponse
              }
            }); 
             dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {           
                    
              if(parametroRequestDialog.valorDevolver == 'ENVIAR_APROBACION_AL_JEFE'){
                  this.cargarPerfilPrefactibilidad();  
                  this.proyectoService.obternerToken(this.idUsuarioEncargado).subscribe(response =>{
                    if(response){              
                      response.forEach(element =>{               
                        this.chatService.enviarCidSocketChannel(element.cidsocket, 'expedienteCoordinador');
                      })
                     
                    }
                  });
              }

              else if(parametroRequestDialog.valorDevolver == 'ENVIAR_RECHAZO_A_TODOS'){
                this.cargarPerfilPrefactibilidad();              
                this.proyectoService.obternerToken(this.idUsuarioEncargado).subscribe(response =>{
                  if(response){              
                    response.forEach(element =>{               
                      this.chatService.enviarCidSocketChannel(element.cidsocket, 'expedienteCoordinador');
                    })                    
                  }
                });
              }
        
            }); 

          }
           else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);
      
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


    obtenerTokenUsuarioEnviarSocket(idUsuario: number, expediente: string){
      this.proyectoService.obternerToken(idUsuario).subscribe(response =>{
        if(response){
         
          response.forEach(element =>{      
            if(expediente == "expedienteCoordinador"){
              this.chatService.enviarCidSocketChannel(element.cidsocket, 'expedienteCoordinador');
              this.chatService.enviarCidSocketChannel(element.cidsocket, 'contadorMenu', 'expediente');
            }else{          
            this.chatService.enviarCidSocketChannel(element.cidsocket, 'contadorMenu', 'expediente');
            }
          })            
        }
      });
    }


    public totalPendientesProyecto(){
      this.proyectoService.totalPendientesProyecto()
      .subscribe(
        (wsApiOutResponse : WsApiOutResponse)=> {
          if(wsApiOutResponse.codResultado == 1){
            this.proyectoResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
            this.total = (wsApiOutResponse.total!=0)? wsApiOutResponse.total : 0;
            this.data.EnviarCantidad(this.total);
          }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, null); 
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


    generarCabeceraColumnasCoordinador(): void{
      this.columnas =[
        'Nro','fechaAsignada','fechaRecepcionProyecto','codProyecto','modalidadEjecucion',
        'encargadoAsignado', 'fechaAsignadaEncargado','estado','plazo','acciones'];
      
    }


    
    public verProyectoCoordinador(codigo: number) : void {
      
      this.parameterRequest = new ParametroRequest();
      this.parameterRequest.idProyecto = codigo;
      this.parameterRequest.ip = "127.0.0.1";

      this.objproyectoResponse = null;


      this.proyectoService.visualizarProyectoCoordinador (this.parameterRequest)
      .subscribe(
        (wsResponseProyecto : WsResponseProyecto)=> {
          
          if(wsResponseProyecto.codResultado == 1){
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            
            const dialogReg: MatDialogRef<CoordinadorDetalleComponent> = this.dialog.open(CoordinadorDetalleComponent, {
              panelClass: 'dialog-no-padding',
              width: '800px',
              data: {
                codigo,
                proyectos: this.proyectoResponse
              }
            }); 
          }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);
      
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


      public devolverDesdeBandejaCoordinador(parametroRequest : ParametroRequest){
        
         this.proyectoService.devolverDesdeBandejaCordinador(parametroRequest)
         .subscribe(
           (wsApiOutResponse : WsApiOutResponse)=> {
             if(wsApiOutResponse.codResultado == 1){
               this.proyectoResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
              /*  this.total = (wsApiOutResponse.total!=0)? wsApiOutResponse.total : 0; */
               this.cargarPerfilPrefactibilidad();
               this.proyectoService.obternerToken(this.idUsuarioJefe).subscribe(response =>{
                if(response){              
                  response.forEach(element =>{               
                    this.chatService.enviarCidSocketChannel(element.cidsocket, 'expedienteJefe');
                  })
                 
                }
              });
             }else{
               this.mensaje = MENSAJES.ERROR_NOFUNCION;
               this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, null);
         
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



       encargadoDaConformidad(): void{

        
        this.proyectoService.darConformidadEncargado(this.parametroRequest)
        .subscribe(
          (wsResponseProyecto : WsApiOutResponse)=> {
            
            if(wsResponseProyecto.codResultado == 1){
              this.observacionResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            
              this.mensaje = MENSAJES.PREFACTIBILIDAD_ENCARGADO.INFO_SUCCESS;
              this.openDialogMensaje2(MENSAJES.PREFACTIBILIDAD_ENCARGADO.TITLE, null, this.mensaje ,true, false, "OK");
               
            
             }else{
               this.mensaje = MENSAJES.ERROR_SERVICIO_CONFORMIDAD;
               this.openDialogMensaje2(MENSAJES.PREFACTIBILIDAD_ENCARGADO.TITLE,null,  this.mensaje,true, false, null);
         
             }
          },
          error => {
          //  this.isLoading = false;
            this.mensaje = MENSAJES.ERROR_SERVICIO;
          /*   this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);
            console.error(error);
            this.disableBuscar = false; */
          }
        
        );    
        
      }

     /*  this.proyectoService.visualizarroyecto(this.asignarDerivarRequest)
      .subscribe(
        (wsApiOutResponse : WsApiOutResponse)=> {
          
          if(wsApiOutResponse.codResultado == 1){
            this.objproyectoResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
            this.total = (wsApiOutResponse.total!=0)? wsApiOutResponse.total : 0;
      
          }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, null);
      
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
      
        const dialogReg: MatDialogRef<VisualizarComponent> = this.dialog.open(VisualizarComponent, {
          panelClass: 'dialog-no-padding',
          width: '800px',
          data: {
            codigo,
            proyectos: this.objproyectoResponse
          }
        }); */
    

    /*
    obtenerProyectoSeleccionado(){
      this.proyectoService.visualizarroyecto(this.asignarDerivarRequest)
      .subscribe(
        (wsApiOutResponse : WsApiOutResponse)=> {
          
          if(wsApiOutResponse.codResultado == 1){
            this.objproyectoResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
            this.total = (wsApiOutResponse.total!=0)? wsApiOutResponse.total : 0;
      
          }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, null);
      
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
    }*/



     
 

    asignarEncargado(idProyecto: number, cidEstado: string) : void {
    
            const dialogReg: MatDialogRef<CoordinadorAsignarComponent> = this.dialog.open(CoordinadorAsignarComponent, {
              panelClass: 'dialog-no-padding',
              width: '800px',
              data: {
                idProyecto,
                cidEstado

              }
            }); 
            dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {           
              
              console.log(parametroRequestDialog);
              /*if(typeof parametroRequestDialog  === 'undefined' || parametroRequestDialog === null ){
               
              }else{
                if(parametroRequestDialog.valorDevolver == 1){
                  this.devolverPerfilPrefactbilidad(this.parametroRequest);
                }
              }*/
             this.cargarPerfilPrefactibilidad();
            });
        
          }



          
              

          


}
