import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, PageEvent, MatDialog, MatSnackBar } from '@angular/material';
import { TrabajadorPagoMensualRequest } from '../../../../dto/request/TrabajadorPagoMensualRequest';
import { TrabajadorService } from '../../../../service/trabajador.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WsResponseProyecto } from '../../../../dto/response/Proyecto';
import { MENSAJES } from 'app/common';
import * as _moment from 'moment';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-calculo-pago',
  templateUrl: './calculo-pago.component.html',
  styleUrls: ['./calculo-pago.component.scss']
})
export class CalculoPagoComponent implements OnInit {

  listTipo: any[];
  listPeriodoAnio: any[];
  listPeriodoMes: any[];
  proyectoForm: FormGroup;
  trabajadorPagoMensual: TrabajadorPagoMensualRequest = new TrabajadorPagoMensualRequest();

  dialogRefMessage: MatDialogRef<any>;
  // Tabla
  pagina = 1;
  cantidad = 2;
  total = 0;

  isLoading: boolean;
  columnas: string[] = [];
  mensaje: string;

  dataSource: MatTableDataSource<any>;
  wsResponseProyecto: WsResponseProyecto;
  proyectoResponse: any[];
  objproyectoResponse: any;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private trabajadorService: TrabajadorService,
    public dialogRef: MatDialogRef<CalculoPagoComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataTrabajador
  ) {
    this.formulario();
  }

  ngOnInit() {
    this.cargarCombos();
    this.generarCabeceraColumnas();
    this.cargarCalculoPagoMensual();
    if (this.datos.dataPagoMensualTrabajador) {
      this.trabajadorPagoMensual = this.datos.dataPagoMensualTrabajador[0];
      console.log(this.trabajadorPagoMensual);

    }
  }

  cargarCombos() {
    this.trabajadorService.obtenerTipoTrabajador().subscribe(data => {
      this.listTipo = data.response
    });
    this.trabajadorService.obtenerPeriodoAnio().subscribe(data => {
      this.listPeriodoAnio = data.response
    });
    this.trabajadorService.obtenerPeriodoMes().subscribe(data => {
      this.listPeriodoMes = data.response
    });
  }

  formulario() {
    this.proyectoForm = this.formBuilder.group({
      idTipo: [''],
      nombreApellido: [''],
      concepto: [''],
      fecha: [''],
      autorizacionAnterior: [''],
      periodoAnio: [''],
      periodoMes: [''],
      tipoPago:[''],
      diasDelMes: [''],
      diasAsistidos: [''],
      factor: [''],
      penalidad: [''],
      diasDeRetraso: [''],
      montoEjecucion: [''],
      avanceDelMes: [''],
      montoBruto: [''],
      penalidadFormula: [''],
      montoNeto: [''],
      observacion: [''],
    });
  }

  // **************** BANDEJA ****************
  public cargarTablaCalculoPagoMensual(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

  public cargarCalculoPagoMensual(): void {

    this.dataSource = null;
    this.proyectoResponse = [];
    this.isLoading = true;

    this.trabajadorService.obtenerListadoCalculoPagoMensual(this.pagina, this.cantidad, "")
      .subscribe(
        (wsResponseProyecto: WsResponseProyecto) => {
          if (wsResponseProyecto.codResultado == 1) {
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
            this.cargarTablaCalculoPagoMensual();
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            //this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);     
          }
          this.isLoading = false;
        },
        error => {
          console.error(error);
        }
      );
  }

  generarCabeceraColumnas(): void {
    this.columnas = [
      'nro',
      'concepto',
      'montoBruto',
      'penalidadFormula',
      'montoNeto',
      'avanceDelMes',
      'acciones'
    ];
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarCalculoPagoMensual();
  }
  //--------------------------------------

  guardarCalculoPagoMensual() {
    this.trabajadorPagoMensual.fecha = _moment(this.proyectoForm.get('fecha').value).format('DD-MM-YYYY');
    console.log(this.trabajadorPagoMensual);

    if (this.trabajadorPagoMensual.idCodigoPagoMensual) {
      console.log("actualiza");
    } else {
      console.log("inserta");
    }

    this.resetFormulario();
    this.cargarCalculoPagoMensual();

  }

  obtenerCalculoPagoMensual(idCodigo: number) {
    this.trabajadorService.obtenerCalculoPagoMensual(idCodigo).subscribe(
      (wsResponseProyecto: WsResponseProyecto) => {
        if (wsResponseProyecto.codResultado == 1) {
          this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
          this.trabajadorPagoMensual = this.proyectoResponse[0];
          this.proyectoForm.get('fecha').setValue(this.retornaFecha(this.trabajadorPagoMensual.fecha));
        }
      },
      error => {
        console.error(error);
      });
  }

  retornaFecha(fecha: string) {
    return new Date(`${fecha}T23:00`);
  }

  eliminarCalculoPagoMensual(idCodigo: number, data: string) {
    this.openDialogMensajeConfirm("¿Está seguro de eliminar " + data + '?', true);
    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open("Cálculo Pago " + data + " eliminado");
        this.cargarCalculoPagoMensual();
      });
  }

  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

  resetFormulario() {
    this.proyectoForm.get('concepto').setValue("");
    this.proyectoForm.get('fecha').setValue(null);
    this.proyectoForm.get('autorizacionAnterior').setValue("");
    this.proyectoForm.get('periodoMes').setValue("");
    this.proyectoForm.get('periodoAnio').setValue("");
    this.proyectoForm.get('diasDelMes').setValue("");
    this.proyectoForm.get('diasAsistidos').setValue("");
    this.proyectoForm.get('factor').setValue("");
    this.proyectoForm.get('penalidad').setValue("");
    this.proyectoForm.get('diasDeRetraso').setValue("");
    this.proyectoForm.get('montoEjecucion').setValue("");
    this.proyectoForm.get('avanceDelMes').setValue("");
    this.proyectoForm.get('montoBruto').setValue("");
    this.proyectoForm.get('penalidadFormula').setValue("");
    this.proyectoForm.get('montoNeto').setValue("");
    this.proyectoForm.get('observacion').setValue("");
  }

  // **************** REPORTE ****************
  verCalculoPagoMensual(idCodigo: number) {
    this.trabajadorService.generaCalculoPagoMensual().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
    });
  }

}

interface DataTrabajador {
  dataPagoMensualTrabajador?: any
}

