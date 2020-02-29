import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog, PageEvent, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {combineLatest, Observable, of, BehaviorSubject} from 'rxjs';
import {FormControl} from '@angular/forms';
import { Animations } from '@shared/animations';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { Observacion, WsResponseObservacion } from '../../../../../entities/observacion';
import { PrefijoEstado } from '../../../../../entities/prefijo-estado';
import { DataSource } from '@angular/cdk/collections';
import { ProyectoService } from '../../../../../services/proyecto.service';
import { ParametroRequest } from '../../../../../dto/request/ParametroRequest';
import { MENSAJES } from 'app/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Session } from '@shared/auth/Session';
import { WsApiOutResponse } from '../../../../../dto/response/WsApiOutResponse';
import { MessageComponent } from '@shared/components/message/message.component';
import { TdrService } from '../../../../../services/tdr.service';
import { Tdr, WsResponseTdr } from '../../../../../entities/tdr';
import { WsResponseEntregable, EntregableResponse } from '../../../../../dto/response/EntregableResponse';

@Component({
  selector: 'app-registro-forma-pago',
  templateUrl: './registro-forma-pago.component.html',
  styleUrls: ['./registro-forma-pago.component.scss']
})

export class RegistroFormaPagoComponent implements OnInit {

  proyectoForm: FormGroup;
  pagina = 1;
  cantidad = 3;
  total = 0;
  codProyecto: string;

  codPerfil: string;

  // Tabla
  dataSource: MatTableDataSource<Observacion>;
  parametroRequest : ParametroRequest;
  observacionResponse : Observacion[];

  observa : Observacion;
  columnas: string[] = [
    'fecha', 
    'entregable',
    'observadoPor'
  ];
  prefijoEstado = PrefijoEstado;
  observado: boolean;
  mensaje: any;
  tdrObject: any;
  contadorEntregable: number;
  tdrEntregable:any;
  nombreEntregable: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegistroFormaPagoComponent>,
    private dialog: MatDialog,
    private tdrService: TdrService,
    @Inject(MAT_DIALOG_DATA)
    public dataFrmPrincipal: TdrPk
  ) { 
    
  
    // this.codPerfil = Session.identity.codPerfil; 
   
   
  }

  ngOnInit() {
    this.crearFormulario();
    this.cargarFormaPago();
    this.contadorEntregable = 0;
    /* this.listarObservaciones();
    (this.datos.cidEstado === "005" 
     || this.datos.cidEstado === "010" || this.datos.cidEstado === "014")
      ? this.observado = true : this.observado = false;  */
  }
 
  crearFormulario(): void {
    this.proyectoForm = this.formBuilder.group({
      frmFormaPago: [''],
      frmSimbolo: [''],
      frmDescripcion: ['']
    });
  }



  cargarFormaPago(): void {

    if (typeof this.dataFrmPrincipal.idFormaPago !== "undefined") {

      
      this.tdrService.obtenerEntregable(this.dataFrmPrincipal.idFormaPago)
        .subscribe(
          (wsResponseEntregable: WsResponseEntregable) => {
            
            if (wsResponseEntregable.codResultado == 1) {
              this.tdrEntregable = wsResponseEntregable.response;
              this.nombreEntregable = this.tdrEntregable.nombre;
              this.proyectoForm.get('frmFormaPago').setValue(this.nombreEntregable);
              this.proyectoForm.get('frmDescripcion').setValue(this.tdrEntregable.plazo);

              //this.listarObservaciones();
            } else {
              this.mensaje = MENSAJES.ERROR_NOFUNCION;
              console.log(this.mensaje);
              // this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);
            }

          },
          error => {
            //  this.isLoading = false;
            this.mensaje = MENSAJES.ERROR_SERVICIO;
            console.log(this.mensaje);

          }
        );

    }

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
    if(this.proyectoForm.get('frmFormaPago').value == '' || (this.proyectoForm.get('frmFormaPago').value == null)){
      this.mensaje = MENSAJES.TDR.TITLE_ENTREGABLE;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.TDR.WARNING_ENTREGABLE_NOMBRE, true, false, null);
      return false;
    }else if(this.proyectoForm.get('frmDescripcion').value == '' || (this.proyectoForm.get('frmDescripcion').value == null)){
      this.mensaje = MENSAJES.TDR.TITLE_ENTREGABLE;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.TDR.WARNING_ENTREGABLE_PLAZO, true, false, null);
      return false;
    }
    else{
      this.registrar();
    }
  }



  registrar(): void{
  
    

    if (typeof this.dataFrmPrincipal.idFormaPago !== "undefined") {
    this.tdrObject = new Tdr();
    this.tdrObject.nombreEntregable = this.proyectoForm.get('frmFormaPago').value; 
    this.tdrObject.plazoEntregable = this.proyectoForm.get('frmDescripcion').value;
    this.tdrObject.fidTdr  = this.dataFrmPrincipal.idTdr;
    
    this.tdrService.editarEntregable(this.dataFrmPrincipal.idFormaPago, this.tdrObject)
    .subscribe(
      (wsResponseTdr : WsResponseTdr)=> {
        
        if(wsResponseTdr.codResultado == 1){ 
          this.mensaje = MENSAJES.TDR.INFO_SUCCESS_ENTREGABLE_MODIFICACION;
          this.openDialogMensaje2(MENSAJES.TDR.TITLE_ENTREGABLE, null, this.mensaje ,true, false, "OK");
          this.proyectoForm.get('frmFormaPago').setValue('');
          this.proyectoForm.get('frmDescripcion').setValue('');
         
       
          //this.listarObservaciones();
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
         // this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);
        }
     
      },
      error => {
      //  this.isLoading = false;
        this.mensaje = MENSAJES.ERROR_SERVICIO;
     
      }
    );     

    }else{

    this.tdrObject = new Tdr();
/*  this.tdrObject.nombreEntregable = this.palabraPosicionEntregable(this.dataFrmPrincipal.cantEntregable) + ' entregable '; 
    this.tdrObject.plazoEntregable = this.proyectoForm.get('frmEntregable').value; */
    this.tdrObject.nombreEntregable = this.proyectoForm.get('frmFormaPago').value; 
    this.tdrObject.plazoEntregable = this.proyectoForm.get('frmDescripcion').value;
    this.tdrObject.fidTdr  = this.dataFrmPrincipal.idTdr;
    
    this.tdrService.registrarEntregable(this.tdrObject)
    .subscribe(
      (wsResponseTdr : WsResponseTdr)=> {
        
        if(wsResponseTdr.codResultado == 1){ 
          this.mensaje = MENSAJES.TDR.INFO_SUCCESS_ENTREGABLE;
          this.openDialogMensaje2(MENSAJES.TDR.TITLE_ENTREGABLE, null, this.mensaje ,true, false, "OK");
          this.proyectoForm.get('frmFormaPago').setValue('');
          this.proyectoForm.get('frmDescripcion').setValue('');
       
          //this.listarObservaciones();
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
         // this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);
        }
     
      },
      error => {
      //  this.isLoading = false;
        this.mensaje = MENSAJES.ERROR_SERVICIO;
     
      }
    );     
    }
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
     
 
      if (ok == 0) { 
          let enviarDataAlPrincipal: Object = {
            valorAccion: "REGISTRO_FORMA_PAGO_OK",
          };
        this.dialogRef.close(enviarDataAlPrincipal)  
      }

    
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

}

interface TdrPk {
  idTdr?: number;
  cantEntregable?: number;
  idFormaPago?: number;

}
