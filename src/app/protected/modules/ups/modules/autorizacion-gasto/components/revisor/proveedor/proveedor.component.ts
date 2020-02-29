import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialogRef, MatDialog, PageEvent, MatSnackBar } from '@angular/material';
import { WsResponseProyecto } from '../../../dto/response/Proyecto';
import { TrabajadorService } from '../../../service/trabajador.service';
import * as _moment from 'moment';
import { MENSAJES } from 'app/common';
import { ProveedorRequest } from '../../../dto/request/ProveedorRequest';
import { CreateUpdateProveedorComponent } from './crud-proveedor/create-update-proveedor/create-update-proveedor.component';
import { filter } from 'rxjs/operators';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { AdjuntarCotizacionComponent } from './adjuntar-cotizacion/adjuntar-cotizacion.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss']
})
export class ProveedorComponent implements OnInit {

  filtrosForm: FormGroup;

  pagina = 1;
  cantidad = 2;
  total = 0;

  listTipoDocumento: any[];
  listRubro: any[];

  filtrosProveedorRequest: ProveedorRequest = new ProveedorRequest();

  // Tabla
  dataSource: MatTableDataSource<any>;
  wsResponseProyecto: WsResponseProyecto;
  proyectoResponse: any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dialogRefMessage: MatDialogRef<any>;

  isLoading: boolean;
  columnas: string[] = [];
  mensaje: string;
  disableBuscar: boolean;

  constructor(
    private dialog: MatDialog,
    private trabajadorService: TrabajadorService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.crearFiltrosForm();
    this.generarCabeceraColumnas();
    this.cargarCombos();
    this.cargarProveedor();
  }

  // **************** BANDEJA ****************
  public cargarTablaProveedor(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

  public cargarProveedor(): void {

    this.dataSource = null;
    this.disableBuscar = true;
    this.proyectoResponse = [];
    this.isLoading = true;

    this.trabajadorService.obtenerListadoProveedor(this.pagina, this.cantidad, this.filtrosProveedorRequest)
      .subscribe(
        (wsResponseProyecto: WsResponseProyecto) => {
          if (wsResponseProyecto.codResultado == 1) {
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
            this.cargarTablaProveedor();
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            //this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);     
          }
          this.isLoading = false;
          this.disableBuscar = false;
        },
        error => {
          console.error(error);
        }
      );
  }

  generarCabeceraColumnas(): void {
    this.columnas = [
      'nro',
      'nombreRazonSocial',
      'nombreTipoDocumento',
      'numeroDocumento',
      'nombreTipoRubro',
      'acciones'
    ];
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarProveedor();
  }

  // ****************  FILTROS  ****************
  crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
      nombreRazonSocialFrmCtrl: new FormControl(null),
      comboTipoDocumentoFrmCtrl: new FormControl(null),
      numeroDocumentoFrmCtrl: new FormControl(null),
      comboTipoRubroFrmCtrl: new FormControl(null)
    });
  }
  get nombreRazonSocialFrmCtrl() { return this.filtrosForm.get('nombreRazonSocialFrmCtrl'); }
  get comboTipoDocumentoFrmCtrl() { return this.filtrosForm.get('comboTipoDocumentoFrmCtrl'); }
  get numeroDocumentoFrmCtrl() { return this.filtrosForm.get('numeroDocumentoFrmCtrl'); }
  get comboTipoRubroFrmCtrl() { return this.filtrosForm.get('comboTipoRubroFrmCtrl'); }

  cargarCombos() {
    this.trabajadorService.obtenerTipoDocumento().subscribe(data => {
      this.listTipoDocumento = data.response;
    });
    this.trabajadorService.obtenerRubro().subscribe(data => {
      this.listRubro = data.response;
    });
  }

  public guardarFiltrosBusqueda(): void {
    this.filtrosProveedorRequest.nombreRazonSocial = this.nombreRazonSocialFrmCtrl.value;
    this.filtrosProveedorRequest.idTipoDocumento = this.comboTipoDocumentoFrmCtrl.value;
    this.filtrosProveedorRequest.numeroDocumento = this.numeroDocumentoFrmCtrl.value;
    this.filtrosProveedorRequest.idTipoRubro = this.comboTipoRubroFrmCtrl.value;
  }

  public filtrarProveedor($event): void {
    $event.preventDefault();
    this.guardarFiltrosBusqueda();
    this.cargarProveedor();
  }

  reiniciar() {
    this.filtrosForm.reset('');
    this.filtrosProveedorRequest = new ProveedorRequest();
    this.cargarProveedor();
  }

  // **************** PROVEEDOR ******************
  modalProveedor(idCodigo: number, bloqueaCampo: boolean = false) {
    if (idCodigo) {
      this.trabajadorService.obtenerProveedor(idCodigo).subscribe(data => {
        const dialogReg: MatDialogRef<CreateUpdateProveedorComponent> = this.dialog.open(CreateUpdateProveedorComponent, {
          panelClass: 'dialog-no-padding',
          width: '40%',
          height: '75%',
          disableClose: true,
          data: {
            dataProveedor: data.response,
            bloqueaCampo: bloqueaCampo
          }
        });
        dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {
          this.cargarProveedor();
        });
      });
    } else {
      const dialogReg: MatDialogRef<CreateUpdateProveedorComponent> = this.dialog.open(CreateUpdateProveedorComponent, {
        panelClass: 'dialog-no-padding',
        width: '40%',
        height: '75%',
        disableClose: true,
        data: {
          bloqueaCampo: bloqueaCampo
        }
      });
      dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {
        this.cargarProveedor();
      });
    }
  }

  eliminarProveedor(idCodigo: number, proveedor: string) {
    this.openDialogMensajeConfirm("¿Está seguro de eliminar al proveedor " + proveedor + '?', true);
    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open("Proveedor " + proveedor + " eliminado");
        this.cargarProveedor();
      });
  }

  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

  adjuntarCotizacionProveedor(idCodigo: number) {
    this.trabajadorService.adjuntarCotizacionProveedor(idCodigo).subscribe(data => {
      const dialogReg: MatDialogRef<AdjuntarCotizacionComponent> = this.dialog.open(AdjuntarCotizacionComponent, {
        panelClass: 'dialog-no-padding',
        width: '40%',
        height: '85%',
        disableClose: true,
        data: {
          dataAdjuntarCotizacion: data.response,
        }
      });
    });
  }

}
