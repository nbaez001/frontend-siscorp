import { Component, OnInit, Inject, ViewChild, AfterViewInit, Renderer } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { ItemComboService } from '../../../../../service/item-combo.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material'
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { MENSAJES } from 'app/common';
import { CotizacionService } from '../../../../../service/cotizacion.service';
import { WsResponseCotizacion } from '../../../../../dto/response/Cotizacion';
import { NodeService } from 'app/protected/modules/ups/modules/expediente/services/node.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
  deshabilitadoUnidad: boolean;
  deshabilitadoCantidad: boolean;
  deshabilitadoPrecio: boolean;
  deshabilitadoParcial: boolean;
  insumoForm: FormGroup;
  //**********************************************
  cantidadPalabraRecurso: number = 50;
  dataRecursoPartida: any;
  frozenColsdataRecursoPartida: any[];
  scrollableColsdataRecursoPartida: any[];
  //**********************************************
  numeroItemMemoria: number = 1;
  existeRecurso: boolean = false;
  optionsPartida: DataAutocompletePartida[] = [];
  filteredOptionsPartida: Observable<DataAutocompletePartida[]>;

  dataNuevaDataRecurso: nuevaDataRecurso[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private cotizacionService: CotizacionService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateInsumoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataInsumo
  ) {
    this.cargaAutocompletePartida(this.datos.idProyecto);
  }

  ngOnInit() {
    this.generarTablaFrozenScrollableRecursoPartida();
    this.cargarDataRecursoPartida();
    this.insumoFormulario();
    this.busquedaPartida();
    this.titulo = "Modificar Recurso";
    this.insumo.idRecurso = this.datos.dataInsumoSelected.idCodigo;
    this.insumo.descripcionSelecion = (this.datos.flag == 1) ? this.datos.dataInsumoSelected.recurso : this.datos.dataInsumoSelected.cidNombre;
    this.insumo.unidad = this.datos.dataInsumoSelected.unidad;
    this.insumo.cantidad = this.datos.dataInsumoSelected.cantidad;
    this.insumo.precio = this.datos.dataInsumoSelected.precio;
    this.insumo.parcial = this.datos.dataInsumoSelected.parcial;
    // "idCategoria": this.idCategoriaFrmCtrl.value,
    // this.insumo.tipoincidencia = 1;
    this.deshabilitadoUnidad = true;
    this.deshabilitadoCantidad = false;
    this.deshabilitadoPrecio = true;
    this.deshabilitadoParcial = true;
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
          this.dataRecursoPartida = (this.datos.dataInsumoSelected) ? wsResponseCotizacion.response : [];// wsResponseCotizacion.response;
          this.generarTablaFrozenScrollableRecursoPartida();
          console.log(this.dataRecursoPartida);
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

  //************************************* PARTIDA *************************************
  cargaAutocompletePartida(idProyecto: number) {
    this.cotizacionService.listarAutocompletePartida(idProyecto).subscribe(data => {
      this.optionsPartida = data.response;
    });
  }

  busquedaPartida() {
    this.filteredOptionsPartida = this.insumoForm.controls['partidaFrmCtrl'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descripcion),
      map(descripcion => descripcion ? this._filterPartida(descripcion) : [])
    );
  }

  private _filterPartida(descripcion: string): DataAutocompletePartida[] {
    const filterValue = descripcion.toLowerCase();
    return this.optionsPartida.filter(option => option.cidNombre.toLowerCase().includes(filterValue));
  }

  displayFnPartida(user?: DataAutocompletePartida): string | undefined {
    return user ? user.cidNombre : undefined;
  }

  obtenerDatosRecurso($event) {
    if ($event.option.value != undefined) {
      this.partidaFrmCtrl.value.idCodigo = $event.option.value.idCodigo;
      this.partidaFrmCtrl.value.cidCodigo = $event.option.value.cidCodigo;
      this.partidaFrmCtrl.value.cidNombre = $event.option.value.cidNombre;
    }
  }

  //************************************* TABLA TEMPORAL **************************************
  insumoFormulario() {
    this.insumoForm = this.formBuilder.group({
      partidaFrmCtrl: ['', [Validators.required]],
    });
  }

  get partidaFrmCtrl() { return this.insumoForm.get('partidaFrmCtrl'); }

  crearRecursoPartidaTemporal() {
    console.log(this.partidaFrmCtrl.value);
    (this.dataRecursoPartida.length == 0) ? this.numeroItemMemoria = 1 : this.numeroItemMemoria = this.dataRecursoPartida.length + 1;
    this.dataRecursoPartida.push(
      {
        "nro": this.numeroItemMemoria,
        "idCategoria": 0,//falta
        "idRecurso": this.insumo.idRecurso,
        "nombreRecurso": this.insumo.descripcionSelecion,
        "unidad": this.insumo.unidad,
        "cantidad": this.insumo.cantidad,
        "precio": this.insumo.precio,
        "parcial": this.insumo.parcial,
        "partida": this.partidaFrmCtrl.value.cidNombre,
        "nroPartida": this.partidaFrmCtrl.value.cidCodigo,
        "idPartida": this.partidaFrmCtrl.value.idCodigo,
        "avanceFisico": "50%",//falta
        "flagAvance": 0,//falta

      }
    );
    console.log(this.dataRecursoPartida);
  }

  //******************************************************************************
  agregarInsumo() {
    this.openDialogMensajeConfirm(MENSAJES.INSUMO.MODIFICAR_INSUMO, true);
    this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
      // this.spinner.show();
      this.dataRecursoPartida.forEach(element => {
        this.dataNuevaDataRecurso.push(
          {
            "idCategoria": +element.idCategoria,
            "idRecurso": +element.idRecurso,
            "nombreRecurso": element.nombreRecurso,
            "unidad": element.unidad,
            "cantidad": +element.cantidad,
            "precio": element.precio,
            "parcial": element.parcial,
            "idPartida": element.idPartida,
            "avanceFisico": element.avanceFisico
          }
        );
      });
      console.log(this.dataNuevaDataRecurso);

      // this.dialogRef.close(true);
      // this.snackBar.open("El insumo ha sido modificado correctamente");

    });


    // if (this.datos) {
    //   this.openDialogMensajeConfirm(MENSAJES.INSUMO.MODIFICAR_INSUMO, true);

    //   this.dialogRefMessage.afterClosed()
    //     .pipe(filter(verdadero => !!verdadero))
    //     .subscribe(() => {
    //       this.dialogRef.close(true);
    //       this.snackBar.open("El insumo ha sido modificado correctamente");

    //     });
    // }
    // else {
    //   this.openDialogMensajeConfirm(MENSAJES.INSUMO.GUARDAR_INSUMO, true);

    //   this.dialogRefMessage.afterClosed()
    //     .pipe(filter(verdadero => !!verdadero))
    //     .subscribe(() => {
    //       this.dialogRef.close(true);
    //       this.snackBar.open("El insumo ha sido registrado correctamente");

    //     });
    // }

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
  dataInsumoSelected?: any
  flag?: any
  idProyecto?: any
}

export class Insumo {
  idCategoria?: number;
  idRecurso?: number;
  descripcion?: string;
  unidad?: string;
  cantidad?: string;
  precio?: string;
  parcial?: string;
  sustento?: string;

  item?: number;
  cidCodigo?: string;
  tipoInsumo?: string;
  cidCodigoPart?: string;
  codigoPart?: number;
  descripcionSelecion?: string;
  cuadrilla?: string;
  fidPartida?: number;
  tipoincidencia?: number;
}

export interface DataPruebaInsumo {
  id: number;
  descripcion: string;
}

export class DataAutocompletePartida {
  idCodigo?: number;
  cidNombre?: string;
  cidCodigo?: string;
}

export class nuevaDataRecurso {
  idCategoria?: number;
  idRecurso?: number;
  nombreRecurso?: string;
  unidad?: string;
  cantidad?: number;
  precio?: string;
  parcial?: string;
  idPartida?: number;
  avanceFisico?: string;
}
