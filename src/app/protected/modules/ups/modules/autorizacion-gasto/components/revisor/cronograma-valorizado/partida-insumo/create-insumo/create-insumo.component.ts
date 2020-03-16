import { Component, OnInit, Inject, ViewChild, AfterViewInit, Renderer, OnDestroy } from '@angular/core';
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
import { UpdateInsumoComponent } from './../update-insumo/update-insumo.component';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataSharedService } from '../../../../../service/data-shared.service';


@Component({
  selector: 'app-create-insumo',
  templateUrl: './create-insumo.component.html',
  styleUrls: ['./create-insumo.component.scss']
})
export class CreateInsumoComponent implements OnInit, OnDestroy {

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
  numeroItemMemoria: number = 1;
  //**********************************************
  cantidadPalabraRecurso: number = 49;
  dataRecursoPartida: any;
  frozenColsdataRecursoPartida: any[];
  scrollableColsdataRecursoPartida: any[];
  //**********************************************
  optionsRecurso: DataAutocompleteInsumo[] = [];
  filteredOptionsRecurso: Observable<DataAutocompleteInsumo[]>;
  optionsPartida: DataAutocompletePartida[] = [];
  filteredOptionsPartida: Observable<DataAutocompletePartida[]>;
  categoriaInsumo: any;

  dataNuevaDataRecurso: nuevaDataRecurso[] = [];
  nuevaDataRecursoSustento: nuevaDataRecursoSustento = new nuevaDataRecursoSustento();

  constructor(
    private dataShared: DataSharedService,
    private spinner: NgxSpinnerService,
    @Inject(ValidationService) private validationService: ValidationService,
    private cotizacionService: CotizacionService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateInsumoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataInsumo
  ) {
    this.insumoFormulario();
    this.cargaCategoriaAutocompleteInsumo();

    this.cargaAutocompleteInsumo(1);
    this.cargaAutocompletePartida(this.datos.idProyecto);
  }

  ngOnInit() {
    this.insumo.idCategoria = 1;
    this.busquedaInsumo();
    this.busquedaPartida();
    this.generarTablaFrozenScrollableRecursoPartida();
    this.cargarDataRecursoPartida();
    if (!this.datos.dataInsumoSelected) {
      this.titulo = "Nuevo Recurso"
      this.ocultarDescripcion = true;
      this.deshabilitadoUnidad = false;
      this.deshabilitadoCantidad = false;
      this.deshabilitadoPrecio = false;
      this.deshabilitadoParcial = true;
      this.insumo = new Insumo();
    }
  }

  //************************************* FORMULARIO *************************************
  insumoFormulario() {
    this.insumoForm = this.formBuilder.group({
      idCategoriaFrmCtrl: ['', [Validators.required]],
      descripcionInsumoFrmCtrl: ['', [Validators.required]],
      unidadInsumoFrmCtrl: ['', [Validators.required]],
      cantidadFrmCtrl: ['', [Validators.required]],
      precioInsumoFrmCtrl: ['', [Validators.required]],
      parcialInsumoFrmCtrl: ['', [Validators.required]],
      sustentoFrmCtrl: ['', [Validators.required]],
      partidaFrmCtrl: ['', [Validators.required]],
    });
  }

  get idCategoriaFrmCtrl() { return this.insumoForm.get('idCategoriaFrmCtrl'); }
  get descripcionInsumoFrmCtrl() { return this.insumoForm.get('descripcionInsumoFrmCtrl'); }
  get unidadInsumoFrmCtrl() { return this.insumoForm.get('unidadInsumoFrmCtrl'); }
  get cantidadFrmCtrl() { return this.insumoForm.get('cantidadFrmCtrl'); }
  get precioInsumoFrmCtrl() { return this.insumoForm.get('precioInsumoFrmCtrl'); }
  get parcialInsumoFrmCtrl() { return this.insumoForm.get('parcialInsumoFrmCtrl'); }
  get sustentoFrmCtrl() { return this.insumoForm.get('sustentoFrmCtrl'); }
  get partidaFrmCtrl() { return this.insumoForm.get('partidaFrmCtrl'); }

