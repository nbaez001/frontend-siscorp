import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DataDialog } from 'app/protected/modules/ua/modules/control-combustible/entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { _unidades, _tambos, _estadosBien, _bienesPatrimoniales } from '../../../../data-patrimonio';
import { BienPatrimonio } from '../../../../entities/bien-patrimonio.model';

@Component({
  selector: 'app-buscar-bns-patrimon',
  templateUrl: './buscar-bns-patrimon.component.html',
  styleUrls: ['./buscar-bns-patrimon.component.scss']
})
export class BuscarBnsPatrimonComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'tambo': {
      'required': 'Campo obligatorio'
    },
    'nombreBien': {
      'required': 'Campo obligatorio'
    },
    'codigoPatrimonio': {
      'required': 'Campo obligatorio'
    },
    'estadoBien': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'unidad': '',
    'tambo': '',
    'nombreBien': '',
    'codigoPatrimonio': '',
    'estadoBien': '',
  };

  unidades = [];
  tambos = [];
  estadosBien = [];

  listaBienes: BienPatrimonio[];
  dataSource: MatTableDataSource<BienPatrimonio>;
  selection = new SelectionModel<BienPatrimonio>(true, []);
  displayedColumns: string[];
  columnsGrilla = [
    {
      columnDef: 'unidad',
      header: 'UNIDAD',
      cell: (bn: BienPatrimonio) => (bn.unidad != null) ? `${bn.unidad.nombre}` : ''
    }, {
      columnDef: 'tambo',
      header: 'TAMBO',
      cell: (bn: BienPatrimonio) => (bn.tambo != null) ? `${bn.tambo.nombre}` : ''
    }, {
      columnDef: 'codPatrimonio',
      header: 'CODIGO PATRIMONIO',
      cell: (bn: BienPatrimonio) => (bn.codPatrimonio != null) ? `${bn.codPatrimonio}` : ''
    }, {
      columnDef: 'denominacion',
      header: 'DESCRIPCION BIEN',
      cell: (bn: BienPatrimonio) => (bn.denominacion != null) ? `${bn.denominacion.cidNombre}` : ''
    }, {
      columnDef: 'marca',
      header: 'MARCA',
      cell: (bn: BienPatrimonio) => (bn.marca != null) ? `${bn.marca.nombre}` : ''
    }, {
      columnDef: 'modelo',
      header: 'MODELO',
      cell: (bn: BienPatrimonio) => (bn.modelo != null) ? `${bn.modelo.nombre}` : ''
    }, {
      columnDef: 'color',
      header: 'COLOR',
      cell: (bn: BienPatrimonio) => (bn.color != null) ? `${this.mostrarColor(bn.color)}` : ''
    }, {
      columnDef: 'serie',
      header: 'SERIE',
      cell: (bn: BienPatrimonio) => (bn.cidSerie != null) ? `${bn.cidSerie}` : ''
    }, {
      columnDef: 'medida',
      header: 'MEDIDA',
      cell: (bn: BienPatrimonio) => (bn.txtMedida != null) ? `${bn.txtMedida}` : ''
    }, {
      columnDef: 'anio',
      header: 'AÑO',
      cell: (bn: BienPatrimonio) => (bn.anio != null) ? `${bn.anio}` : ''
    }, {
      columnDef: 'placa',
      header: 'PLACA',
      cell: (bn: BienPatrimonio) => (bn.placa != null) ? `${bn.placa}` : ''
    }, {
      columnDef: 'chasis',
      header: 'CHASIS',
      cell: (bn: BienPatrimonio) => (bn.chasis != null) ? `${bn.chasis}` : ''
    }, {
      columnDef: 'motor',
      header: 'MOTOR',
      cell: (bn: BienPatrimonio) => (bn.motor != null) ? `${bn.motor}` : ''
    }, {
      columnDef: 'nomEstado',
      header: 'ESTADO',
      cell: (bn: BienPatrimonio) => (bn.estado != null) ? `${bn.estado.nombre}` : ''
    }, {
      columnDef: 'caracteristica',
      header: 'CARACTERISTICAS',
      cell: (bn: BienPatrimonio) => (bn.txtCaracteristica != null) ? (bn.txtCaracteristica.length > 60 ? `${bn.txtCaracteristica.substr(0, 59)}...` : `${bn.txtCaracteristica}`) : ''
    }, {
      columnDef: 'codigoCuenta',
      header: 'CUENTA',
      cell: (bn: BienPatrimonio) => (bn.cuenta.codigo != null) ? bn.cuenta.codigo : ''
    }, {
      columnDef: 'nombreCuenta',
      header: 'DESCRIPCION DE LA CUENTA',
      cell: (bn: BienPatrimonio) => (bn.cuenta.nombre != null) ? bn.cuenta.nombre : ''
    }, {
      columnDef: 'fechaRegistro',
      header: 'FECHA REGISTRO',
      cell: (bn: BienPatrimonio) => this.datePipe.transform(bn.fechaRegistro, 'dd/MM/yyyy')
    }, {
      columnDef: 'fechaContabilidad',
      header: 'FECHA CONTABILIDAD',
      cell: (bn: BienPatrimonio) => this.datePipe.transform(bn.fechaContabilidad, 'dd/MM/yyyy')
    }, {
      columnDef: 'nroDocAdquisicion',
      header: 'NRO. DOC. ADQUISICION',
      cell: (bn: BienPatrimonio) => (bn.nroDocAdquisicion != null) ? bn.nroDocAdquisicion : ''
    }, {
      columnDef: 'valorAdquisicion',
      header: 'VALOR ADQUISICION',
      cell: (bn: BienPatrimonio) => this.decimalPipe.transform(bn.valorAdquisicion, '1.2-2')
    }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<BuscarBnsPatrimonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      unidad: ['', [Validators.required]],
      tambo: ['', [Validators.required]],
      nombreBien: ['', []],
      codigoPatrimonio: ['', []],
      estadoBien: ['', []]
    });

    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  mostrarColor(lista: any) {
    let colores = '';
    lista.forEach(el => {
      colores += el.nombre + ',';
    });
    return colores.substr(0, lista.length - 2);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BienPatrimonio): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('select');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaBienes.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaBienes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
    }
  }

  public inicializarVariables(): void {
    this.definirTabla();
    this.cargarEstadosBien();
    this.cargarUnidades();
  }

  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(_unidades));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });
    this.formularioGrp.get('unidad').setValue(this.unidades[0]);

    this.cargarTambos();
  }

  public cargarTambos() {
    let idUnidad = this.formularioGrp.get('unidad').value.id;
    this.tambos = JSON.parse(JSON.stringify(_tambos.filter(tb => tb.idUnidad == idUnidad)));
    this.tambos.unshift({ id: 0, nombre: 'TODOS', idUnidad: 0 });
    this.formularioGrp.get('tambo').setValue(this.tambos[0]);

    this.buscar();
  }

  public cargarEstadosBien() {
    this.estadosBien = JSON.parse(JSON.stringify(_estadosBien));
    this.estadosBien.unshift({ id: 0, nombre: 'TODOS' });

    this.formularioGrp.get('estadoBien').setValue(this.estadosBien[0]);
  }

  buscar(): void {
    let idUnidad = this.formularioGrp.get('unidad').value.id;
    let idTambo = this.formularioGrp.get('tambo').value.id;
    let idEstadoBien = this.formularioGrp.get('estadoBien').value.id;
    let nombreBien = this.formularioGrp.get('nombreBien').value;
    let codigoPatrimonio = this.formularioGrp.get('codigoPatrimonio').value;

    this.listaBienes = JSON.parse(JSON.stringify(_bienesPatrimoniales));
    this.listaBienes = this.listaBienes.filter(el => (el.unidad.id == idUnidad || 0 == idUnidad));
    this.listaBienes = this.listaBienes.filter(el => (el.tambo.id == idTambo || 0 == idTambo));
    this.listaBienes = this.listaBienes.filter(el => (el.estado.id == idEstadoBien || 0 == idEstadoBien));
    this.listaBienes = this.listaBienes.filter(el => (el.denominacion.cidNombre.includes(nombreBien)));
    this.listaBienes = this.listaBienes.filter(el => (el.codPatrimonio.includes(codigoPatrimonio)));

    this.cargarDatosTabla();
  }

  agregar(): void {
    this.dialogRef.close(this.selection.selected);
  }

  limpiar() {

  }

}
