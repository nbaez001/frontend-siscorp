import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { Proyecto } from '../../../entities/proyecto';
import { ProyectoService } from '../../../services/proyecto.service';
import { ParametroRequest } from '../../../dto/request/ParametroRequest';
import { ArchivoResponse, WsResponseArchivo } from '../../../dto/response/ArchivoResponse';
import { MENSAJES } from 'app/common';
import { MessageComponent } from '@shared/components/message/message.component';
import { saveAs } from 'file-saver';
import { WsResponsePersonal, PersonalResponse } from '../../../dto/response/PersonalResponse';
import { PersonalService } from '../../../services/personal.service';
import { EquipoResponse, WsResponseEquipo } from '../../../dto/response/EquipoResponse';
import { WsApiOutResponse } from '../../../dto/response/WsApiOutResponse';
import { ProyectoResponse } from '../../../dto/response/ProyectoResponse';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';

@Component({
  selector: 'app-aprobar-expediente',
  templateUrl: './aprobar-expediente.component.html',
  styleUrls: ['./aprobar-expediente.component.scss']
})
export class AprobarExpedienteComponent implements OnInit {

  proyectoForm: FormGroup;

  archivos: any[] = [];
  
  nombreArchivo : any[] = [];


  parametroRequest: ParametroRequest;

  archivoResponse : ArchivoResponse[];

  proyectoResponse : ProyectoResponse[];

  btnAprobarCoordHabilitar: boolean;
  btnRechazarCoordHabilitar: boolean;


      // Tabla
  dataSource: MatTableDataSource<ArchivoResponse>;
  dataSourceEquipoElaborador: MatTableDataSource<EquipoResponse>;
  dataSourceEquipoRevisor: MatTableDataSource<EquipoResponse>;
 
