import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog, PageEvent, MatTableDataSource, MatRadioGroup } from '@angular/material';
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
  selector: 'app-registro-entregable',
  templateUrl: './registro-entregable.component.html',
  styleUrls: ['./registro-entregable.component.scss']
})
export class RegistroEntregableComponent implements OnInit {

  proyectoForm: FormGroup;
  pagina = 1;
  cantidad = 3;
  total = 0;
  codProyecto: string;

  codPerfil: string;

  // Tabla
  dataSource: MatTableDataSource<Observacion>;
  @ViewChild('radioButonSimboloSeleccionado', null) radioButonSimboloSeleccionado: MatRadioGroup;
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


  chekPorcentaje: boolean;
  chekSoles: boolean;


  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegistroEntregableComponent>,
    private dialog: MatDialog,
    private tdrService: TdrService,
    @Inject(MAT_DIALOG_DATA)
    public dataFrmPrincipal: TdrPk
  ) { 
    
  
    // this.codPerfil = Session.identity.codPerfil; 
   
   
  }

  ngOnInit() {
    this.crearFormulario();
    this.cargarEntregable();
    this.contadorEntregable = 0;
    this.chekPorcentaje = true;
    /* this.listarObservaciones();
    (this.datos.cidEstado === "005" 
     || this.datos.cidEstado === "010" || this.datos.cidEstado === "014")
      ? this.observado = true : this.observado = false;  */
  }
 
  crearFormulario(): void {
    this.proyectoForm = this.formBuilder.group({
      frmEntregable: [''],
      frmPlazo: [''],
      frmFormaPago: ['']
    });
  }



  cargarEntregable(): void {

    if (typeof this.dataFrmPrincipal.idEntregable !== "undefined") {

      
      this.tdrService.obtenerEntregable(this.dataFrmPrincipal.idEntregable)
        .subscribe(
          (wsResponseEntregable: WsResponseEntregable) => {
            
            if (wsResponseEntregable.codResultado == 1) {
              this.tdrEntregable = wsResponseEntregable.response;
              this.nombreEntregable = this.tdrEntregable.nombre;
              this.proyectoForm.get('frmEntregable').setValue(this.nombreEntregable);
              this.proyectoForm.get('frmPlazo').setValue(this.tdrEntregable.plazo);
              this.proyectoForm.get('frmFormaPago').setValue(this.tdrEntregable.descripcionModalidad);

              this.chekPorcentaje = this.tdrEntregable.fidModalidad == 1?true:false;
              this.chekSoles = this.tdrEntregable.fidModalidad == 1?false:true;

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
    if(this.proyectoForm.get('frmEntregable').value == '' || (this.proyectoForm.get('frmEntregable').value == null)){
      this.mensaje = MENSAJES.TDR.TITLE_ENTREGABLE;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.TDR.WARNING_ENTREGABLE_NOMBRE, true, false, null);
      return false;
    }else if(this.proyectoForm.get('frmPlazo').value == '' || (this.proyectoForm.get('frmPlazo').value == null)){
      this.mensaje = MENSAJES.TDR.TITLE_ENTREGABLE;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.TDR.WARNING_ENTREGABLE_PLAZO, true, false, null);
      return false;
    }
    else{
      this.registrar();
    }
  }



  registrar(): void{
  
     

    if (typeof this.dataFrmPrincipal.idEntregable !== "undefined") {
    this.tdrObject = new Tdr();
    this.tdrObject.nombreEntregable = this.proyectoForm.get('frmEntregable').value; 
    this.tdrObject.plazoEntregable = this.proyectoForm.get('frmPlazo').value;
    this.tdrObject.fidModalidad = this.radioButonSimboloSeleccionado.value;
    this.tdrObject.descripcionFormaPago = this.proyectoForm.get('frmFormaPago').value;

    this.tdrObject.fidTdr  = this.dataFrmPrincipal.idTdr;
    
    this.tdrService.editarEntregable(this.dataFrmPrincipal.idEntregable, this.tdrObject)
    .subscribe(
      (wsResponseTdr : WsResponseTdr)=> {
        
        if(wsResponseTdr.codResultado == 1){ 
          this.mensaje = MENSAJES.TDR.INFO_SUCCESS_ENTREGABLE_MODIFICACION;
          this.openDialogMensaje2(MENSAJES.TDR.TITLE_ENTREGABLE, null, this.mensaje ,true, false, "OK");
          this.proyectoForm.get('frmEntregable').setValue('');
          this.proyectoForm.get('frmPlazo').setValue('');
          this.proyectoForm.get('frmFormaPago').setValue('');
         
       
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
    this.tdrObject.nombreEntregable = this.proyectoForm.get('frmEntregable').value; 
    this.tdrObject.plazoEntregable = this.proyectoForm.get('frmPlazo').value;
    this.tdrObject.fidModalidad = this.radioButonSimboloSeleccionado.value;
    this.tdrObject.descripcionFormaPago = this.proyectoForm.get('frmFormaPago').value;
    
    this.tdrObject.fidTdr  = this.dataFrmPrincipal.idTdr;
    
    this.tdrService.registrarEntregable(this.tdrObject)
    .subscribe(
      (wsResponseTdr : WsResponseTdr)=> {
        
        if(wsResponseTdr.codResultado == 1){ 
          this.mensaje = MENSAJES.TDR.INFO_SUCCESS_ENTREGABLE;
          this.openDialogMensaje2(MENSAJES.TDR.TITLE_ENTREGABLE, null, this.mensaje ,true, false, "OK");
          this.proyectoForm.get('frmEntregable').setValue('');
          this.proyectoForm.get('frmPlazo').setValue('');
          this.proyectoForm.get('frmFormaPago').setValue('');
       
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
            valorAccion: "REGISTRO_ENTREGABLE_OK",
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




  formatoFecha_DD_MM_YYYY() : any{

    var d = new Date(),
    month = '' + (d.getMonth() + 1),  
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return day + "-"+month+"-"+year;
  }



  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
   // this.listarObservaciones();
  }

  public  palabraPosicionEntregable(nroEntregable: number){
    if(nroEntregable === 1){
      return "Primer"
    }
    else if(nroEntregable === 2){
      return "Segundo"
    }
    else if(nroEntregable === 3){
      return "Tercer"
    }
    else if(nroEntregable === 4){
      return "Cuarto"
    }
    else if(nroEntregable === 5){
      return "Quinto"
    }
    else if(nroEntregable === 6){
      return "Sexto"
    }
    else if(nroEntregable === 7){
      return "Setimo"
    }
    else if(nroEntregable === 8){
      return "Octavo"
    }
    else if(nroEntregable === 9){
      return "Noveno"
    }
    else if(nroEntregable === 10){
      return "Decimo"
    }
  }

}

interface TdrPk {
  idTdr?: number;
  cantEntregable?: number;
  idEntregable?: number;

}
