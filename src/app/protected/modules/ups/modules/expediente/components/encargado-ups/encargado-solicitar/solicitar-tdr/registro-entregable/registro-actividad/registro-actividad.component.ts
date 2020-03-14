import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog, PageEvent, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {combineLatest, Observable, of, BehaviorSubject} from 'rxjs';
import {FormControl} from '@angular/forms';
import { Animations } from '@shared/animations';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { Observacion, WsResponseObservacion } from '../../../../../../entities/observacion';
import { PrefijoEstado } from '../../../../../../entities/prefijo-estado';
import { DataSource } from '@angular/cdk/collections';
import { ProyectoService } from '../../../../../../services/proyecto.service';
import { ParametroRequest } from '../../../../../../dto/request/ParametroRequest';
import { MENSAJES } from 'app/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Session } from '@shared/auth/Session';
import { WsApiOutResponse } from '../../../../../../dto/response/WsApiOutResponse';
import { MessageComponent } from '@shared/components/message/message.component';
import { TdrService } from '../../../../../../services/tdr.service';
import { Tdr, WsResponseTdr } from '../../../../../../entities/tdr';
import { WsResponseActividad, ActividadResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/ActividadResponse';
import { WsResponseEntregable } from 'app/protected/modules/ups/modules/expediente/dto/response/EntregableResponse';

@Component({
  selector: 'app-registro-actividad',
  templateUrl: './registro-actividad.component.html',
  styleUrls: ['./registro-actividad.component.scss']
})
export class RegistroActividadComponent implements OnInit {

  proyectoForm: FormGroup;
  pagina = 1;
  cantidad = 3;
  total = 0;

  parametroRequest : ParametroRequest;

  actividadResponse : ActividadResponse[];
  dataSourceActividad: MatTableDataSource<ActividadResponse>;

  columnas: string[] = [
    'Nro', 
    'Descripcion',
    'accion'
  ];
  prefijoEstado = PrefijoEstado;
  observado: boolean;
  mensaje: any;
  tdrObject: any;
  contadorEntregable: number;
  tdrActividad: any;
  idActividad: number;

  dialogRefVariable: MatDialogRef<ConfirmMessageComponent, any>;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegistroActividadComponent>,
    private dialog: MatDialog,
    private tdrService: TdrService,
    @Inject(MAT_DIALOG_DATA)
    public dataFrmPrincipal: TdrPk
  ) { 
    
  
    // this.codPerfil = Session.identity.codPerfil; 
   
   
  }

  ngOnInit() {
    this.crearFormulario();
    this.listarActividades();
    this.contadorEntregable = 0;
    /* this.listarObservaciones();
    (this.datos.cidEstado === "005" 
     || this.datos.cidEstado === "010" || this.datos.cidEstado === "014")
      ? this.observado = true : this.observado = false;  */
  }
 
  crearFormulario(): void {
    this.proyectoForm = this.formBuilder.group({
      frmActividad: [''],
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
      
      }
    });
  }



  validarRegistro($event){
    
    $event.preventDefault();
    if(this.proyectoForm.get('frmActividad').value == '' || (this.proyectoForm.get('frmActividad').value == null)){
      this.mensaje = MENSAJES.TDR.TITLE_ACTIVIDAD;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.TDR.WARNING_ACTIVIDAD, true, false, null);
      return false;
    }else{
      this.registrar();
    }
  }



  registrar(): void{
    
    if(typeof this.idActividad === 'undefined' || this.idActividad == -1){
      this.tdrObject = new Tdr();
      this.tdrObject.descripcionEntregable = this.proyectoForm.get('frmActividad').value;
      this.tdrObject.fidEntregable  = this.dataFrmPrincipal.idCodigo;
      
      this.tdrService.registrarActividad(this.tdrObject)
      .subscribe(
        (wsResponseTdr : WsResponseTdr)=> {
          
          if(wsResponseTdr.codResultado == 1){ 
            this.mensaje = MENSAJES.TDR.INFO_SUCCESS_ACTIVIDAD;
            this.openDialogMensaje2(MENSAJES.TDR.TITLE_ACTIVIDAD, null, this.mensaje ,true, false, "OK");
            this.proyectoForm.get('frmActividad').setValue('');    
           
            this.listarActividades();
          }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            console.log(this.mensaje);
          }    
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(this.mensaje);
        }
      );     
      
    }else if(typeof this.idActividad !== 'undefined' && this.idActividad != -1){
      this.tdrObject = new Tdr();
      this.tdrObject.descripcionEntregable = this.proyectoForm.get('frmActividad').value;
      this.tdrObject.fidEntregable  = this.dataFrmPrincipal.idCodigo;
      
      this.tdrService.editarActividad(this.idActividad, this.tdrObject)
      .subscribe(
        (wsResponseTdr : WsResponseTdr)=> {
          
          if(wsResponseTdr.codResultado == 1){ 
            this.mensaje = MENSAJES.TDR.INFO_SUCCESS_ACTIVIDAD_ACTUALIZACION;
            this.openDialogMensaje2(MENSAJES.TDR.TITLE_ACTIVIDAD_MODIFICACION, null, this.mensaje ,true, false, "OK");
            this.proyectoForm.get('frmActividad').setValue('');      
            this.idActividad = -1;
            this.listarActividades();
          }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            console.log(this.mensaje);
          }      
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(this.mensaje);
       
        }
      );     


    }
    
  }



  listarActividades() : void {
    let idEntregable = this.dataFrmPrincipal.idCodigo;

    this.tdrService.listaActividad(idEntregable)
    .subscribe(
      (wsResponseActividad : WsResponseActividad)=> {
        
        if(wsResponseActividad.codResultado == 1){
          this.actividadResponse = (wsResponseActividad.response != null) ? wsResponseActividad.response : [];
          this.cargarTablaActividades();
        }else{
        
            this.actividadResponse = [];
            this.cargarTablaActividades();      
          
         
        }
      
      },
      error => {     
        this.mensaje = MENSAJES.ERROR_SERVICIO;
      /*   this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);
        console.error(error);
        this.disableBuscar = false; */
      }
    
    );    
  }



  cargarTablaActividades() {
    if(this.actividadResponse !=null){
      this.dataSourceActividad= new MatTableDataSource(this.actividadResponse);
     }
  }


  editarActividad(idCodigo: number){
    
    
    this.tdrService.obtenerActividad(idCodigo)
    .subscribe(
      (wsResponseActividad : WsResponseActividad)=> {
        
        if(wsResponseActividad.codResultado == 1){ 
          this.tdrActividad = wsResponseActividad.response;
          this.proyectoForm.get('frmActividad').setValue(this.tdrActividad.nombre);   
          this.idActividad = this.tdrActividad.idCodigo;
          //this.listarActividades();
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.log(this.mensaje);       
        } 
      },
      error => {
      
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        console.error(this.mensaje);
     
      }
    );     
  }


  eliminarActividad(idCodigo: number){

     this.dialogRefVariable = this.dialog.open(ConfirmMessageComponent);
     this.dialogRefVariable.componentInstance.message = `¿Seguro que desea eliminar la actividad?`;
     this.dialogRefVariable.afterClosed().subscribe((confirm: boolean) => {
 
       if (confirm) {        
         this.tdrService.eliminarActividad(idCodigo).subscribe(
 
           (wsResponseTdr : WsResponseTdr)=> {

             if(wsResponseTdr.codResultado == 1){            
               this.listarActividades();
             }
           },
           error => {
             this.mensaje = MENSAJES.ERROR_SERVICIO;
              console.error(this.mensaje);
           }
         
         ); 
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
     
 /*
      if (ok == 0) { 
          let enviarDataAlPrincipal: Object = {
            valorAccion: "REGISTRO_ENTREGABLE_OK",
          };
        this.dialogRef.close(enviarDataAlPrincipal)  
      }
*/
    
    });
  }




  public openDialogMensaje(
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




  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
   // this.listarObservaciones();
  }

  

}

interface TdrPk {
  idTdr?: number;
  idCodigo?: number;
}