  total : number;
  mensaje: string;
  columnas: string[] = [];
  equipoElaborador: EquipoResponse[];
  equipoRevisor: EquipoResponse[];


  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<AprobarExpedienteComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datos:DatosGrillaProyecto,
    private personalService: PersonalService,
    private proyectoService: ProyectoService,
    private dialog: MatDialog) { 
    this.crearFiltrosForm();


    this.obtenerElaboradores(this.datos.idMovimientoproyecto);
    this.obtenerRevisores(this.datos.idMovimientoproyecto);
   
    this.datosNullSetearValorDefecto();


  }

  ngOnInit() {


    
   this.columnas = ['Nro','Profesional','Puesto','Tipo']; 

   if(this.datos.cidEstado == '020' || this.datos.cidEstado == '021'){
    this.btnAprobarCoordHabilitar = true;
    this.btnRechazarCoordHabilitar = true;
   }
  else{
   this.btnAprobarCoordHabilitar = false;
   this.btnRechazarCoordHabilitar = false;
  }
  }


  crearFiltrosForm() {
    this.proyectoForm = this.formBuilder.group({
      codigo: '',
      modalidad:'',
      encargado:'',
      coordinadorAsignado:'',
      fechaAsignacionCoordinador:'',
      fechaAsignacionEncargado:'',
      fechaAsignacionProyecto:'',
      fechaRecepcionProyecto:'',
      estadoProyecto : '',
      encargadoAsignado: '',
      profesionalElaboracion:'',
      profesionalRevision: '',
      observacion:''

    });
  }


  
  public obtenerElaboradores(idProyectoMovimiento: number) : void{
    
    this.equipoElaborador = [];
    this.personalService.listarElaboradores(idProyectoMovimiento).subscribe(
      (wsResponseEquipo : WsResponseEquipo)=> {
        if(wsResponseEquipo.codResultado  == 1){
          this.equipoElaborador = (wsResponseEquipo.response != null) ?wsResponseEquipo.response : []; 
          this.cargarTablaEquipoElaborador();
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.log(this.mensaje);
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }

    
  public obtenerRevisores(idProyectoMovimiento: number) : void{

    this.equipoRevisor = [];
    this.personalService.listarRevisores(idProyectoMovimiento).subscribe(
      (wsResponseEquipo : WsResponseEquipo)=> {
        if(wsResponseEquipo.codResultado == 1){
          this.equipoRevisor = (wsResponseEquipo.response != null) ? wsResponseEquipo.response : []; 
          this.cargarTablaEquipoRevisor();
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.log(this.mensaje);
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }



  subirArchivos(archivos: FileList): void {
    
    for (let i = 0; i < archivos.length; i++) {

      const formData: FormData = new FormData();
      formData.append('archivo', archivos.item(i));
      this.archivos.push({ruta:  archivos.item(i)});
      console.log(this.archivos[0].ruta.name);
    }
  }



  datosNullSetearValorDefecto(){
    if(this.datos.proyectos.nombreCoordinador == null){
      this.datos.proyectos.nombreCoordinador = 'POR ASIGNAR';
    }if(this.datos.proyectos.fecAsignacion == null){
      this.datos.proyectos.fecAsignacion = 'POR ASIGNAR';
    }
  }



  aprobarExpediente() : void{
    
    this.parametroRequest = new ParametroRequest();
    this.parametroRequest.idProyecto = this.datos.idMovimientoproyecto;
    this.parametroRequest.observacion =  (this.proyectoForm.get('observacion').value == null)?"":this.proyectoForm.get('observacion').value ;
    this.parametroRequest.ip = "127.0.0.1";

   const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
   dialogMessage.componentInstance.message = '¿Está seguro de aprobar al expediente?';
   dialogMessage.afterClosed().subscribe((confirm: boolean) => {
     if (confirm) { 
       this.realizarAprobacion();
     }
   });
  
  }

  rechazarExpediente($event) : void{
    
    this.parametroRequest = new ParametroRequest();
    this.parametroRequest.idProyecto = this.datos.idMovimientoproyecto;
    this.parametroRequest.observacion =  (this.proyectoForm.get('observacion').value == null)?"":this.proyectoForm.get('observacion').value ;
    this.parametroRequest.ip = "127.0.0.1";

    $event.preventDefault();
    if(this.parametroRequest.observacion == ""){
      this.openDialogMensaje(null, "Debe ingresar alguna observación por el rechazo del expediente", true, false, '');   
      return;
    }

   const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
   dialogMessage.componentInstance.message = '¿Está seguro de rechazar al expediente?';
   dialogMessage.afterClosed().subscribe((confirm: boolean) => {
     if (confirm) {
       this.rechazoDelJefe();
     }
   });
  
  }


  public realizarAprobacion(){
    
     this.proyectoService.aprobacionDelJefe(this.parametroRequest)
     .subscribe(
       (wsApiOutResponse : WsApiOutResponse)=> {
         if(wsApiOutResponse.codResultado == 1){
           this.proyectoResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
           this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, 'APROBACION REALIZADA');   
         }else{
           this.mensaje = MENSAJES.ERROR_NOFUNCION;
           this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, null);   
         }
       },
       error => {
        
         this.mensaje = MENSAJES.ERROR_SERVICIO;
         this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);
         console.error(error);
       }
     
     ); 
   }


   public rechazoDelJefe(){
    
     this.proyectoService.rechazoDelJefe(this.parametroRequest)
     .subscribe(
       (wsApiOutResponse : WsApiOutResponse)=> {
         if(wsApiOutResponse.codResultado == 1){
           this.proyectoResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
           this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, 'EL EXPEDIENTE HA SIDO RECHAZADO');   
         }else{
           this.mensaje = MENSAJES.ERROR_NOFUNCION;
           this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, null);   
         }
       },
       error => {
        
         this.mensaje = MENSAJES.ERROR_SERVICIO;
         this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);
         console.error(error);
       }
     
     ); 
   }



  
  /* public openDialogMensajeConfirm(
    
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
        this.enviarSolicitudAprobacion ();
      }
    });
  }
 */
  public cargarTablaEquipoElaborador(): void {
    if (this.equipoElaborador != null && this.equipoElaborador.length > 0) {
      this.dataSourceEquipoElaborador = new MatTableDataSource(this.equipoElaborador);
    }
  }

  public cargarTablaEquipoRevisor(): void {
    if (this.equipoRevisor != null && this.equipoRevisor.length > 0) {
      this.dataSourceEquipoRevisor = new MatTableDataSource(this.equipoRevisor);
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
         /*  this.reiniciar();
          this.filtrosProyectoRequest = null;
          this.filtrosProyectoRequest = new ProyectoRequest();
          this.cargarPerfilPrefactibilidad(); */
        }else if(valor == "APROBACION REALIZADA"){
          let enviarAprobacionAlJefeDialog: Object = {
            valorDevolver: "ENVIAR_APROBACION_A_TODOS",
            idProyecto: this.datos.idMovimientoproyecto
            };
     
            this.dialogRef.close(enviarAprobacionAlJefeDialog)  
         /*  this.reiniciar();
          this.filtrosProyectoRequest = null;
          this.filtrosProyectoRequest = new ProyectoRequest(); */
        }else if(valor == "EL EXPEDIENTE HA SIDO RECHAZADO"){
          let enviarAprobacionAlJefeDialog: Object = {
            valorDevolver: "ENVIAR_RECHAZO_A_TODOS",
            idProyecto: this.datos.idMovimientoproyecto
            };
     
            this.dialogRef.close(enviarAprobacionAlJefeDialog)  
        }

      }
    });
  }

  


}

interface DatosGrillaProyecto {
  idMovimientoproyecto?: number;
  cidEstado: string;
  proyectos: Proyecto;
}

