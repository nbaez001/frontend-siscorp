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
  selector: 'app-create-update-insumo',
  templateUrl: './create-update-insumo.component.html',
  styleUrls: ['./create-update-insumo.component.scss']
})

export class CreateUpdateInsumoComponent implements OnInit {

  mensaje: string;
  dataItemTipoInsumo: any;
  dataItemCodigo: any;
  insumoForm: FormGroup;
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
  cantidadPalabraRecurso: number = 49;

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
    public dialogRef: MatDialogRef<CreateUpdateInsumoComponent>,
    private itemComboService: ItemComboService,
    private renderer: Renderer,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataInsumo
  ) {
    this.insumoFormulario();
  }

  ngOnInit() {
    this.cargarComboPartida();
    this.busquedaInsumo();
    this.generarTablaFrozenScrollableRecursoPartida();
    this.cargarDataRecursoPartida();
    if (this.datos.dataTransferInsumo) {
      this.ocultarDescripcion = false;
      this.titulo = "Editar Recurso";
      // this.insumo.descripcion = this.datos.dataTransferInsumo.DESCRIP_UND;
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
    } else {
      this.titulo = "Nuevo Recurso"
      this.ocultarDescripcion = true;
      this.deshabilitadoUnidad = false;
      this.deshabilitadoCantidad = false;
      this.deshabilitadoPrecio = false;
      this.deshabilitadoParcial = false;
      this.insumo = new Insumo();
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
      { field: 'partida', header: 'PARTIDA' },
    ];
    this.scrollableColsdataRecursoPartida = [
      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'nombreRecurso', header: 'RECURSO' },
    ];
  }

  public cargarDataRecursoPartida(): void {
    this.cotizacionService.listarCargarRecursoPartida(2020).subscribe(
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

  busquedaInsumo() {
    this.filteredOptions = this.insumoForm.controls['descripcionInsumoFrmCtrl'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descripcion),
      map(descripcion => descripcion ? this._filter(descripcion) : [])
    );
  }

  insumoFormulario() {
    this.insumoForm = this.formBuilder.group({
      descripcionInsumoFrmCtrlSelecion: [''],
      descripcionInsumoFrmCtrl: [''],
      unidadInsumoFrmCtrl: [''],
      cantidadFrmCtrl: [''],
      precioInsumoFrmCtrl: [''],
      parcialInsumoFrmCtrl: [''],
      tipoIncidenciaFrmCtrl: [''],
      sustentoFrmCtrl: [''],
      partidaFrmCtrl: [''],
      recursoPartidaFrmCtrl: [''],
    });
  }

  displayFn(user?: DataPruebaInsumo): string | undefined {
    return user ? user.descripcion : undefined;
  }

  private _filter(descripcion: string): DataPruebaInsumo[] {
    // this.existeRecurso = false;
    this.deshabilitadoUnidad = false;
    this.deshabilitadoCantidad = false;
    this.deshabilitadoPrecio = false;
    const filterValue = descripcion.toLowerCase();
    return this.options.filter(option => option.descripcion.toLowerCase().includes(filterValue));
  }

  get tipoIncidenciaFrmCtrl() { return this.insumoForm.get('tipoIncidenciaFrmCtrl'); }
  get descripcionInsumoFrmCtrl() { return this.insumoForm.get('descripcionInsumoFrmCtrl'); }
  get descripcionInsumoFrmCtrlSelecion() { return this.insumoForm.get('descripcionInsumoFrmCtrlSelecion'); }
  get unidadInsumoFrmCtrl() { return this.insumoForm.get('unidadInsumoFrmCtrl'); }
  get cantidadFrmCtrl() { return this.insumoForm.get('cantidadFrmCtrl'); }
  get precioInsumoFrmCtrl() { return this.insumoForm.get('precioInsumoFrmCtrl'); }
  get parcialInsumoFrmCtrl() { return this.insumoForm.get('parcialInsumoFrmCtrl'); }
  get sustentoFrmCtrl() { return this.insumoForm.get('sustentoFrmCtrl'); }

  onMouseEnterCantidad($event) {
    let suma = parseFloat(this.cantidadFrmCtrl.value) * parseFloat(this.precioInsumoFrmCtrl.value);
    this.parcialInsumoFrmCtrl.setValue(suma);
  }

  onMouseEnterPrecio($event) {
    let suma = parseFloat(this.cantidadFrmCtrl.value) * parseFloat(this.precioInsumoFrmCtrl.value);
    this.parcialInsumoFrmCtrl.setValue(suma);
  }

  //*****************************
  // evaluaInsumo($event) {
    // console.log(this.insumo.descripcion);
    // if (this.existeRecurso === false) {
    //   console.log("nuevoooo");
    // }
    // if (this.insumo.descripcion == "") {
    //   this.openDialogMensajeConfirm(`El recurso ${this.insumo.descripcion} no existe, ¿Desea crear un nuevo recurso?`, true);
    //   this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
    //     this.dialogRef.close(true);
    //     this.renderer.selectRootElement('#focus_unidad').focus();
    //     this.deshabilitadoUnidad = false;
    //     this.deshabilitadoCantidad = false;
    //     this.deshabilitadoPrecio = false;
    //   });
    // }
  // }

  limpiaInsumo(event) {
    if (event.target.value.length == 0) {
      this.unidadInsumoFrmCtrl.setValue("");
      this.cantidadFrmCtrl.setValue("");
      this.precioInsumoFrmCtrl.setValue("");
      this.parcialInsumoFrmCtrl.setValue("");
    }
  }

  dataTransferInsumo: any;
  obtenerDatosInsumo($event) {
    console.log($event.option.value);
    // this.existeRecurso = true;
    if ($event.option.value != undefined) {
      this.openDialogMensajeConfirm(`El recurso ${$event.option.value.descripcion} existe en el proyecto, ¿Desea modificarlo?`, true);
      this.insumo.descripcion = "";
      this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
        this.dialogRef.close(true);
        this.nodeService.obtenerInsumo().then(files => {
          const dialogReg: MatDialogRef<CreateUpdateInsumoComponent> = this.dialog.open(CreateUpdateInsumoComponent, {
            disableClose: true,
            panelClass: 'dialog-no-padding',
            width: '50%',
            autoFocus: false,
            data: {
              dataTransferInsumo: files[0],
              flag: 1
            }
          });
          dialogReg.afterClosed().pipe(filter(r => !!r)).subscribe(() => {

          });
        });
      });
     
    }
    // else {
    //   // console.log(this.insumo.descripcion);
    //   // this.insumo.descripcion="nuevo datooo";
    //   this.renderer.selectRootElement('#focus_unidad').focus();
    //   this.deshabilitadoUnidad = false;
    //   this.deshabilitadoCantidad = false;
    //   this.deshabilitadoPrecio = false;
    //   // this.unidadInsumoFrmCtrl.setValue("pz.");
    //   // this.cantidadFrmCtrl.setValue("4.00");
    //   // this.precioInsumoFrmCtrl.setValue("2.50");
    //   // this.parcialInsumoFrmCtrl.setValue("10.00");
    // }
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
