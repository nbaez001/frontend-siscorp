import { Component, OnInit } from '@angular/core';
import { ItemComboService } from '../../../service/item-combo.service';
import { FormGroup, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { WsResponseProyecto } from '../../../dto/response/Proyecto';
import { ProyectoEjecucionService } from '../../../service/proyecto-ejecucion.service';
import { MENSAJES } from 'app/common';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { AuthService } from 'app/protected/services/auth.service';

@Component({
  selector: 'app-bandeja-pendiente',
  templateUrl: './bandeja-pendiente.component.html',
  styleUrls: ['./bandeja-pendiente.component.scss']
})
export class BandejaPendienteComponent implements OnInit {

  filtrosForm: FormGroup;
  filtrosRequest: busquedaRequest = new busquedaRequest();
  dataItemTipoDocumento: any;
  dataItemEstado: any;

  pagina = 1;
  cantidad = 2;
  total = 0;

  columnas: string[] = [];
  dataSource: MatTableDataSource<any>;
  wsResponseProyecto: WsResponseProyecto;
  proyectoResponse: any[];
  disableBuscar: boolean;
  isLoading: boolean;
  mensaje: string;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private itemComboService: ItemComboService,
    private proyectoEjecucionService: ProyectoEjecucionService,
  ) { }

  ngOnInit() {
    this.tituloBandejaProyecto();
    this.crearFiltrosForm();
    this.cargaCombos();
    this.generarCabeceraColumnas();
    this.cargarDataBandejaPendiente();
  }

  tituloBandejaProyecto() {
    this.authService.cabecera.next({
      titulo: 'BANDEJA DOCUMENTOS PENDIENTES',
      icono: ''
    });
  }

  ngOnDestroy() {
    this.authService.cabecera.next({
      titulo: '',
      icono: ''
    });
  }

  cargaCombos() {
    this.itemComboService.obtenerTipoDocumentoTambo().subscribe(data => {
      this.dataItemTipoDocumento = data.response;
    });
    this.itemComboService.obtenerEstadoTambo().subscribe(data => {
      this.dataItemEstado = data.response;
    });
  }

  generarCabeceraColumnas(): void {
    this.columnas = [
      'item',
      'nombreTipoDocumento',
      'nroDocumento',
      'fechaRecepcion',
      'nombreEstado',
      'acciones'
    ];
  }

  crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
      tipoDocumentoFrmCtrl: new FormControl(null),
      estadoFrmCtrl: new FormControl(null),
      fechaDesdeFrmCtrl: new FormControl(null),
      fechaHastaFrmCtrl: new FormControl(null),
    });
  }

  get tipoDocumentoFrmCtrl() { return this.filtrosForm.get('tipoDocumentoFrmCtrl'); }
  get estadoFrmCtrl() { return this.filtrosForm.get('estadoFrmCtrl'); }
  get fechaDesdeFrmCtrl() { return this.filtrosForm.get('fechaDesdeFrmCtrl'); }
  get fechaHastaFrmCtrl() { return this.filtrosForm.get('fechaHastaFrmCtrl'); }

  public guardarFiltrosBusqueda(): void {
    this.filtrosRequest.tipoDocumentoFrmCtrl = +this.tipoDocumentoFrmCtrl.value;
    this.filtrosRequest.estadoFrmCtrl = + this.estadoFrmCtrl.value;
    this.filtrosRequest.fechaDesdeFrmCtrl = this.fechaDesdeFrmCtrl.value !== null ? _moment(this.fechaDesdeFrmCtrl.value).format('DD-MM-YYYY') : null;
    this.filtrosRequest.fechaHastaFrmCtrl = this.fechaHastaFrmCtrl.value !== null ? _moment(this.fechaHastaFrmCtrl.value).format('DD-MM-YYYY') : null;
  }

  buscarFiltros($event): void {
    $event.preventDefault();
    this.guardarFiltrosBusqueda();
    this.cargarDataBandejaPendiente();
  }

  public cargarTablaBandejaPendiente(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

  public cargarDataBandejaPendiente(): void {
    this.dataSource = null;
    this.disableBuscar = true;
    this.proyectoResponse = [];
    this.isLoading = true;
    this.proyectoEjecucionService.listadoBandejaPendiente(this.pagina, this.cantidad, this.filtrosRequest).subscribe(
      (wsResponseProyecto: WsResponseProyecto) => {
        if (wsResponseProyecto.codResultado == 1) {
          this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
          this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
          this.cargarTablaBandejaPendiente();
        } else {
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          this.openDialogMensaje(this.mensaje, wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);
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

  reiniciar() {
    this.filtrosForm.reset('');
    this.filtrosRequest = null;
    this.filtrosRequest = new busquedaRequest();
    this.cargarDataBandejaPendiente();
  }

  public openDialogMensaje(
    message: string,
    message2: string,
    alerta: boolean,
    confirmacion: boolean,
    valor: any
  ): void {
    const dialogRef = this.dialog.open(InfoMessageComponent, {
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
        if (valor == "1") {
          this.reiniciar();
          this.filtrosRequest = null;
          this.filtrosRequest = new busquedaRequest();
          this.cargarDataBandejaPendiente();
        }
      }
    });
  }

}

export class busquedaRequest {
  tipoDocumentoFrmCtrl?: number;
  estadoFrmCtrl?: number;
  fechaDesdeFrmCtrl?: string;
  fechaHastaFrmCtrl?: string;
}
