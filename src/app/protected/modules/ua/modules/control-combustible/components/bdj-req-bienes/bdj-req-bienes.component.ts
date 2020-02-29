import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequerimientoBien } from '../../entities/requerimiento-bien.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UNIDADES, _estadosRequerimiento, _requerimientosBien } from '../../data-combustible';
import { RegReqCombustibleComponent } from './reg-req-combustible/reg-req-combustible.component';

@Component({
  selector: 'app-bdj-req-bienes',
  templateUrl: './bdj-req-bienes.component.html',
  styleUrls: ['./bdj-req-bienes.component.scss']
})
export class BdjReqBienesComponent implements OnInit {
  bandejaGrp: FormGroup;
  messages = {
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'tambo': {
      'required': 'Campo obligatorio'
    },
    'vehiculo': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'unidad': '',
    'tambo': '',
    'vehiculo': ''
  };

  unidades = [];
  tambos = [];
  tiposMantenimiento = [];
  tiposPresupuesto = [];
  estadosRequerimiento = [];
  listaMantenimientos: RequerimientoBien[];

  displayedColumns: string[];
  dataSource: MatTableDataSource<RequerimientoBien>;

  columnsGrilla = [
    {
      columnDef: 'id',
      header: 'N°',
      cell: (mant: RequerimientoBien) => (mant.id != null) ? `${mant.id}` : ''
    }, {
      columnDef: 'nomUnidad',
      header: 'UNIDAD',
      cell: (mant: RequerimientoBien) => (mant.nomUnidad != null) ? `${mant.nomUnidad}` : ''
    }, {
      columnDef: 'asuntoRequerimiento',
      header: 'ASUNTO REQUERIMIENTO',
      cell: (mant: RequerimientoBien) => (mant.asuntoRequerimiento != null) ? ((mant.asuntoRequerimiento.length > 70) ? `${mant.asuntoRequerimiento.substr(0, 69)}...` : `${mant.asuntoRequerimiento}`) : ''
    }, {
      columnDef: 'nroInformeReq',
      header: 'NRO INFORME REQ.',
      cell: (mant: RequerimientoBien) => (mant.nroInformeReq != null) ? `${mant.nroInformeReq}` : ''
    }, {
      columnDef: 'nroHojatramiteReq',
      header: 'NRO H.T. REQ.',
      cell: (mant: RequerimientoBien) => (mant.nroHojatramiteReq != null) ? `${mant.nroHojatramiteReq}` : ''
    }, {
      columnDef: 'fecha',
      header: 'FECHA REQUERIMIENTO',
      cell: (mant: RequerimientoBien) => (mant.fecha != null) ? `${this.datePipe.transform(mant.fecha, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'nomTipoAsigPresupuesto',
      header: 'TIPO PRESUPUESTO',
      cell: (mant: RequerimientoBien) => (mant.nomTipoAsigPresupuesto != null) ? `${mant.nomTipoAsigPresupuesto}` : ''
    }, {
      columnDef: 'codAsigPresupuesto',
      header: 'NRO. DOC. PRESUPUESTO',
      cell: (mant: RequerimientoBien) => (mant.codAsigPresupuesto != null) ? `${mant.codAsigPresupuesto}` : ''
    }, {
      columnDef: 'marcimporteAsigPresupuestoa',
      header: 'MONTO PRESUPUESTO',
      cell: (mant: RequerimientoBien) => (mant.importeAsigPresupuesto != null) ? `${this.decimalPipe.transform(mant.importeAsigPresupuesto, '1.2-2')}` : ''
    }, {
      columnDef: 'nomEstadoRequerimiento',
      header: 'ESTADO REQUERIMIENTO',
      cell: (mant: RequerimientoBien) => (mant.nomEstadoRequerimiento != null) ? `${mant.nomEstadoRequerimiento}` : ''
    }];

  conBadge: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    // @Inject(UsuarioService) private user: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     this.bandejaGrp = this.fb.group({
    //       unidad: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
    //       estadoRequerimiento: ['', [Validators.required]]
    //     });

    //     this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);
    this.bandejaGrp = this.fb.group({
      unidad: [{ value: '', disabled: false }, [Validators.required]],
      estadoRequerimiento: ['', [Validators.required]]
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  // get getUser() {
  //   return this.user;
  // }

  public inicializarVariables(): void {
    this.cargarUnidades();
    this.cargarEstadosRequerimiento();

    // this.spinnerService.hide();
    this.buscar();
  }

  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    // if (this.user.perfil.id != 3) {
    //   this.bandejaGrp.get('unidad').setValue(this.unidades.filter(el => el.id == this.user.idUnidad)[0]);
    if (true) {
      this.bandejaGrp.get('unidad').setValue(this.unidades[0]);
    } else {
      this.bandejaGrp.get('unidad').setValue(this.unidades[0]);
    }
  }

  public cargarEstadosRequerimiento() {
    this.estadosRequerimiento = JSON.parse(JSON.stringify(_estadosRequerimiento));
    this.estadosRequerimiento.unshift({ id: 0, nombre: 'TODOS' });

    this.bandejaGrp.get('estadoRequerimiento').setValue(this.estadosRequerimiento[0]);
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    this.determinarAlerta();
    this.dataSource = null;
    if (this.listaMantenimientos.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaMantenimientos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  determinarAlerta(): void {
    this.listaMantenimientos.forEach(el => {
      // if (this.user.perfil.id == 3) {
      if (true) {
        if (el.idEstadoRequerimiento == 2) {
          el.conBadge = true;
        } else {
          el.conBadge = false;
        }
      } //else {
      //   if (el.idEstadoMantenimiento == 3) {
      //     el.conBadge = true;
      //   } else {
      //     el.conBadge = false;
      //   }
      // }
    });
  }

  buscar() {
    console.log('Buscar');
    let idUnidad = this.bandejaGrp.get('unidad').value.id;
    let idEstadoRequerimiento = this.bandejaGrp.get('estadoRequerimiento').value.id;

    this.listaMantenimientos = _requerimientosBien.filter(el => (el.idUnidad == idUnidad || 0 == idUnidad));
    this.listaMantenimientos = this.listaMantenimientos.filter(el => (el.idEstadoRequerimiento == idEstadoRequerimiento || 0 == idEstadoRequerimiento));

    this.cargarDatosTabla();
  }

  exportarExcel() {
    let url = "http://ccombustible.elnazarenovraem.edu.pe/assets/files/reportes/requerimiento-bienes.xlsx";
    window.location.href = url;
  }

  solRequerimientoBien(obj): void {
    this.router.navigate(['/intranet/req-mantenimiento']);
  }

  regRequerimientoBien(obj): void {
    let indice = this.listaMantenimientos.indexOf(obj);
    const dialogRef = this.dialog.open(RegReqCombustibleComponent, {
      width: '900px',
      data: { title: 'REGISTRAR REQUERIMIENTO COMBUSTIBLE/AFINES', objeto: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}
