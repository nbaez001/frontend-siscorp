import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { DataDialog } from 'app/protected/modules/ua/modules/control-combustible/entities/data-dialog.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DecimalPipe, DatePipe } from '@angular/common';
import { _bienesPatrimoniales } from '../../../../data-patrimonio';
import { BienPatrimonio } from '../../../../entities/bien-patrimonio.model';

@Component({
  selector: 'app-ver-baja-bienes',
  templateUrl: './ver-baja-bienes.component.html',
  styleUrls: ['./ver-baja-bienes.component.scss']
})
export class VerBajaBienesComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'formaDispFinal': {
      'required': 'Campo obligatorio'
    },
    'nroDocSustentatorio': {
      'required': 'Campo obligatorio'
    },
    'fechaBaja': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'formaDispFinal': '',
    'nroDocSustentatorio': '',
    'fechaBaja': '',
  };

  listaBienes: BienPatrimonio[] = [];
  dataSource: MatTableDataSource<BienPatrimonio> = null;
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

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<VerBajaBienesComponent>,
    public dialog: MatDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      formaDispFinal: [{ value: '', disabled: true }, [Validators.required]],
      nroDocSustentatorio: [{ value: '', disabled: true }, [Validators.required]],
      fechaBaja: [{ value: '', disabled: true }, [Validators.required]]
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

  salir(): void {
    this.dialogRef.close(null);
  }

  public inicializarVariables(): void {
    this.formularioGrp.get('formaDispFinal').setValue(this.data.objeto.disposicionFinal.nombre);
    this.formularioGrp.get('nroDocSustentatorio').setValue(this.data.objeto.nroDocSustentatorio);
    this.formularioGrp.get('fechaBaja').setValue(this.data.objeto.fecha);
    this.listaBienes = JSON.parse(JSON.stringify(_bienesPatrimoniales));

    this.definirTabla();
    this.cargarDatosTabla();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaBienes.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaBienes);
      this.dataSource.paginator = this.paginator;
    }
  }

}