  onMouseEnterCantidad($event) {
    let suma = parseFloat((this.cantidadFrmCtrl.value == undefined) ? 1 : this.cantidadFrmCtrl.value) * parseFloat((this.precioInsumoFrmCtrl.value == undefined) ? 1 : this.precioInsumoFrmCtrl.value);
    this.parcialInsumoFrmCtrl.setValue(suma);
  }

  onMouseEnterPrecio($event) {
    let suma = parseFloat((this.cantidadFrmCtrl.value == undefined) ? 1 : this.cantidadFrmCtrl.value) * parseFloat((this.precioInsumoFrmCtrl.value == undefined) ? 1 : this.precioInsumoFrmCtrl.value);
    this.parcialInsumoFrmCtrl.setValue(suma);
  }

  //************************************* CATEGORIA *************************************
  cargaCategoriaAutocompleteInsumo() {
    this.cotizacionService.cargaCategoriaAutocompleteInsumo().subscribe(data => {
      this.categoriaInsumo = data.response;
    });
  }

  seleccionCategoria($event) {
    this.cargaAutocompleteInsumo(+$event);
  }

  //************************************* RECURSO *************************************
  cargaAutocompleteInsumo(idCategoria: number) {
    this.cotizacionService.listarAutocompleteInsumos(this.datos.idProyecto, idCategoria).subscribe(data => {
      this.optionsRecurso = data.response;
    });
  }

