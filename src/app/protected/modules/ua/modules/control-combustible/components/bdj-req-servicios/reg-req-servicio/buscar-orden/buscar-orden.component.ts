import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EjecucionPresupuestal } from '../../../../entities/ejecucion-presupuestal.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataDialog } from '../../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TIPOSPRESUPUESTO, EJECUCIONPRESUPUESTAL } from '../../../../data-combustible';

@Component({
  selector: 'app-buscar-orden',
  templateUrl: './buscar-orden.component.html',
  styleUrls: ['./buscar-orden.component.scss']
})
export class BuscarOrdenComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'tipoEjecucionPresupuestal': {
      'required': 'Campo obligatorio'
    },
    'codigoDocumento': {
      'required': 'Campo obligatorio'
    },
    'NroExpSIAF': {
      'required': 'Campo obligatorio'
    },
    'proveedor': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'tipoEjecucionPresupuestal': '',
    'codigoDocumento': '',
    'nroExpSIAF': '',
    'proveedor': '',
  };

  proveedores = [];
  tiposEjecucionPresupuestal = [];

  listaEjecucionPres: EjecucionPresupuestal[];
  dataSource: MatTableDataSource<EjecucionPresupuestal>;
  displayedColumns: string[];
  columnsGrilla = [
    {
      columnDef: 'id',
      header: 'N°',
      cell: (cond: EjecucionPresupuestal) => `${cond.id}`
    }, {
      columnDef: 'nomTipoejecucion',
      header: 'TIPO EJECUCION',
      cell: (cond: EjecucionPresupuestal) => `${cond.nomTipoejecucion}`
    }, {
      columnDef: 'nroOrdencompra',
      header: 'NRO O.S./NRO RES.ADM.',
      cell: (cond: EjecucionPresupuestal) => `${(cond.nroOrdencompra != null) ? cond.nroOrdencompra : cond.nroResAdministracion}`
    }, {
      columnDef: 'monto',
      header: 'MONTO',
      cell: (cond: EjecucionPresupuestal) => `S/.${this.decimalPipe.transform(cond.monto, '1.2-2')}`
    }, {
      columnDef: 'fecha',
      header: 'FECHA',
      cell: (cond: EjecucionPresupuestal) => this.datePipe.transform(cond.fecha, 'dd/MM/yyyy')
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<BuscarOrdenComponent>,
    // private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      tipoEjecucionPresupuestal: ['', [Validators.required]],
      codigoDocumento: ['', []],
      nroExpSIAF: ['', []],
      proveedor: ['', []]
    });

    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, false);
    });

    this.inicializarVariables();
  }
  // get getUser(): UsuarioService { return this.user; }

  public inicializarVariables(): void {
    this.cargarTipoEjecucion();
    this.definirTabla();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaEjecucionPres.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaEjecucionPres);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public cargarTipoEjecucion() {
    this.tiposEjecucionPresupuestal = JSON.parse(JSON.stringify(TIPOSPRESUPUESTO));//TIPOSPRESUPUESTO
    this.tiposEjecucionPresupuestal.unshift({ id: 0, nombre: 'TODOS' });

    this.formularioGrp.get('tipoEjecucionPresupuestal').setValue(this.tiposEjecucionPresupuestal[0]);

    this.buscar();
  }

  buscar(): void {
    let idTipoEjecucionPresupuestal = this.formularioGrp.get('tipoEjecucionPresupuestal').value.id;

    this.listaEjecucionPres = JSON.parse(JSON.stringify(EJECUCIONPRESUPUESTAL));
    this.listaEjecucionPres = this.listaEjecucionPres.filter(el => (el.idTipoejecucion == idTipoEjecucionPresupuestal || 0 == idTipoEjecucionPresupuestal));

    this.cargarDatosTabla();
  }

  seleccionar(el): void {
    this.dialogRef.close(el);
  }

  limpiar(): void {

  }

}
