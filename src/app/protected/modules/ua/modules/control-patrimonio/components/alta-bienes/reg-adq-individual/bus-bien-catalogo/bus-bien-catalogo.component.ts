import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { _listaGrupo, _listaClase, _listaDenominacion } from '../../../../data-patrimonio';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { Denominacion } from '../../../../entities/denominacion.model';
import { DataDialog } from 'app/protected/modules/ua/modules/control-combustible/entities/data-dialog.model';

@Component({
  selector: 'app-bus-bien-catalogo',
  templateUrl: './bus-bien-catalogo.component.html',
  styleUrls: ['./bus-bien-catalogo.component.scss']
})
export class BusBienCatalogoComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'grupo': {
      'required': 'Campo obligatorio'
    },
    'clase': {
      'required': 'Campo obligatorio'
    },
    'nomTipoBien': {
      'required': 'Campo obligatorio'
    },
    'codigoTipoBien': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'grupo': '',
    'clase': '',
    'nomTipoBien': '',
    'codigoTipoBien': ''
  };

  listaGrupo: Object[] = [];
  listaClase: Object[] = [];

  listaDenominacion: Denominacion[] = [];
  dataSource: MatTableDataSource<Denominacion>;
  displayedColumns: string[];
  isLoading: boolean = true;
  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (cond: Denominacion) => `${cond.cidCodigo}`
    }, {
      columnDef: 'denominacion',
      header: 'Denominacion catalogo',
      cell: (cond: Denominacion) => `${cond.cidNombre}`
    }, {
      columnDef: 'nomGrupo',
      header: 'grupo',
      cell: (cond: Denominacion) => `${cond.cidNombreGrupo}`
    }, {
      columnDef: 'nomClase',
      header: 'Clase',
      cell: (cond: Denominacion) => `${cond.cidNombreClase}`
    }];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<BusBienCatalogoComponent>,
    // private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      grupo: ['', []],
      clase: ['', []],
      nomTipoBien: ['', []],
      codigoTipoBien: ['', []],
    });

    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaDenominacion.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaDenominacion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.isLoading = false;
  }

  public inicializarVariables(): void {
    this.comboGrupo();
    this.comboClase();

    this.definirTabla();
    this.buscar();
  }

  comboGrupo() {
    this.listaGrupo = JSON.parse(JSON.stringify(_listaGrupo));
    this.listaGrupo.unshift({ cidCodigo: '00', cidNombre: 'TODOS' });
    this.formularioGrp.get('grupo').setValue(this.listaGrupo[0]);
  }

  comboClase() {
    this.listaClase = JSON.parse(JSON.stringify(_listaClase));
    this.listaClase.unshift({ cidCodigo: '00', cidNombre: 'TODOS' });
    this.formularioGrp.get('clase').setValue(this.listaClase[0]);
  }

  buscar() {
    console.log('buscar');
    let cidCodigoGrupo = this.formularioGrp.get('grupo').value.cidCodigo;
    let cidCodigoClase = this.formularioGrp.get('clase').value.cidCodigo;
    let codigoTipoBien = this.formularioGrp.get('codigoTipoBien').value;

    this.listaDenominacion = JSON.parse(JSON.stringify(_listaDenominacion)).filter(el => (el.cidCodigoGrupo == cidCodigoGrupo) || ('00' == cidCodigoGrupo));
    this.listaDenominacion = this.listaDenominacion.filter(el => (el.cidCodigoClase == cidCodigoClase) || ('00' == cidCodigoClase));

    this.cargarDatosTabla();
  }

  seleccionaTipoBien(obj): void {
    this.dialogRef.close(obj);
  }

}
