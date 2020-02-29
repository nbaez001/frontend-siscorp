import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Proveedor } from '../../../entities/config/proveedor.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { _departamentos, _provincias, _distritos, _tiposDocumento, _proveedores } from '../../../data-combustible';
import { RegProveedorComponent } from './reg-proveedor/reg-proveedor.component';

@Component({
  selector: 'app-bdj-proveedores',
  templateUrl: './bdj-proveedores.component.html',
  styleUrls: ['./bdj-proveedores.component.scss']
})
export class BdjProveedoresComponent implements OnInit {
  bandejaGrp: FormGroup;
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
    }, {
      columnDef: 'direccion',
      header: 'DIRECCION',
      cell: (obj: Proveedor) => `${obj.direccion}`
    }, {
      columnDef: 'telefono',
      header: 'TELEFONO',
      cell: (obj: Proveedor) => `${obj.telefono}`
    }, {
      columnDef: 'fecha',
      header: 'FECHA',
      cell: (obj: Proveedor) => `${this.datePipe.transform(obj.fecha, 'dd/MM/yyyy')}`
    }, {
      columnDef: 'nomBanco',
      header: 'BANCO',
      cell: (obj: Proveedor) => `${obj.nomBanco}`
    }, {
      columnDef: 'cciCuenta',
      header: 'CCI',
      cell: (obj: Proveedor) => `${obj.cciCuenta}`
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     this.bandejaGrp = this.fb.group({
    //       tipoDocumento: ['', []],
    //       nroDocumento: ['', []],
    //       nombre: ['', []],
    //       departamento: ['', []],
    //       provincia: ['', []],
    //       distrito: ['', []],
    //     });

    //     this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);
    this.bandejaGrp = this.fb.group({
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

  // get getUser() { return this.user; }

  public inicializarVariables(): void {
    this.cargarTiposDocumento();
    this.cargarDepartamentos();

    // this.spinnerService.hide();
  }

  public cargarTiposDocumento() {
    this.tiposDocumento = JSON.parse(JSON.stringify(_tiposDocumento));
    this.tiposDocumento.unshift({ id: 0, nombre: 'TODOS' });
    this.bandejaGrp.get('tipoDocumento').setValue(this.tiposDocumento[0]);
  }

  public cargarDepartamentos() {
    this.departamentos = JSON.parse(JSON.stringify(_departamentos));
    this.departamentos.unshift({ id: 0, nombre: 'TODOS' });
    this.bandejaGrp.get('departamento').setValue(this.departamentos[0]);

    this.cargarProvincias();
  }

  public cargarProvincias() {
    this.provincias = JSON.parse(JSON.stringify(_provincias));
    this.provincias.unshift({ id: 0, nombre: 'TODOS' });
    this.bandejaGrp.get('provincia').setValue(this.provincias[0]);

    this.cargarDistritos();
  }

  public cargarDistritos() {
    this.distritos = JSON.parse(JSON.stringify(_distritos));
    this.distritos.unshift({ id: 0, nombre: 'TODOS' });
    this.bandejaGrp.get('distrito').setValue(this.distritos[0]);

    this.buscar();
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
    if (this.listaProveedores.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaProveedores);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  buscar() {
    let idTipoDocumento = this.bandejaGrp.get('tipoDocumento').value.id;
    let nroDocumento = this.bandejaGrp.get('nroDocumento').value;
    let nombre = this.bandejaGrp.get('nombre').value;
    let idDepartamento = this.bandejaGrp.get('departamento').value.id;
    let idProvincia = this.bandejaGrp.get('provincia').value.id;
    let idDistrito = this.bandejaGrp.get('distrito').value.id;
    this.listaProveedores = _proveedores.filter(el => (el.idTipoDocumento == idTipoDocumento) || (0 == idTipoDocumento));
    this.listaProveedores = this.listaProveedores.filter(el => (el.nroDocumento == nroDocumento) || ('' == nroDocumento));
    this.listaProveedores = this.listaProveedores.filter(el => (el.nombre == nombre) || ('' == nombre));
    this.listaProveedores = this.listaProveedores.filter(el => (el.idDepartamento == idDepartamento) || (0 == idDepartamento));
    this.listaProveedores = this.listaProveedores.filter(el => (el.idProvincia == idProvincia) || (0 == idProvincia));
    this.listaProveedores = this.listaProveedores.filter(el => (el.idDistrito == idDistrito) || (0 == idDistrito));

    this.cargarDatosTabla();
  }

  exportar() {
    console.log('Exportar');
  }

  nuevo(obj): void {
    console.log(obj);
    const dialogRef = this.dialog.open(RegProveedorComponent, {
      width: '800px',
      data: { title: 'REGISTRAR PROVEEDOR', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listaProveedores.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  modificar(obj): void {
    let indice = this.listaProveedores.indexOf(obj);
    const dialogRef = this.dialog.open(RegProveedorComponent, {
      width: '800px',
      data: { title: 'MODIFICAR PROVEEDOR', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.listaProveedores.splice(indice, 1);
        this.listaProveedores.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

}
