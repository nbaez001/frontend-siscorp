import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Proveedor } from '../../../../../entities/config/proveedor.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataDialog } from '../../../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { _departamentos, _provincias, _distritos, _tiposDocumento, _proveedores } from '../../../../../data-combustible';

@Component({
  selector: 'app-busc-proveedor',
  templateUrl: './busc-proveedor.component.html',
  styleUrls: ['./busc-proveedor.component.scss']
})
export class BuscProveedorComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'estado': {
      'required': 'Campo obligatorio'
    },
    'fecInicio': {
      'required': 'Campo obligatorio'
    },
    'fecFin': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'estado': '',
    'fecInicio': '',
    'fecFin': ''
  };

  tiposDocumento = [];
  departamentos = [];
  provincias = [];
  distritos = [];
  listaProveedores: Proveedor[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<Proveedor>;

  columnsGrilla = [
    {
      columnDef: 'nombre',
      header: 'NOMBRE',
      cell: (obj: Proveedor) => `${obj.nombre}`
    }, {
      columnDef: 'nomTipoDocumento',
      header: 'TIPO DOCUMENTO',
      cell: (obj: Proveedor) => `${obj.nomTipoDocumento}`
    }, {
      columnDef: 'nroDocumento',
      header: 'NRO DOCUMENTO',
      cell: (obj: Proveedor) => `${obj.nroDocumento}`
    }, {
      columnDef: 'nomDepartamento',
      header: 'DEPARTAMENTO',
      cell: (obj: Proveedor) => `${obj.nomDepartamento}`
    }, {
      columnDef: 'nomProvincia',
      header: 'PROVINCIA',
      cell: (obj: Proveedor) => `${obj.nomProvincia}`
    }, {
      columnDef: 'nomDistrito',
      header: 'DISTRITO',
      cell: (obj: Proveedor) => `${obj.nomDistrito}`
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<BuscProveedorComponent>,
    // private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      tipoDocumento: ['', []],
      nroDocumento: ['', []],
      nombre: ['', []],
      departamento: ['', []],
      provincia: ['', []],
      distrito: ['', []],
    });

    this.definirTabla();
    this.inicializarVariables();
  }
  // get getUser(): UsuarioService { return this.user; }

  public inicializarVariables(): void {
    this.cargarTiposDocumento();
    this.cargarDepartamentos();

    // this.spinnerService.hide();
  }

  public cargarTiposDocumento() {
    this.tiposDocumento = JSON.parse(JSON.stringify(_tiposDocumento));
    this.tiposDocumento.unshift({ id: 0, nombre: 'TODOS' });
    this.formularioGrp.get('tipoDocumento').setValue(this.tiposDocumento[0]);
  }

  public cargarDepartamentos() {
    this.departamentos = JSON.parse(JSON.stringify(_departamentos));
    this.departamentos.unshift({ id: 0, nombre: 'TODOS' });
    this.formularioGrp.get('departamento').setValue(this.departamentos[0]);

    this.cargarProvincias();
  }

  public cargarProvincias() {
    this.provincias = JSON.parse(JSON.stringify(_provincias));
    this.provincias.unshift({ id: 0, nombre: 'TODOS' });
    this.formularioGrp.get('provincia').setValue(this.provincias[0]);

    this.cargarDistritos();
  }

  public cargarDistritos() {
    this.distritos = JSON.parse(JSON.stringify(_distritos));
    this.distritos.unshift({ id: 0, nombre: 'TODOS' });
    this.formularioGrp.get('distrito').setValue(this.distritos[0]);

    this.buscar();
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
    if (this.listaProveedores.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaProveedores);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  buscar() {
    let idTipoDocumento = this.formularioGrp.get('tipoDocumento').value.id;
    let nroDocumento = this.formularioGrp.get('nroDocumento').value;
    let nombre = this.formularioGrp.get('nombre').value;
    let idDepartamento = this.formularioGrp.get('departamento').value.id;
    let idProvincia = this.formularioGrp.get('provincia').value.id;
    let idDistrito = this.formularioGrp.get('distrito').value.id;
    this.listaProveedores = _proveedores.filter(el => (el.idTipoDocumento == idTipoDocumento) || (0 == idTipoDocumento));
    this.listaProveedores = this.listaProveedores.filter(el => (el.nroDocumento == nroDocumento) || ('' == nroDocumento));
    this.listaProveedores = this.listaProveedores.filter(el => (el.nombre == nombre) || ('' == nombre));
    this.listaProveedores = this.listaProveedores.filter(el => (el.idDepartamento == idDepartamento) || (0 == idDepartamento));
    this.listaProveedores = this.listaProveedores.filter(el => (el.idProvincia == idProvincia) || (0 == idProvincia));
    this.listaProveedores = this.listaProveedores.filter(el => (el.idDistrito == idDistrito) || (0 == idDistrito));

    this.cargarDatosTabla();
  }

  seleccionar(el): void {
    this.dialogRef.close(el);
  }

  limpiar(): void {

  }

}
