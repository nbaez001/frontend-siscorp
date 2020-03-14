import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DataDialog } from '../../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { _estadosCuentaBanco, _bancos, _tiposDocumento, _departamentos, _provincias, _distritos } from '../../../../data-combustible';
import { Proveedor } from '../../../../entities/config/proveedor.model';

@Component({
  selector: 'app-reg-proveedor',
  templateUrl: './reg-proveedor.component.html',
  styleUrls: ['./reg-proveedor.component.scss']
})
export class RegProveedorComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'nombre': {
      'required': 'Campo obligatorio'
    },
    'tipoDocumento': {
      'required': 'Campo obligatorio'
    },
    'nroDocumento': {
      'required': 'Campo obligatorio'
    },
    'departamento': {
      'required': 'Campo obligatorio'
    },
    'provincia': {
      'required': 'Campo obligatorio'
    },
    'distrito': {
      'required': 'Campo obligatorio'
    },
    'direccion': {
      'required': 'Campo obligatorio'
    },
    'telefono': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'nombre': '',
    'tipoDocumento': '',
    'nroDocumento': '',
    'departamento': '',
    'provincia': '',
    'distrito': '',
    'direccion': '',
    'telefono': '',
  };

  detFormularioGrp: FormGroup;
  messages2 = {
    'banco': {
      'required': 'Campo obligatorio'
    },
    'nroCuenta': {
      'required': 'Campo obligatorio'
    },
    'cciCuenta': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors2 = {
    'banco': '',
    'nroCuenta': '',
    'cciCuenta': '',
  };

  tiposDocumento = [];
  departamentos = [];
  provincias = [];
  distritos = [];

  bancos = [];
  estadosCuentaBanco = _estadosCuentaBanco;

  listaCuentas = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  columnsGrilla = [
    {
      columnDef: 'nomBanco',
      header: 'BANCO',
      cell: (obj: any) => `${obj.nomBanco}`
    }, {
      columnDef: 'nroCuenta',
      header: 'NRO CUENTA',
      cell: (obj: any) => `${obj.nroCuenta}`
    }, {
      columnDef: 'cciCuenta',
      header: 'CCI',
      cell: (obj: any) => `${obj.cciCuenta}`
    }, {
      columnDef: 'nomEstadoCuenta',
      header: 'ESTADO',
      cell: (obj: any) => `${obj.nomEstadoCuenta}`
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // get getUser() { return this.user; }

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RegProveedorComponent>,
    // private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    // @Inject(UsuarioService) private user: UsuarioService,
    @Inject(ValidationService) private validationService: ValidationService,
    private _snackbar: MatSnackBar) { }

  ngOnInit() {
    // this.spinnerService.show();
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      nroDocumento: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
    });

    this.detFormularioGrp = this.fb.group({
      banco: ['', [Validators.required]],
      nroCuenta: ['', [Validators.required]],
      cciCuenta: ['', [Validators.required]],
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    // this.spinnerService.hide();
    this.cargarTiposDocumento();
    this.cargarDepartamentos();
    this.cargarBancos();

    this.definirTabla();
  }

  public cargarBancos() {
    this.bancos = JSON.parse(JSON.stringify(_bancos));
    this.detFormularioGrp.get('banco').setValue(this.bancos[0]);
  }

  public cargarTiposDocumento() {
    this.tiposDocumento = JSON.parse(JSON.stringify(_tiposDocumento));
    this.formularioGrp.get('tipoDocumento').setValue(this.tiposDocumento[0]);
  }

  public cargarDepartamentos() {
    this.departamentos = JSON.parse(JSON.stringify(_departamentos));
    this.formularioGrp.get('departamento').setValue(this.departamentos[0]);
    this.cargarProvincias();
  }

  public cargarProvincias() {
    let idDepartamento = this.formularioGrp.get('departamento').value.id;

    this.provincias = JSON.parse(JSON.stringify(_provincias));
    this.provincias = this.provincias.filter(el => (el.idDepartamento == idDepartamento || 0 == idDepartamento));
    this.formularioGrp.get('provincia').setValue(this.provincias[0]);

    this.cargarDistritos();
  }

  public cargarDistritos() {
    let idProvincia = this.formularioGrp.get('provincia').value.id;
    this.distritos = JSON.parse(JSON.stringify(_distritos));
    this.distritos = this.distritos.filter(el => (el.idProvincia == idProvincia || 0 == idProvincia));

    this.formularioGrp.get('distrito').setValue(this.distritos[0]);
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaCuentas.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaCuentas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  agregar(): void {
    if (this.detFormularioGrp.valid) {
      let kil: any = {};
      kil.id = 0;
      kil.idBanco = this.detFormularioGrp.get('banco').value.id;
      kil.nomBanco = this.detFormularioGrp.get('banco').value.nombre;
      kil.nroCuenta = this.detFormularioGrp.get('nroCuenta').value;
      kil.cciCuenta = this.detFormularioGrp.get('cciCuenta').value;
      kil.idEstadoCuenta = this.estadosCuentaBanco[0].id;
      kil.nomEstadoCuenta = this.estadosCuentaBanco[0].nombre;

      this.listaCuentas.push(kil);
      this.validationService.setAsUntouched(this.detFormularioGrp, this.formErrors2, ['banco']);
      this.cargarDatosTabla();
    } else {
      this.validationService.getValidationErrors(this.detFormularioGrp, this.messages2, this.formErrors2, true);
    }
  }

  principal(): void {

  }

  guardar(): void {
    if (this.formularioGrp.valid) {
      // if (this.listaCuentas.length > 0) {
      let kil = new Proveedor();
      kil.id = 0;
      kil.nombre = this.formularioGrp.get('nombre').value;
      kil.idTipoDocumento = this.formularioGrp.get('tipoDocumento').value.id;
      kil.nomTipoDocumento = this.formularioGrp.get('tipoDocumento').value.nombre;
      kil.nroDocumento = this.formularioGrp.get('nroDocumento').value;
      kil.idDepartamento = this.formularioGrp.get('departamento').value.id;
      kil.nomDepartamento = this.formularioGrp.get('departamento').value.nombre;
      kil.idProvincia = this.formularioGrp.get('provincia').value.id;
      kil.nomProvincia = this.formularioGrp.get('provincia').value.nombre;
      kil.idDistrito = this.formularioGrp.get('distrito').value.id;
      kil.nomDistrito = this.formularioGrp.get('distrito').value.nombre;
      kil.direccion = this.formularioGrp.get('direccion').value;
      kil.telefono = this.formularioGrp.get('telefono').value;
      kil.fecha = new Date();

      if (this.listaCuentas.length > 0) {
        kil.idBanco = this.listaCuentas[0].idBanco;
        kil.nomBanco = this.listaCuentas[0].nomBanco;
        kil.cciCuenta = this.listaCuentas[0].cciCuenta;
      } else {
        kil.idBanco = 0;
        kil.nomBanco = '';
        kil.cciCuenta = '';
      }

      this.dialogRef.close(kil);
      // } else {
      //   this._snackbar.open('Agregue al menos una cuenta bancaria', 'OK', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      // }
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

}
