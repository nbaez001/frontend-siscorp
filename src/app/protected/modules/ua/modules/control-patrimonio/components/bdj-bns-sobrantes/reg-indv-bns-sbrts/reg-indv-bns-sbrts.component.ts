import { Component, OnInit, ViewChild, Inject, HostListener, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { DecimalPipe, DatePipe } from '@angular/common';
import { _formasAdquisicion, _departamentos, _provincias, _distritos, _centrosPoblado, _listaDenominacion, _listaMarca, _listaModelo, _listaColor, _unidades, _tambos, _estadosBien } from '../../../data-patrimonio';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Denominacion } from '../../../entities/denominacion.model';
import { Marca } from '../../../entities/marca.model';
import { Modelo } from '../../../entities/modelo.model';
import { Color } from '../../../entities/color.model';
import { DataDialog } from '../../../../control-combustible/entities/data-dialog.model';
import { BienSobrante } from '../../../entities/bien-sobrante.model';

@Component({
  selector: 'app-reg-indv-bns-sbrts',
  templateUrl: './reg-indv-bns-sbrts.component.html',
  styleUrls: ['./reg-indv-bns-sbrts.component.scss']
})
export class RegIndvBnsSbrtsComponent implements OnInit {
  indice: number = 1;

  // PARA CHIPS
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  listaColor: Observable<Color[]>;
  colores: Color[] = [{ idCodigo: 1, cidNombre: 'Lemon' }];
  @ViewChild('colorInput') colorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto4') auto4: MatAutocomplete;
  //PARA CHIPS


  // PARA CHIPS TABLA
  selectableTabla = true;
  removableTabla = true;
  addOnBlurTabla = true;
  separatorKeysCodesTabla: number[] = [ENTER, COMMA];
  listaColorTabla: Observable<Color[]>;
  coloresTabla: Color[] = [{ idCodigo: 1, cidNombre: 'Lemon' }];
  @ViewChild('colorInputTabla') colorInputTabla: ElementRef<HTMLInputElement>;
  @ViewChild('autoCo') autoCo: MatAutocomplete;
  //PARA CHIPS TABLA


  unidades: any[];
  tambos: any[];
  estados: any[] = [];
  listaDenominacion: Observable<Denominacion[]>;
  listaMarcas: Observable<Marca[]>;
  listaModelos: Observable<Modelo[]>;

  listaMarcasTabla: Observable<Marca[]>;
  listaModelosTabla: Observable<Modelo[]>;

  formularioGrp: FormGroup;
  messages = {
    'fechaIngreso': {
      'required': 'Campo obligatorio'
    },
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'tambo': {
      'required': 'Campo obligatorio'
    },
    'denominacion': {
      'required': 'Campo obligatorio'
    },
    'cantidad': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'fechaIngreso': '',
    'unidad': '',
    'tambo': '',
    'denominacion': '',
    'cantidad': '',
  };


  detFormularioGrp: FormGroup = new FormGroup({});
  messages2 = {};
  formErrors2 = {};

