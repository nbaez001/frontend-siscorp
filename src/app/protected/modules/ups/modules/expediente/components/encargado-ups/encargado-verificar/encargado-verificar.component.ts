import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog, PageEvent, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {combineLatest, Observable, of, BehaviorSubject} from 'rxjs';
import {FormControl} from '@angular/forms';
import { Animations } from '@shared/animations';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { Observacion, WsResponseObservacion } from '../../../entities/observacion';
import { PrefijoEstado } from '../../../entities/prefijo-estado';
import { DataSource } from '@angular/cdk/collections';
import { ProyectoService } from '../../../services/proyecto.service';
import { ParametroRequest } from '../../../dto/request/ParametroRequest';
import { MENSAJES } from 'app/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Session } from '@shared/auth/Session';
import { WsApiOutResponse } from '../../../dto/response/WsApiOutResponse';
import { MessageComponent } from '@shared/components/message/message.component';

@Component({
  selector: 'app-encargado-verificar',
  templateUrl: './encargado-verificar.component.html',
  styleUrls: ['./encargado-verificar.component.scss'],
  animations: Animations
})
export class EncargadoVerificarComponent implements OnInit {
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
    'observacion',
    'observadoPor'
  ];
  prefijoEstado = PrefijoEstado;
  observado: boolean;
  mensaje: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EncargadoVerificarComponent>,
    private dialog: MatDialog,
    private proyectoService: ProyectoService,
    @Inject(MAT_DIALOG_DATA)
    public datos: DatosEncargadoVerificar
  ) { 
    
    this.total = datos.total;
    // this.codPerfil = Session.identity.codPerfil; 
    this.cargarTablaObservaciones();
    this.codProyecto = datos.codigoProyecto;

  }

  ngOnInit() {
    this.crearFormulario();
    this.listarObservaciones();
    (this.datos.cidEstado === "013" || this.datos.cidEstado === "014")
      ? this.observado = true : this.observado = false; 
  }




  
  observar(): void{

    if (typeof this.dataSource !== 'undefined' && this.dataSource.data.length > 0) {
   
    let observaroDialog: Object = {
     valorDevolver: "OBSERVAR",
     idProyecto: this.datos.idProyecto
    };

    const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    dialogMessage.componentInstance.message = '¿Está seguro de observar el expediente?';
    dialogMessage.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.dialogRef.close(observaroDialog)  
      }
    });
    
  }else {

    this.mensaje = MENSAJES.PREFACTIBILIDAD.OBSERVACION_REQUERIDA;
    this.openDialogMensaje2(MENSAJES.PREFACTIBILIDAD.TITLE, null, this.mensaje ,true, false, "OK");

  }


}



  public cargarTablaObservaciones(): void {
    if (this.datos.observacionArray  != null && this.datos.observacionArray.length > 0) {
      this.dataSource = new MatTableDataSource(this.datos.observacionArray);
    }
  }

  crearFormulario(): void {
    this.proyectoForm = this.formBuilder.group({
      observacion: [''],
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
    if(this.proyectoForm.get('observacion').value == '' || (this.proyectoForm.get('observacion').value == null)){
      this.mensaje = MENSAJES.PREFACTIBILIDAD.TITLE_OBSERVACIONES;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.PREFACTIBILIDAD.WARNING_OBSERVACIONES, true, false, null);
      return false;
    }else{
      this.registrar();
    }


  }


  registrar(): void{
    this.parametroRequest = new ParametroRequest();
    this.parametroRequest.idProyecto = this.datos.idProyecto;
    this.parametroRequest.observacion = this.proyectoForm.get('observacion').value;
    
    this.proyectoService.registrarObservacionProyecto(this.parametroRequest)
    .subscribe(
      (wsResponseProyecto : WsResponseObservacion)=> {
        
        if(wsResponseProyecto.codResultado == 1){
          this.observacionResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
          this.total = (wsResponseProyecto.total!=0)? wsResponseProyecto.total : 0;
          this.mensaje = MENSAJES.PREFACTIBILIDAD.INFO_SUCCESS_OBSERVACIONES
          this.openDialogMensaje2(MENSAJES.PREFACTIBILIDAD.TITLE_OBSERVACIONES, null, this.mensaje ,true, false, "OK");
          this.proyectoForm.get('observacion').setValue('');
       
          this.listarObservaciones();
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
         // this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);
    
        }
       /*  this.isLoading = false;
        this.disableBuscar = false; */
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




  listarObservaciones() : void {
    this.parametroRequest = new ParametroRequest();
    this.parametroRequest.idProyecto = this.datos.idProyecto;;

    this.proyectoService.listarObservacionesProyecto(this.pagina, this.cantidad,this.parametroRequest)
    .subscribe(
      (wsResponseProyecto : WsResponseObservacion)=> {
        
        if(wsResponseProyecto.codResultado == 1){
          this.datos.observacionArray = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
          this.total = (wsResponseProyecto.total!=0)? wsResponseProyecto.total : 0;
           
          this.cargarTablaObservaciones();
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
         // this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);
    
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

  conformidad(): void{
    let valorDevolver :number = 1;
    let idProyecto = this.datos.idProyecto;
   
    let parametroDialog: Object = {
     valorDevolver: "2",
     idProyecto: this.datos.idProyecto

     };

   const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
   dialogMessage.componentInstance.message = '¿Está seguro de dar conformidad?';
   dialogMessage.afterClosed().subscribe((confirm: boolean) => {
     if (confirm) {
       this.dialogRef.close(parametroDialog)
       
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

  /*
  registrar(): void {
    if (this.proyectoForm.valid) {
      const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
      dialogMessage.componentInstance.message = '¿Está seguro de grabar?';
      dialogMessage.afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          //
        
          let fechaFormato = this.formatoFecha_DD_MM_YYYY();
          console.log('sise : ' + this.datos.arrayObserva);

          this.observa ={ idProyecto: this.datos.arrayObserva.length + 1, fecha: fechaFormato, observacion: this.proyectoForm.get('observacion').value };
          this.datos.arrayObserva.push(this.observa);

          this.empuje.next(this.datos.arrayObserva);
          this.proyectoForm.get('observacion').setValue('');
          //this.datos.arrayObserva = this.datos.arrayObserva;
         // this.llenarDatosArray();
        }
      });
 
    } else {
      Object.values(this.proyectoForm.controls).forEach(c => c.markAsTouched());
    }

  }*/

  llenarDatosArray():void{
    let aux = this.datos.observacionArray;
    for(let i = 0;  i < aux.length; i++){
      this.datos.observacionArray.push(aux[i]);
    }
    //
    console.log('array : ' + this.datos.observacionArray);
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
    this.listarObservaciones();
  }

  devolver() {

    
     let valorDevolver :number = 1;
     let idProyecto = this.datos.idProyecto;
    


     let parametroDialog: Object = {
      valorDevolver: "1",
      idProyecto: this.datos.idProyecto

      };

    const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    dialogMessage.componentInstance.message = '¿Está seguro de devolver el proyecto?';
    dialogMessage.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.dialogRef.close(parametroDialog)
        
      }
    });
  }

}

interface DatosEncargadoVerificar {
  idProyecto?: number;
  cidEstado?:string;
  codigoProyecto?: string;
  observacionArray?: Observacion[];
  total?: number;
}
