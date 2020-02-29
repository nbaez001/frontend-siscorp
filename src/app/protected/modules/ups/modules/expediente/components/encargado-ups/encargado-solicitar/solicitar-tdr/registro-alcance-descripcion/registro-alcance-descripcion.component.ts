import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog, PageEvent, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { combineLatest, Observable, of, BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
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
import { AlcanceResponse } from '../../../../../dto/response/AlcanceResponse';
import { WsResponseAlcance } from '../../../../../entities/alcance';


@Component({
  selector: 'app-registro-alcance-descripcion',
  templateUrl: './registro-alcance-descripcion.component.html',
  styleUrls: ['./registro-alcance-descripcion.component.scss']
})
export class RegistroAlcanceDescripcionComponent implements OnInit {

  proyectoForm: FormGroup;
  pagina = 1;
  cantidad = 3;
  total = 0;
  codProyecto: string;

  codPerfil: string;

  // Tabla
  dataSource: MatTableDataSource<Observacion>;
  parametroRequest: ParametroRequest;
  observacionResponse: Observacion[];

  observa: Observacion;
  columnas: string[] = [
    'fecha',
    'alcanceDescripcion',
    'observadoPor'
  ];
  prefijoEstado = PrefijoEstado;
  observado: boolean;
  mensaje: any;
  tdrObject: any;
  tdrAlcance: any;


  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegistroAlcanceDescripcionComponent>,
    private dialog: MatDialog,
    private tdrService: TdrService,
    @Inject(MAT_DIALOG_DATA)
    public dataFrmPrincipal: TdrPk
  ) {
    

    // this.codPerfil = Session.identity.codPerfil; 


  }

  ngOnInit() {
    this.crearFormulario();
    this.cargarAlcance();
    /* this.listarObservaciones();
    (this.datos.cidEstado === "005" 
     || this.datos.cidEstado === "010" || this.datos.cidEstado === "014")
      ? this.observado = true : this.observado = false;  */
  }

  observar(): void {
    let observaroDialog: Object = {
      valorDevolver: "OBSERVAR",

    };

    const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    dialogMessage.componentInstance.message = '¿Está seguro de observar el expediente?';
    dialogMessage.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.dialogRef.close(observaroDialog)
      }
    });

  }


  crearFormulario(): void {
    this.proyectoForm = this.formBuilder.group({
      alcanceDescripcion: [''],
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



  validarRegistro($event) {
    
    $event.preventDefault();
    if (this.proyectoForm.get('alcanceDescripcion').value == '' || (this.proyectoForm.get('alcanceDescripcion').value == null)) {
      this.mensaje = MENSAJES.PREFACTIBILIDAD.TITLE_ALCANCE_DESCRIPCION_SERVICIO;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.PREFACTIBILIDAD.WARNING_ALCANCE_DESCRIPCION_SERVICIO, true, false, null);
      return false;
    } else {
      this.registrar();
    }
  }


  registrar(): void {

    if (typeof this.dataFrmPrincipal.idAlcance !== "undefined") {

      this.tdrObject = new Tdr();
      this.tdrObject.alcance = this.proyectoForm.get('alcanceDescripcion').value;
      this.tdrObject.fidTdr = this.dataFrmPrincipal.idTdr;
      
      this.tdrService.editarAlcance(this.dataFrmPrincipal.idAlcance, this.tdrObject)
        .subscribe(
          (wsResponseTdr: WsResponseTdr) => {
            
            if (wsResponseTdr.codResultado == 1) {
              this.mensaje = MENSAJES.TDR.INFO_SUCCESS_ALCANCE_MODIFICACION;
              this.openDialogMensaje2(MENSAJES.TDR.TITLE_ALCANCE, null, this.mensaje, true, false, "OK");
              this.proyectoForm.get('alcanceDescripcion').setValue('');

              //this.listarObservaciones();
            } else {
              this.mensaje = MENSAJES.ERROR_NOFUNCION;
              // this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);
            }

          },
          error => {
            //  this.isLoading = false;
            this.mensaje = MENSAJES.ERROR_SERVICIO;

          }
        );

    } else {
      this.tdrObject = new Tdr();
      this.tdrObject.alcance = this.proyectoForm.get('alcanceDescripcion').value;
      this.tdrObject.fidTdr = this.dataFrmPrincipal.idTdr;
      
      this.tdrService.registrarAlcance(this.tdrObject)
        .subscribe(
          (wsResponseTdr: WsResponseTdr) => {
            
            if (wsResponseTdr.codResultado == 1) {
              this.mensaje = MENSAJES.TDR.INFO_SUCCESS_ALCANCE;
              this.openDialogMensaje2(MENSAJES.TDR.TITLE_ALCANCE, null, this.mensaje, true, false, "OK");
              this.proyectoForm.get('alcanceDescripcion').setValue('');

              //this.listarObservaciones();
            } else {
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

  cargarAlcance(): void {

    if (typeof this.dataFrmPrincipal.idAlcance !== "undefined") {

      
      this.tdrService.obtenerAlcance(this.dataFrmPrincipal.idAlcance)
        .subscribe(
          (wsResponseAlcance: WsResponseAlcance) => {
            
            if (wsResponseAlcance.codResultado == 1) {
              this.tdrAlcance = wsResponseAlcance.response;
              this.proyectoForm.get('alcanceDescripcion').setValue(this.tdrAlcance.nombre);

              //this.listarObservaciones();
            } else {
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
    title: string,
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
          valorAccion: "REGISTRO_ALCANCE_OK",
        };
        this.dialogRef.close(enviarDataAlPrincipal)
      }


    });
  }




  public openDialogMensaje(
    title: string,
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




  formatoFecha_DD_MM_YYYY(): any {

    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return day + "-" + month + "-" + year;
  }



  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    // this.listarObservaciones();
  }


}

interface TdrPk {
  idTdr?: number;
  idAlcance?: number;

}
