import { Component, OnInit, Inject, ViewChild, AfterViewInit, Renderer } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { ItemComboService } from '../../../../../service/item-combo.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material'
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { MENSAJES } from 'app/common';
import { CotizacionService } from '../../../../../service/cotizacion.service';
import { WsResponseCotizacion } from '../../../../../dto/response/Cotizacion';
import { NodeService } from 'app/protected/modules/ups/modules/expediente/services/node.service';

@Component({
  selector: 'app-update-insumo',
  templateUrl: './update-insumo.component.html',
  styleUrls: ['./update-insumo.component.scss']
})
export class UpdateInsumoComponent implements OnInit {

  mensaje: string;
  insumo: Insumo = new Insumo();
  titulo: string;
  dialogRefMessage: MatDialogRef<any>;
  ocultarDescripcion: boolean;
  deshabilitadoUnidad: boolean;
  deshabilitadoCantidad: boolean;
  deshabilitadoPrecio: boolean;
  deshabilitadoParcial: boolean;

  dataItemPartida: any;
  //**********************************************
  cantidadPalabraRecurso: number = 50;

  dataRecursoPartida: any;
  frozenColsdataRecursoPartida: any[];
  scrollableColsdataRecursoPartida: any[];
  //**********************************************

  options: DataPruebaInsumo[] = [
    { id: 1, descripcion: 'ABRAZADERA DE  TUBERIA Ø1.1/2' },
    { id: 1, descripcion: 'ABRAZADERA DE TUBERIA  2' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
    { id: 1, descripcion: 'ACCESORIO DE TERMOFUSION' },
  ];
  existeRecurso: boolean = false;

  filteredOptions: Observable<DataPruebaInsumo[]>;

  constructor(
    private nodeService: NodeService,
    private cotizacionService: CotizacionService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateInsumoComponent>,
    private itemComboService: ItemComboService,
    private renderer: Renderer,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataInsumo
  ) {
  }

  ngOnInit() {
    this.cargarComboPartida();
    this.generarTablaFrozenScrollableRecursoPartida();
    this.cargarDataRecursoPartida();
    if (this.datos.dataTransferInsumo) {
      this.ocultarDescripcion = false;
      this.titulo = "Modificar Recurso";
      this.insumo.unidad = this.datos.dataTransferInsumo.DEC_UNIDAD;
      this.insumo.cantidad = this.datos.dataTransferInsumo.DEC_CANTIDAD;
      this.insumo.precio = this.datos.dataTransferInsumo.DEC_PRECIO;
      this.insumo.parcial = this.datos.dataTransferInsumo.DEC_PARCIAL;
      this.insumo.tipoincidencia = 1;
      this.insumo.sustento = this.datos.dataTransferInsumo.SUSTENTO;
      this.insumo.descripcionSelecion = this.datos.dataTransferInsumo.DESCRIP_UND;

      this.deshabilitadoUnidad = true;
      this.deshabilitadoCantidad = false;
      this.deshabilitadoPrecio = true;
      this.deshabilitadoParcial = true;
    }
  }

  //********* tabla **********************************************************************************
  onMouseEnterTabla(rowData): void {
    rowData.hover = true;
  }
  onMouseLeaveTabla(rowData): void {
    rowData.hover = false;
  }

  generarTablaFrozenScrollableRecursoPartida() {
    this.frozenColsdataRecursoPartida = [
      { field: 'nro', header: 'Nro' },
      { field: 'cantidad', header: 'CANTIDAD' },
    ];
    this.scrollableColsdataRecursoPartida = [
      { field: 'nroPartida', header: 'Nro Partida' },
      { field: 'partida', header: 'PARTIDA' },
      { field: 'avanceFisico', header: '% AVANCE FÍSICO' },
    ];
  }

  public cargarDataRecursoPartida(): void {
    this.cotizacionService.listarCargarEditarRecursoPartida(2020).subscribe(
      (wsResponseCotizacion: WsResponseCotizacion) => {
        if (wsResponseCotizacion.codResultado == 1) {
          this.dataRecursoPartida = (this.datos.dataTransferInsumo) ? wsResponseCotizacion.response : [];// wsResponseCotizacion.response;
          this.generarTablaFrozenScrollableRecursoPartida();
        } else {
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  onEditInitRecursoPartida(event) { console.log("onEditInit", event); }
  onEditCompleteRecursoPartida(event) { console.log("onEditComplete", event); }

  //***************************************************************************************************
  crearRecursoPartida() {

  }

  cargarComboPartida() {
    this.itemComboService.ObtenerListadoPartida().subscribe(dataItem => {
      this.dataItemPartida = dataItem.response
    });
  }
  //**************************

  agregarInsumo() {
    console.log(this.insumo);
    if (this.datos.dataTransferInsumo) {
      this.openDialogMensajeConfirm(MENSAJES.INSUMO.MODIFICAR_INSUMO, true);

      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => {
          this.dialogRef.close(true);
          this.snackBar.open("El insumo ha sido modificado correctamente");

        });
    }
    else {
      this.openDialogMensajeConfirm(MENSAJES.INSUMO.GUARDAR_INSUMO, true);

      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => {
          this.dialogRef.close(true);
          this.snackBar.open("El insumo ha sido registrado correctamente");

        });
    }

  }

  public openDialogMensajeConfirm(message: string, confirmacion: boolean): void {

    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

}

interface DataInsumo {
  dataTransferInsumo?: any
  flag?: any
}

export class Insumo {
  item?: number;
  cidCodigo?: string;
  tipoInsumo?: string;
  cidCodigoPart?: string;
  codigoPart?: number;
  descripcion?: string;
  descripcionSelecion?: string;
  unidad?: string;
  cuadrilla?: string;
  cantidad?: string;
  precio?: string;
  parcial?: string;
  fidPartida?: number;
  tipoincidencia?: number;
  sustento?: string;
}

export interface DataPruebaInsumo {
  id: number;
  descripcion: string;
}