  listaBienes: BienSobrante[] = [];
  dataSource: MatTableDataSource<BienSobrante> = null;
  displayedColumns: string[] = [];
  isLoading: boolean = true;
  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Cod. Bien',
      cell: (cond: BienSobrante) => `${(cond.codigo + '').padStart(8, "0")}`
    }, {
      columnDef: 'denominacion',
      header: 'Denominacion bien',
      cell: (cond: BienSobrante) => `${cond.denominacion.cidNombre}`
    }, {
      columnDef: 'marca',
      header: 'Marca',
      cell: (cond: BienSobrante) => `${cond.marca.cidNombre}`
    }, {
      columnDef: 'modelo',
      header: 'Modelo',
      cell: (cond: BienSobrante) => `${cond.modelo.cidNombre}`
    }, {
      columnDef: 'serie',
      header: 'Serie',
      cell: (cond: BienSobrante) => `${cond.cidSerie}`
    }, {
      columnDef: 'medida',
      header: 'Medida',
      cell: (cond: BienSobrante) => `${cond.txtMedida}`
    }, {
      columnDef: 'color',
      header: 'Color',
      cell: (cond: BienSobrante) => `${this.mostrarColor(cond.color)}`
    }, {
      columnDef: 'caracteristica',
      header: 'Caracteristicas',
      cell: (cond: BienSobrante) => `${cond.txtCaracteristica}`
    }, {
      columnDef: 'unidad',
      header: 'Unidad',
      cell: (cond: BienSobrante) => `${cond.unidad.nombre}`
    }, {
      columnDef: 'tambo',
      header: 'Tambo',
      cell: (cond: BienSobrante) => `${cond.tambo.nombre}`
    }, {
      columnDef: 'observacion',
      header: 'Observaciones',
      cell: (cond: BienSobrante) => `${cond.txtObservacion}`
    }];

  selectedCellsState: boolean[][] = [];
  FIRST_EDITABLE_ROW: number = 0;
  LAST_EDITABLE_ROW: number = this.listaBienes.length - 1; // = 9
  FIRST_EDITABLE_COL: number = 3;                       // first column pos is not editable --> so start from index 1
  LAST_EDITABLE_COL: number = this.displayedColumns.length - 1; // = 3

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
      'Home', 'Delete', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
      'TabTab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

    if (event.key === 'Backspace') {
      console.log('BACKSPACE => BORRAR CADENA');
      // const end: number = this.newCellValue.length - 1;
      // this.newCellValue = this.newCellValue.slice(0, end);
    } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
      // this.newCellValue += event.key; //IMPRIME LA NOMBRE CADENA DEL TEXTO
    }
  }

  indexOfInArray(item: string, array: string[]): number {//FUNCION INDETIFICA EL KEY
    let index: number = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === item) { index = i; }
    }
    return index;
  }

  enfocado(fila: number, columna: number) {
    for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
      for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
        this.selectedCellsState[i][j] = false;
      }
    }
    this.selectedCellsState[fila][columna] = true;
  }

  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RegIndvBnsSbrtsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      unidad: ['', [Validators.required]],
      tambo: ['', [Validators.required]],

      fechaIngreso: [{ value: new Date(), disabled: false }, [Validators.required]],
      denominacion: ['', [Validators.required]],

      marca: ['', []],
      modelo: ['', []],
      serie: ['', []],
      medida: ['', []],
      color: ['', []],

      caracteristica: ['', []],
      observacion: ['', []],
      cantidad: [{ value: 1, disabled: false }, [Validators.required]],
    });

    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, false);
    });

    this.inicializarVariables();

    //FOR AUTOCOMPLETES
    this.listaDenominacion = this.formularioGrp.get('denominacion').valueChanges.pipe(
      map(value => this._buscarDenominacion(value))
    );
    this.listaMarcas = this.formularioGrp.get('marca').valueChanges.pipe(
      map(value => this._buscarMarca(value))
    );
    this.listaModelos = this.formularioGrp.get('modelo').valueChanges.pipe(
      map(value => this._buscarModelo(value))
    );
    //PARA AUTOCOMPLETES

    //PARA CHIPS
    this.listaColor = this.formularioGrp.get('color').valueChanges.pipe(
      startWith(null),
      map((value: string | null) => value ? this._buscarColor(value) : this.colores.slice()));
    //PARA CHIPS
  }

  displayFn(subject) {
    return subject ? subject.cidNombre : undefined;
  }

  private _buscarDenominacion(value: any): Denominacion[] {
    const filterValue = (typeof value == 'string') ? value.toLocaleLowerCase() : null;
    return _listaDenominacion.filter(option =>
      option.cidNombre.toLocaleLowerCase().includes(filterValue)
    );
  }
  private _buscarMarca(value: any): Marca[] {
    const filterValue = (typeof value == 'string') ? value.toLocaleLowerCase() : null;
    return _listaMarca.filter(option =>
      option.cidNombre.toLocaleLowerCase().includes(filterValue)
    );
  }
  private _buscarModelo(value: any): Modelo[] {
    const filterValue = (typeof value == 'string') ? value.toLocaleLowerCase() : null;
    return _listaModelo.filter(option =>
      option.cidNombre.toLocaleLowerCase().includes(filterValue)
    );
  }

  private _buscarColor(value: string): Color[] {
    const filterValue = (typeof value == 'string') ? value.toLocaleLowerCase() : null;
    return _listaColor.filter(option => option.cidNombre.toLowerCase().indexOf(filterValue) === 0);
  }

  seleccionado(evt) {
    console.log(evt);
  }

  filtrarMarcasTabla(indice: number) {
    this.listaMarcasTabla = of(this._buscarMarca(this.detFormularioGrp.get('m' + indice).value));
  }

  filtrarModelosTabla(indice: number) {
    this.listaModelosTabla = of(this._buscarModelo(this.detFormularioGrp.get('mo' + indice).value));
  }

  filtrarColoresTabla(indice: number) {
    this.listaColorTabla = of(this._buscarColor(this.detFormularioGrp.get('co' + indice).value));
  }

  //PARA CHIPS
  add(event: MatChipInputEvent): void {
    if (!this.auto4.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.colores.push({ idCodigo: 0, cidNombre: value.trim() });
      }
      if (input) {
        input.value = '';
      }
      this.formularioGrp.get('color').setValue(null);
    }
  }

  remove(obj: Color): void {
    const index = this.colores.indexOf(obj);
    if (index >= 0) {
      this.colores.splice(index, 1);
    }
  }

  seleccionColor(event: MatAutocompleteSelectedEvent): void {
    this.colores.push(JSON.parse(JSON.stringify(event.option.value)));
    this.colorInput.nativeElement.value = '';
    this.formularioGrp.get('color').setValue(null);
  }
  //PARA CHIPS

  //PARA CHIPS TABLA
  addColorTabla(event: MatChipInputEvent, index: number, row: BienSobrante): void {
    if (!this.autoCo.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        row.coloresTabla.push({ idCodigo: 0, cidNombre: value.trim() });
      }
      if (input) {
        input.value = '';
      }
      this.detFormularioGrp.get('co' + index).setValue(null);
    }
  }

  removeColorTabla(row: BienSobrante, obj: Color): void {
    const index = row.coloresTabla.indexOf(obj);
    if (index >= 0) {
      row.coloresTabla.splice(index, 1);
    }
  }

  selectedColorTabla(event: MatAutocompleteSelectedEvent, index: number, row: BienSobrante): void {
    row.coloresTabla.push(JSON.parse(JSON.stringify(event.option.value)));
    this.colorInputTabla.nativeElement.value = '';
    this.detFormularioGrp.get('co' + index).setValue(null);
  }
  //PARA CHIPS TABLA


  public inicializarVariables(): void {
    this.isLoading = false;
    this.definirTabla();
    this.comboUnidades();
    this.comboEstados();
  }

  comboUnidades(): void {
    this.unidades = JSON.parse(JSON.stringify(_unidades));
    this.formularioGrp.get('unidad').setValue(this.unidades[0]);
    this.comboTambos();
  }

  comboTambos(): void {
    let idUnidad = this.formularioGrp.get('unidad').value.id;
    this.tambos = JSON.parse(JSON.stringify(_tambos.filter(el => el.idUnidad == idUnidad)));
    this.formularioGrp.get('tambo').setValue(this.tambos[0]);
  }

  comboEstados(): void {
    this.estados = JSON.parse(JSON.stringify(_estadosBien))
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    // this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaBienes.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaBienes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.isLoading = false;

    this.LAST_EDITABLE_ROW = this.listaBienes.length - 1;
    this.LAST_EDITABLE_COL = this.displayedColumns.length - 1;
    this.crearControles();
  }

  crearControles(): void {
    const frmCtrl = {};

    //LISTA DE VISIBLES EN INPUT
    let lista = [];
    this.displayedColumns.forEach(el => {
      lista.push(false);
    });
    //FIN LISTA DE VISIBLES EN INPUT

    this.listaBienes.forEach(el => {
      el.unidadesTabla = this.unidades;
      el.tambosTabla = this.tambos;

      frmCtrl[`m${el.id}`] = new FormControl({ value: el.marca, disabled: false }, Validators.required);
      frmCtrl[`mo${el.id}`] = new FormControl({ value: el.modelo, disabled: false }, Validators.required);
      frmCtrl[`s${el.id}`] = new FormControl({ value: el.cidSerie, disabled: false }, []);
      frmCtrl[`me${el.id}`] = new FormControl({ value: el.txtMedida, disabled: false }, []);
      frmCtrl[`co${el.id}`] = new FormControl({ value: '', disabled: false }, []);
      frmCtrl[`ca${el.id}`] = new FormControl({ value: el.txtCaracteristica, disabled: false }, []);
      frmCtrl[`ob${el.id}`] = new FormControl({ value: el.txtObservacion, disabled: false }, []);
      frmCtrl[`ut${el.id}`] = new FormControl({ value: el.unidad, disabled: false }, Validators.required);
      frmCtrl[`tb${el.id}`] = new FormControl({ value: el.tambo, disabled: false }, Validators.required);
      el.coloresTabla = JSON.parse(JSON.stringify(el.color));

      this.messages2[`m${el.id}`] = { 'required': 'Campo obligatorio' };
      this.messages2[`mo${el.id}`] = { 'required': 'Campo obligatorio' };
      this.messages2[`s${el.id}`] = {};
      this.messages2[`me${el.id}`] = {};
      this.messages2[`co${el.id}`] = {};
      this.messages2[`ca${el.id}`] = {};
      this.messages2[`ob${el.id}`] = {};
      this.messages2[`ut${el.id}`] = {};
      this.messages2[`tb${el.id}`] = {};

      this.formErrors2[`m${el.id}`] = '';
      this.formErrors2[`mo${el.id}`] = '';
      this.formErrors2[`s${el.id}`] = '';
      this.formErrors2[`me${el.id}`] = '';
      this.formErrors2[`co${el.id}`] = '';
      this.formErrors2[`ca${el.id}`] = '';
      this.formErrors2[`ob${el.id}`] = '';
      this.formErrors2[`ut${el.id}`] = '';
      this.formErrors2[`tb${el.id}`] = '';

      this.selectedCellsState.push(JSON.parse(JSON.stringify(lista)));
    });

    this.detFormularioGrp = new FormGroup(frmCtrl);
  }

  agregarDetalle() {
    if (this.formularioGrp.valid) {
      let codigoUltimo = 12233;
      let cant = this.formularioGrp.get('cantidad').value;
      for (let i = 0; i < cant; i++) {
        let detPatrimonio = new BienSobrante();
        detPatrimonio.id = this.indice;
        detPatrimonio.codigo = (codigoUltimo + '').padStart(8, "0");
        detPatrimonio.denominacion = this.formularioGrp.get('denominacion').value;
        detPatrimonio.estado = this.estados[0].value;
        detPatrimonio.fechaRegistro = new Date(this.formularioGrp.get('fechaIngreso').value);//this.datePipe.transform, 'yyyy-MM-dd');
        detPatrimonio.unidad = this.formularioGrp.get('unidad').value;
        detPatrimonio.tambo = this.formularioGrp.get('tambo').value;

        detPatrimonio.marca = this.formularioGrp.get('marca').value;
        detPatrimonio.modelo = this.formularioGrp.get('modelo').value;
        detPatrimonio.color = this.colores;
        detPatrimonio.cidSerie = this.formularioGrp.get('serie').value;
        detPatrimonio.txtMedida = this.formularioGrp.get('medida').value;
        detPatrimonio.txtCaracteristica = this.formularioGrp.get('caracteristica').value;
        detPatrimonio.txtObservacion = this.formularioGrp.get('observacion').value;

        codigoUltimo++;
        this.indice++;

        this.listaBienes.push(detPatrimonio);
      }
      this.cargarDatosTabla();
      this.validationService.setAsUntouched(this.formularioGrp, this.formErrors, ['fechaIngreso', 'unidad', 'tambo']);
      this.formularioGrp.get('cantidad').setValue(1);
      console.log(this.listaBienes);
    } else {
      console.log('ERRORES');
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

  guardar(): void {
    console.log(this.listaBienes);
    if (this.detFormularioGrp.valid) {
      if (this.listaBienes.length > 0) {
        this.dialogRef.close(this.listaBienes);
      } else {
        console.log('agregar detalle')
      }
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

  delBienPatrimonio(obj): void {
    let index = this.listaBienes.indexOf(obj);
    this.listaBienes.splice(index, 1);

    this.cargarDatosTabla();
  }

  comboTambosTabla(row: BienSobrante): void {
    let idUnidad = this.detFormularioGrp.get('ut' + row.id).value.id;
    row.tambosTabla = JSON.parse(JSON.stringify(_tambos.filter(el => el.idUnidad == idUnidad)));
    this.detFormularioGrp.get('tb' + row.id).setValue(row.tambosTabla[0]);
  }

  mostrarColor(lista: any) {
    let colores = '';
    lista.forEach(el => {
      colores += el.nombre + ',';
    });
    return colores.substr(0, lista.length - 2);
  }

}
