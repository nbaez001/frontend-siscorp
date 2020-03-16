import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatDialogRef, MatDialog, PageEvent } from '@angular/material';
import { AuthService } from 'app/protected/services/auth.service';
import { ArchivoExpedienteService } from '../../service/archivo-expediente.service';
import * as _moment from 'moment';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { WsResponse } from '../../dto/archivo-pendiente';
import { MENSAJES } from 'app/common';
import { AdjuntarArchivoExpedienteComponent } from './adjuntar-archivo-expediente/adjuntar-archivo-expediente.component';
import { TrabajadorService } from '../../../autorizacion-gasto/service/trabajador.service';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-bandeja-archivo-expediente',
  templateUrl: './bandeja-archivo-expediente.component.html',
  styleUrls: ['./bandeja-archivo-expediente.component.scss']
})
export class BandejaArchivoExpedienteComponent implements OnInit {

  filtrosForm: FormGroup;
  filtrosRequest: busquedaRequest = new busquedaRequest();
  dataItemCrp: any;
  dataItemEstado: any;

  pagina = 1;
  cantidad = 10;
  total = 0;

  columnas: string[] = [];
  dataSource: MatTableDataSource<any>;
  dataArchivoExpedienteResponse: any[];
  disableBuscar: boolean;
  isLoading: boolean;
  mensaje: string;

  dialogRefMessage: MatDialogRef<any>;

  constructor(
    private trabajadorService: TrabajadorService,
    private dialog: MatDialog,
    private authService: AuthService,
    private archivoExpedienteService: ArchivoExpedienteService,
  ) { }

  ngOnInit() {
    this.tituloBandejaProyecto();
    this.crearFiltrosForm();
    this.cargaCombos();
    this.generarCabeceraColumnas();
    this.cargarDataBandejaArchivoExpediente();
  }

  tituloBandejaProyecto() {
    this.authService.cabecera.next({
      titulo: 'BANDEJA ARCHIVOS EXPEDIENTE TÉCNICO',
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
    this.archivoExpedienteService.obtenerCrpProyecto().subscribe(data => {
      this.dataItemCrp = data.response;
    });
    this.archivoExpedienteService.obtenerEstadoTambo().subscribe(data => {
      this.dataItemEstado = data.response;
    });
  }

  generarCabeceraColumnas(): void {
    this.columnas = [
      'item',
      'nombreTambo',
      'snip',
      'nroConvenio',
      'crp',
      'cantidadArchivos',
      'estado',
      'acciones'
    ];
  }

  crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
      nombreTamboFrmCtrl: new FormControl(null),
      snipFrmCtrl: new FormControl(null),
      crpFrmCtrl: new FormControl(null),
      estadoFrmCtrl: new FormControl(null),
    });
  }

  get nombreTamboFrmCtrl() { return this.filtrosForm.get('nombreTamboFrmCtrl'); }
  get snipFrmCtrl() { return this.filtrosForm.get('snipFrmCtrl'); }
  get crpFrmCtrl() { return this.filtrosForm.get('crpFrmCtrl'); }
  get estadoFrmCtrl() { return this.filtrosForm.get('estadoFrmCtrl'); }

  public guardarFiltrosBusqueda(): void {
    this.filtrosRequest.nombreTambo = this.nombreTamboFrmCtrl.value;
    this.filtrosRequest.snip = this.snipFrmCtrl.value;
    this.filtrosRequest.crp = +this.crpFrmCtrl.value;
    this.filtrosRequest.estado = + this.estadoFrmCtrl.value;
  }

  buscarFiltros($event): void {
    $event.preventDefault();
    this.guardarFiltrosBusqueda();
    this.cargarDataBandejaArchivoExpediente();
  }

  public cargarTablaBandejaPendiente(): void {
    if (this.dataArchivoExpedienteResponse != null && this.dataArchivoExpedienteResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.dataArchivoExpedienteResponse);
    }
  }

  public cargarDataBandejaArchivoExpediente(): void {
    this.dataSource = null;
    this.disableBuscar = true;
    this.dataArchivoExpedienteResponse = [];
    this.isLoading = true;
    this.archivoExpedienteService.listadoBandejaPendiente(this.pagina, this.cantidad, this.filtrosRequest).subscribe((wsResponse: WsResponse) => {
      if (wsResponse.codResultado == 1) {
        this.dataArchivoExpedienteResponse = (wsResponse.response != null) ? wsResponse.response : [];
        this.total = (wsResponse.total != 0) ? wsResponse.total : 0;
        this.cargarTablaBandejaPendiente();
      } else {
        this.openDialogMensaje(MENSAJES.ERROR_SERVICIO, true);
      }
      this.isLoading = false;
      this.disableBuscar = false;
    }
    );
  }

  reiniciar() {
    this.filtrosForm.reset('');
    this.filtrosRequest = null;
    this.filtrosRequest = new busquedaRequest();
    this.cargarDataBandejaArchivoExpediente();
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarDataBandejaArchivoExpediente();
  }

  public openDialogMensaje(message: string, alerta: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, alerta: alerta }
    });
  }

  adjuntarArchivos(idProyecto: number): void {
    const dialogReg: MatDialogRef<AdjuntarArchivoExpedienteComponent> = this.dialog.open(AdjuntarArchivoExpedienteComponent, {
      disableClose: true,
      width: '1000px',
      autoFocus: false,
      data: {
        idProyecto: 21277//idProyecto
      },
    });
  }

  JASPER() {
    this.trabajadorService.generaReporteTareo().subscribe(response => {
      const dialogRef = this.dialog.open(PdfViewerComponent, {
        disableClose: true,
        width: '90%',
        data: { titulo: '', dataBlob: response }
      });
    });
  }

}

export class busquedaRequest {
  nombreTambo?: string;
  snip?: string;
  crp?: number;
  estado?: number;
}
