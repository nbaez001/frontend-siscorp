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
import { ItemBean } from '../../dto/response/ItemBean';
import * as _moment from 'moment';
import { MENSAJES, TIPO_USUARIO } from 'app/common';
import { MessageComponent } from '@shared/components/message/message.component';
import { ParametroRequest } from '../../dto/request/ParametroRequest';
import { Observacion } from '../../entities/observacion';

import { PersonalService } from '../../services/personal.service';
import { EquipoResponse, WsResponseEquipo } from '../../dto/response/EquipoResponse';
import { Router } from '@angular/router';
import { ChatService } from 'app/protected/modules/chat/services/chat.service';
import { Socket } from 'ng-socket-io';
import { JefeElaboradorDetalleComponent } from './jefe-elaborador-detalle/jefe-elaborador-detalle.component';
import { JefeElaboradorArchivoComponent } from './jefe-elaborador-archivo/jefe-elaborador-archivo.component';


@Component({
  selector: 'app-jefe-elaborador',
  templateUrl: './jefe-elaborador.component.html',
  styleUrls: ['./jefe-elaborador.component.scss']
})
export class JefeElaboradorComponent implements OnInit {

  
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
  
    constructor(private formBuilder: FormBuilder,private dialog: MatDialog,
      private itemComboService: ItemComboService,
      private proyectoService: ProyectoService,
      private personalService: PersonalService,
      private chatService: ChatService,
      private socket: Socket,
      private router: Router,
      private data: SharedService,) { 
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

    obtenerIdUsuarioCoordinador(){
       
      this.proyectoService.obtenerUsuarioPorTipoUsuario(TIPO_USUARIO.COORDINADOR_UPS).subscribe(response =>{
        if(response){
        this.idUsuarioCoordinador = response;
        }
      });
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

    ngOnInit() {
      this.crearFiltrosForm();
      this.generarCabeceraColumnasEncargado();
      this.cargarDataEstado(Number(this.idPerfil));
      this.cargarDataAlerta();
      this.cargarPerfilPrefactibilidad();
      this.obtenerIdUsuarioCoordinador();   
      //this.expedienteSuscripcionEncargado = this.socket.fromEvent('expedienteCoordinador').subscribe(() => this.cargarPerfilPrefactibilidad());
      
    }


    /* ngOnDestroy(){
      this.expedienteSuscripcionEncargado.unsubscribe();
    } */

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

    generarCabeceraColumnasEncargado(): void{
      this.columnas = [
        'Nro','fechaAsignada','encargadoExpedienteTecnico','fechaRecepcionProyecto','codProyecto',
        'modalidadEjecucion','profesionalElaboracion','profesionalRevision','estado','acciones']; 
    }

    
    public verProyectoEncargado(idMovimientoproyecto: number) : void {
       
      this.asignarDerivarRequest = new ParametroRequest();
      this.asignarDerivarRequest.idProyecto = idMovimientoproyecto;
      this.asignarDerivarRequest.ip = "127.0.0.1";

      this.objproyectoResponse = null;


      this.proyectoService.visualizarProyectoJefeElaborador(this.asignarDerivarRequest)
      .subscribe(
        (wsResponseProyecto : WsResponseProyecto)=> {
           
          if(wsResponseProyecto.codResultado == 1){
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            
            const dialogReg: MatDialogRef<JefeElaboradorDetalleComponent> = this.dialog.open(JefeElaboradorDetalleComponent, { 
              panelClass: 'dialog-no-padding',
              width: '900px',
              data: {
                idMovimientoproyecto,
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

 /*  cargarArchivoPresupuestoBachero(idProyecto: number, fidProyecto: number): void {
    this.objproyectoResponse = null;
    const dialogReg: MatDialogRef<JefeElaboradorArchivoPresupuestoComponent> = this.dialog.open(JefeElaboradorArchivoPresupuestoComponent, {
      panelClass: 'dialog-no-padding',
      width: '1200px',
      data: {
        idProyecto,
        fidProyecto
      },
      disableClose: true
    } );
  } */


}