  busquedaInsumo() {
    this.filteredOptionsRecurso = this.insumoForm.controls['descripcionInsumoFrmCtrl'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descripcion),
      map(descripcion => descripcion ? this._filterRecurso(descripcion) : [])
    );
  }

  displayFnRecurso(user?: DataAutocompleteInsumo): string | undefined {
    return user ? user.cidNombre : undefined;
  }

  private _filterRecurso(descripcion: string): DataAutocompleteInsumo[] {
    // this.existeRecurso = false;
    this.deshabilitadoUnidad = false;
    this.deshabilitadoCantidad = false;
    this.deshabilitadoPrecio = false;
    const filterValue = descripcion.toLowerCase();
    return this.optionsRecurso.filter(option => option.cidNombre.toLowerCase().includes(filterValue));
  }

  limpiaInsumo(event) {
    if (event.target.value.length == 0) {
      this.unidadInsumoFrmCtrl.setValue("");
      this.cantidadFrmCtrl.setValue("");
      this.precioInsumoFrmCtrl.setValue("");
      this.parcialInsumoFrmCtrl.setValue("");
    }
  }

  obtenerDatosInsumo($event) {
    if ($event.option.value != undefined) {
      if ($event.option.value.cidCodigo == 1) {
        this.openDialogMensajeConfirm(`El recurso ${$event.option.value.cidNombre} existe en el proyecto, ¿Desea modificarlo?`, true);
        this.insumo.descripcion = "";
        this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
          this.dialogRef.close(true);
          // this.nodeService.obtenerInsumo().then(files => {
          const dialogReg: MatDialogRef<UpdateInsumoComponent> = this.dialog.open(UpdateInsumoComponent, {
            disableClose: true,
            width: '50%',
            autoFocus: false,
            data: {
              dataInsumoSelected: $event.option.value,
              flag: 2,
              idProyecto: this.datos.idProyecto
            }
          });
          dialogReg.afterClosed().pipe(filter(r => !!r)).subscribe(() => {
            
          });
          // });
        });
      } else {
        console.log($event.option.value);
        this.deshabilitadoUnidad = true;
        this.unidadInsumoFrmCtrl.setValue($event.option.value.unidad);
      }
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
  onMouseEnterTabla(rowData): void {
    rowData.hover = true;
  }
  onMouseLeaveTabla(rowData): void {
    rowData.hover = false;
  }

  generarTablaFrozenScrollableRecursoPartida() {
    this.frozenColsdataRecursoPartida = [
      { field: 'nro', header: 'ITEM' },
      { field: 'partida', header: 'PARTIDA' },
    ];
    this.scrollableColsdataRecursoPartida = [
      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'nombreRecurso', header: 'RECURSO' },
      { field: 'idCodigo', header: 'ELIMINAR' },
    ];
  }

  eliminarRecursoPartidaTemporal(item: number) {
    this.dataRecursoPartida.forEach(function (partida, index, object) {
      if (partida.idCodigo === item) {
        object.splice(index, 1);
      }
    });
    let i = 0;
    this.dataRecursoPartida.forEach(function (partida, index, object) {
      // partida.nro = i++;
      console.log(partida.nro);
      // this.numeroItemMemoria--;
    });
  }

  crearRecursoPartidaTemporal() {
    (this.dataRecursoPartida.length == 0) ? this.numeroItemMemoria = 1 : this.numeroItemMemoria++;
    this.dataRecursoPartida.push(
      {
        "nro": this.numeroItemMemoria,
        "idCategoria": this.idCategoriaFrmCtrl.value,
        "idRecurso": (this.descripcionInsumoFrmCtrl.value.idCodigo == undefined) ? 0 : this.descripcionInsumoFrmCtrl.value.idCodigo,
        "nombreRecurso": (this.descripcionInsumoFrmCtrl.value.cidNombre == undefined) ? this.descripcionInsumoFrmCtrl.value : this.descripcionInsumoFrmCtrl.value.cidNombre,
        "unidad": this.unidadInsumoFrmCtrl.value,
        "cantidad": this.cantidadFrmCtrl.value,
        "precio": this.precioInsumoFrmCtrl.value,
        "parcial": this.parcialInsumoFrmCtrl.value,
        "partida": this.partidaFrmCtrl.value.cidNombre,
        "idCodigo": this.partidaFrmCtrl.value.idCodigo,
        "eliminar": this.numeroItemMemoria,
      }
    );
    // this.dataRecursoPartida= this.dataRecursoPartida.reverse(); 
    console.log(this.dataRecursoPartida);
  }

  public cargarDataRecursoPartida(): void {
    this.dataRecursoPartida = [];
  }

  onEditInitRecursoPartida(event) { console.log("onEditInit", event); }
  onEditCompleteRecursoPartida(event) { console.log("onEditComplete", event); }

  agregarInsumo(): void {
    if (this.insumoForm.valid) {
      this.openDialogMensajeConfirm(MENSAJES.INSUMO.GUARDAR_INSUMO, true);
      this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
        this.spinner.show();
        this.dataRecursoPartida.forEach(element => {
          this.dataNuevaDataRecurso.push(
            {
              "idCategoria": element.idCategoria,
              "idRecurso": element.idRecurso,
              "nombreRecurso": element.nombreRecurso,
              "unidad": element.unidad,
              "cantidad": element.cantidad,
              "precio": element.precio,
              "parcial": element.parcial,
              "idPartida": element.idCodigo,
            }
          );
        });

        this.nuevaDataRecursoSustento.sustento = this.insumo.sustento;
        console.log(this.dataNuevaDataRecurso);
        this.cotizacionService.crearRecurso(this.datos.idProyecto, this.datos.idAutoGasto, this.dataNuevaDataRecurso, this.nuevaDataRecursoSustento)
          .subscribe(response => {
            console.log(response);
            if (response.msgResultado == "OK") {
              this.dataShared.enviarIdAutoGenerado(+this.datos.idAutoGasto);//actualiza grilla
              this.dataShared.enviarIdAutoGeneradoDesdeCrearRecurso(+response.idAutoGasto);//enviar nuevo id-auto-gasto
              this.dialogRef.close(true);
              this.spinner.hide();
              this.snackBar.open("El insumo ha sido registrado correctamente");
            } else {
              this.spinner.hide();
              this.openDialogMensaje("ERROR DE TRANSACCIÓN EN BASE DE DATOS", true);
            }
          });

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

  public openDialogMensaje(message: string, alerta: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, alerta: alerta }
    });
  }

  ngOnDestroy() {
  }

}

interface DataInsumo {
  dataInsumoSelected?: any;
  flag?: any
  idProyecto?: number;
  idAutoGasto?: number;
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

export interface DataAutocompleteInsumo {
  idCodigo?: number;
  cidNombre?: string;
  cidCodigo?: string;
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
}

export class nuevaDataRecursoSustento {
  sustento?: string;
}

