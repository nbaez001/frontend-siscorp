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
import { CoordinadorAprobarComponent } from '../coordinador-ups/coordinador-aprobar/coordinador-aprobar.component';
import { AprobarExpedienteComponent } from './aprobar-expediente/aprobar-expediente.component';
import { ChatService } from 'app/protected/modules/chat/services/chat.service';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-jefe-ups',
  templateUrl: './jefe-ups.component.html',
  styleUrls: ['./jefe-ups.component.scss'],
  animations: Animations
})
export class JefeUPSComponent implements OnInit {

  
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

  asignarDerivarRequest: ParametroRequest;

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

  idPerfil: string; 
  codPerfil: string;
  columnas: string[] = [];

  mensaje: string;
  disableBuscar: boolean;

  
  datos:Proyecto;
  maxDate: Date;
  blockedDocument: boolean;
  d: Date;
  year: number;
  month: number;
  day: number;

  idUsuarioCoordinador: number;

  expedienteSuscripcionJefe: Subscription;

  
    constructor(private formBuilder: FormBuilder,private dialog: MatDialog,
      private itemComboService: ItemComboService,
      private proyectoService: ProyectoService,
      private chatService: ChatService,
      private socket: Socket,
      private data: SharedService,) { 
        //this.idPerfil = Session.identity.id_perfil;
        // this.codPerfil = Session.identity.codPerfil;
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

    reiniciar() {
      this.filtrosForm.reset('');
      this.filtrosProyectoRequest = new ProyectoRequest();
      this.cargarPerfilPrefactibilidad();
    }
    
    public guardarFiltrosBusqueda(): void {
      this.filtrosProyectoRequest.codDocumento = this.codDocFrmCtrl.value;
      this.filtrosProyectoRequest.fechaInicio = this.fechaRegDesdeFrmCtrl.value !== null ? _moment(this.fechaRegDesdeFrmCtrl.value).format('DD-MM-YYYY'): null;
      this.filtrosProyectoRequest.fechaFin = this.fechaRegHastaFrmCtrl.value !== null ?_moment(this.fechaRegHastaFrmCtrl.value).format('DD-MM-YYYY'): null;;
      this.filtrosProyectoRequest.idAlerta = this.alertaFrmCtrl.value;
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


/*     public addSolicitud($event): void {
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
      this.generarCabeceraColumnasjefeUps();
      this.cargarDataEstado(Number(this.idPerfil));
      this.cargarDataAlerta();
      this.cargarPerfilPrefactibilidad();
      this.obtenerIdUsuario();      
      this.expedienteSuscripcionJefe = this.socket.fromEvent('expedienteJefe').subscribe(() => this.cargarPerfilPrefactibilidad());
      this.maxDate = new Date();
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
          }/* else{
            this.reiniciar();
            this.filtrosProyectoRequest = null;
            this.filtrosProyectoRequest = new ProyectoRequest();
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
       
   
      
      });
    }

    public openDialogMensajeFiltroBusqueda(
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
          this.derivarCoordinador();
        }
      });
    }

    ngOnDestroy(){
      this.expedienteSuscripcionJefe.unsubscribe();
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
           /*  this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado); */
      
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


      AprobarExpediente(idMovimientoproyecto : number, cidEstado: string) : void{
        this.asignarDerivarRequest = new ParametroRequest();
        this.asignarDerivarRequest.idProyecto = idMovimientoproyecto;
        this.asignarDerivarRequest.ip = "127.0.0.1";
  
        this.objproyectoResponse = null;
  
  
        this.proyectoService.visualizarroyecto(this.asignarDerivarRequest)
        .subscribe(
          (wsResponseProyecto : WsResponseProyecto)=> {
            
            if(wsResponseProyecto.codResultado == 1){
               this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
              
              const dialogReg: MatDialogRef<AprobarExpedienteComponent> = this.dialog.open(AprobarExpedienteComponent, {
                panelClass: 'dialog-no-padding',
                width: '800px', height: '750px',
                data: {
                  idMovimientoproyecto,
                  cidEstado,
                  proyectos: this.proyectoResponse
                }
              }); 

              dialogReg.afterClosed().subscribe((enviarAprobacionAlJefeDialog: any) => {           
                      
                if(enviarAprobacionAlJefeDialog.valorDevolver == 'ENVIAR_APROBACION_A_TODOS'){
                    this.cargarPerfilPrefactibilidad();  
                    this.proyectoService.obternerToken(this.idUsuarioCoordinador).subscribe(response =>{
                      if(response){              
                        response.forEach(element =>{               
                          this.chatService.enviarCidSocketChannel(element.cidsocket, 'expediente');
                        })                    
                      }
                    });
                }else if(enviarAprobacionAlJefeDialog.valorDevolver == 'ENVIAR_RECHAZO_A_TODOS'){
                  this.cargarPerfilPrefactibilidad();  
                  this.proyectoService.obternerToken(this.idUsuarioCoordinador).subscribe(response =>{
                    if(response){              
                      response.forEach(element =>{               
                        this.chatService.enviarCidSocketChannel(element.cidsocket, 'expediente');
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


    public asignarDerivarCoordinador(idProyecto: number, codigo: string) : void{

      this.asignarDerivarRequest = new ParametroRequest();
      this.asignarDerivarRequest.idProyecto = idProyecto;
      this.asignarDerivarRequest.ip = "127.0.0.1";
      this.openDialogMensajeConfirm(null,  MENSAJES.DERIVAR_COORDINADOR_CONFIRM + ' ' + codigo + '?', false, true, null);
    }

    public derivarCoordinador(){
     
      this.proyectoService.asignarDerivarCorrdinador(this.asignarDerivarRequest)
      .subscribe(
        (wsApiOutResponse : WsApiOutResponse)=> {
          if(wsApiOutResponse.codResultado == 1){
            this.proyectoResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
            this.total = (wsApiOutResponse.total!=0)? wsApiOutResponse.total : 0;
            this.cargarPerfilPrefactibilidad();

            this.proyectoService.obtenerTokenUsuarioEnviarSocket(Session.identity.id_usuario, "");
            this.proyectoService.obtenerTokenUsuarioEnviarSocket(this.idUsuarioCoordinador, "expediente");

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


    generarCabeceraColumnasjefeUps(): void{
      this.columnas = ['Nro','fechaRecepcionProyecto','codProyecto','coordinadorAsignado','fechaAsignacion','estado','plazo','acciones']; 
    }



    public verProyecto(codigo: number) : void {
      
      this.asignarDerivarRequest = new ParametroRequest();
      this.asignarDerivarRequest.idProyecto = codigo;
      this.asignarDerivarRequest.ip = "127.0.0.1";

      this.objproyectoResponse = null;


      this.proyectoService.visualizarroyecto(this.asignarDerivarRequest)
      .subscribe(
        (wsResponseProyecto : WsResponseProyecto)=> {
          
          if(wsResponseProyecto.codResultado == 1){
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
           
            const dialogReg: MatDialogRef<VisualizarComponent> = this.dialog.open(VisualizarComponent, {
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

    

    
    public verProyectoCoordinador(codigo: number) : void {
      
      this.asignarDerivarRequest = new ParametroRequest();
      this.asignarDerivarRequest.idProyecto = codigo;
      this.asignarDerivarRequest.ip = "127.0.0.1";

      this.objproyectoResponse = null;


      this.proyectoService.visualizarProyectoCoordinador (this.asignarDerivarRequest)
      .subscribe(
        (wsResponseProyecto : WsResponseProyecto)=> {
          
          if(wsResponseProyecto.codResultado == 1){
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            
            const dialogReg: MatDialogRef<VisualizarComponent> = this.dialog.open(VisualizarComponent, {
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
 
    obtenerIdUsuario(){
      
      this.proyectoService.obtenerUsuarioPorTipoUsuario(TIPO_USUARIO.COORDINADOR_UPS).subscribe(response =>{
        if(response){
         this.idUsuarioCoordinador = response;
        }
      });
    }


      observarProyecto(idProyecto: number, cidEstado: string, codigoProyecto: string) : void {
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
                    this.devolverPerfilPrefactbilidad(this.parametroRequest);
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
                    this.devolverPerfilPrefactbilidad(this.parametroRequest);

                    this.proyectoService.obtenerTokenUsuarioEnviarSocket(Session.identity.id_usuario, "");
                    this.proyectoService.obtenerTokenUsuarioEnviarSocket(this.idUsuarioCoordinador, "expediente");
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

      public devolverPerfilPrefactbilidad(parametroRequest : ParametroRequest){
        
         this.proyectoService.devolverPerfilPrefactbilidad(parametroRequest)
         .subscribe(
           (wsApiOutResponse : WsApiOutResponse)=> {
             if(wsApiOutResponse.codResultado == 1){
               this.proyectoResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
              /*  this.total = (wsApiOutResponse.total!=0)? wsApiOutResponse.total : 0; */
               this.cargarPerfilPrefactibilidad();
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



          verificarProyecto(idProyecto: number, cidEstado: string) : void {
            this.parametroRequest = new ParametroRequest();
            this.parametroRequest.idProyecto = idProyecto;//codigo;
    
            this.proyectoService.listarObservacionesProyecto(this.paginaObservacion,this.cantidadObservacion,this.parametroRequest)
        
                
               
                  this.observacionResponse = [];
                  this.totalObservacion = 0;
                  const dialogReg: MatDialogRef<ObservacionComponent> = this.dialog.open(ObservacionComponent, {
                    panelClass: 'dialog-no-padding',
                    width: '800px',
                    data: {
                      idProyecto,
                      cidEstado,
                      observacionArray: this.observacionResponse,
                      total: this.totalObservacion
                    }
                  }); 
                  dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {           
                    
                    console.log(parametroRequestDialog);
                    if(typeof parametroRequestDialog  === 'undefined' || parametroRequestDialog === null ){
                     
                    }else{
                      if(parametroRequestDialog.valorDevolver == 1){
                        this.devolverPerfilPrefactbilidad(this.parametroRequest);
                      }else if(parametroRequestDialog.valorDevolver == 2){
                        this.encargadoDaConformidad();
    
                      }
                    }
                  });
              
                }
                
           
          
                solicitarEvaluacion(idProyecto: number, cmodalidadEjecucion: string): void {

      
                    const dialogReg: MatDialogRef<SolicitarEvaluacionComponent> = this.dialog.open(SolicitarEvaluacionComponent, {
                      disableClose: true,
                      panelClass: 'dialog-no-padding',
                      width: '700px',
                      data: {
                        idProyecto
                      }
                    });
                 
                  
              
                }
              
                public validarFechaInicio() {
                  const dateInicio = this.fechaRegDesdeFrmCtrl.value;
                  const dateFin = this.fechaRegHastaFrmCtrl.value;
                  const dateActual = new Date();
                  if (this.fechaRegHastaFrmCtrl.value !== null) {
                    if (dateInicio > dateFin) {
                      this.openDialogMensajeFiltroBusqueda('FILTROS DE BÚSQUEDA','Fecha inicial debe ser menor que la fecha final', null, true, false, null);
                      this.fechaRegDesdeFrmCtrl.setValue(null);
                    } else if (dateInicio === dateFin) {
                      this.openDialogMensajeFiltroBusqueda('FILTROS DE BÚSQUEDA','Fecha inicial debe ser distinta a la fecha final', null, true, false, null);
                      this.fechaRegDesdeFrmCtrl.setValue(null);
                    } /* else if (dateInicio <= dateActual) {
                      this.openDialogMensajeFiltroBusqueda('FILTROS DE BÚSQUEDA','Fecha debe de ser mayor al actual', null, true, false, null);
                      this.fechaRegDesdeFrmCtrl.setValue(null);
                    } */
                  }
                }
              
                public validarFechaFin() {
                  const dateInicio = this.fechaRegDesdeFrmCtrl.value;
                  const dateFin = this.fechaRegHastaFrmCtrl.value;
                  const dateActual = new Date();
                  if (this.fechaRegDesdeFrmCtrl.value !== null) {
                    if (dateInicio > dateFin) {
                      this.openDialogMensajeFiltroBusqueda('FILTROS DE BÚSQUEDA','Fecha final debe ser mayor a la fecha inicial', null, true, false, null);
                      this.fechaRegHastaFrmCtrl.setValue(null);
                    } else if (dateInicio === dateFin) {
                      this.openDialogMensajeFiltroBusqueda('FILTROS DE BÚSQUEDA','Fecha final debe ser distinta a la fecha inicial', null, true, false, null);
                      this.fechaRegHastaFrmCtrl.setValue(null);
                    } /* else if (dateFin < dateActual) {
                      this.openDialogMensajeFiltroBusqueda('FILTROS DE BÚSQUEDA','Fecha no debe de ser menor al actual', null, true, false, null);
                      this.fechaRegHastaFrmCtrl.setValue(null);
                    } */
                  }
                }


          descargarExcel($event){
                //$event.stopPropagation();
                $event.preventDefault();
                this.proyectoService.generarExcelBandejaPrefactibilidad(this.pagina, this.cantidad,this.filtrosProyectoRequest);
               
          }

}
