import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog, PageEvent, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { MENSAJES } from 'app/common';
import { MessageComponent } from '@shared/components/message/message.component';
import { Observacion } from 'app/protected/modules/ups/modules/expediente/entities/observacion';
import { ParametroRequest } from 'app/protected/modules/ups/modules/expediente/dto/request/ParametroRequest';
import { PrefijoEstado } from 'app/protected/modules/tickets-intervenciones/entities/prefijo-estado';
import { ProyectoService } from 'app/protected/modules/ups/modules/expediente/services/proyecto.service';
import { CotizacionService } from '../../../../../service/cotizacion.service';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resumen-confirmacion',
  templateUrl: './resumen-confirmacion.component.html',
  styleUrls: ['./resumen-confirmacion.component.scss']
})
export class ResumenConfirmacionComponent implements OnInit {
  proyectoForm: FormGroup;
  pagina = 1;
  cantidad = 3;
  total = 0;
  codProyecto: string;
  codPerfil: string;

  dialogRefMessage: MatDialogRef<any>;

  // Tabla
  dataSource: MatTableDataSource<any>;
  parametroRequest: ParametroRequest;
  resumenResponse: any[];
  observa: Observacion;
  columnas: string[] = [
    'rubro',
    'montoSolicitado'
  ];
  prefijoEstado = PrefijoEstado;
  observado: boolean;
  mensaje: any;
  mensajeConfirmacion: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ResumenConfirmacionComponent>,
    private dialog: MatDialog,
    private proyectoService: ProyectoService,
    private cotizacionService: CotizacionService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    @Inject(MAT_DIALOG_DATA)
    public dataArray: DataInsumo
  ) {
    this.cargarTablaResumen();
  }

  ngOnInit() {
    this.mensajeConfirmacion = "¿Está seguro de finalizar el registro de la autorización de gasto?"
    this.listarResumen();
  }

  public opcionOK() {
    this.dialogRef.close(0);
  }

  public opcionSI() {
    this.openDialogMensajeConfirm("¿Desea sustentar la Autorización de Gasto?", true);
    this.dialogRefMessage.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.dialogRef.close();
        // enviar modal de sustentar
        // let idProyectoEncriptado = btoa(this.dataArray.idProyecto + "");
        // this.router.navigate(['/ups/autorizacion/requerimiento', { idProy: idProyectoEncriptado }]);
      } else {
        this.dialogRef.close();
      }
    });
  }

  public openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

  public opcionNO() {
    let valor = "cerrado";
    this.dialogRef.close(valor);
  }

  onDialogClose(): void {
    this.dialogRef.close(null);
  }

  public cargarTablaResumen(): void {
    if (this.resumenResponse != null && this.resumenResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.resumenResponse);
    }
  }

  listarResumen(): void {
    this.parametroRequest = new ParametroRequest();
    //this.parametroRequest.idProyecto = this.datos.idProyecto;;

    this.cotizacionService.listarResumenAutorizacion(this.pagina, this.cantidad, this.parametroRequest)
      .subscribe(
        (wsResponseProyecto: any) => {

          if (wsResponseProyecto.codResultado == 1) {
            this.resumenResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];


            this.cargarTablaResumen();
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
          }
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
        }
      );
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

}

interface DataInsumo {
  arregloCantidadModificada?: any[];
  idProyecto: number;
}

export interface DialogData {
  title: string;
  message: string;
  message2: string;
  alerta: boolean;
  confirmacion: boolean;
  valor: any;
}



