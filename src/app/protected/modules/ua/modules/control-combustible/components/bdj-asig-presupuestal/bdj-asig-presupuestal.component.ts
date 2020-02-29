import { Component, OnInit, ViewChild } from '@angular/core';
import { AsignacionPresupuestal } from '../../entities/asignacion-presupuestal.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ANIOPRESUPUESTAL, METAS, PARTIDAS, ASIGNACIONPRESUPUESTAL } from '../../data-combustible';
import { RegAsigPresupuestalComponent } from './reg-asig-presupuestal/reg-asig-presupuestal.component';

@Component({
  selector: 'app-bdj-asig-presupuestal',
  templateUrl: './bdj-asig-presupuestal.component.html',
  styleUrls: ['./bdj-asig-presupuestal.component.scss']
})
export class BdjAsigPresupuestalComponent implements OnInit {
  anios = ANIOPRESUPUESTAL;
  metas = [];
  partidas = [];
  listaAsigPresupuestal: AsignacionPresupuestal[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<AsignacionPresupuestal>;

  bandejaGrp: FormGroup;
  messages = {
    'name': {
      'required': 'Field is required',
      'minlength': 'Insert al least 2 characters',
      'maxlength': 'Max name size 20 characters'
    }
  };

  formErrors = {
    'name': ''
  };

  id: number;
  idTipoAsignacion: number;
  nomTipoAsignacion: string;
  idPartida: number;
  nomPartida: string;
  monto: number;
  fecha: Date;

  columnsGrilla = [
    {
      columnDef: 'id',
      header: 'N°',
      cell: (asig: AsignacionPresupuestal) => `${asig.id}`
    }, {
      columnDef: 'codigoMeta',
      header: 'Codigo meta',
      cell: (asig: AsignacionPresupuestal) => `${asig.codigoMeta}`
    }, {
      columnDef: 'nomMeta',
      header: 'Nombre meta',
      cell: (asig: AsignacionPresupuestal) => `${asig.nomMeta}`
    }, {
      columnDef: 'partida',
      header: 'Partida',
      cell: (asig: AsignacionPresupuestal) => `${asig.partida}`
    }, {
      columnDef: 'descripcion',
      header: 'Descripcion partida',
      cell: (asig: AsignacionPresupuestal) => `${asig.descripcion}`
    }, {
      columnDef: 'pim',
      header: 'PIM',
      cell: (asig: AsignacionPresupuestal) => `${this.decimalPipe.transform(asig.pim, '1.2-2')}`
    }, {
      columnDef: 'certificado',
      header: 'Certificado',
      cell: (asig: AsignacionPresupuestal) => `${this.decimalPipe.transform(asig.certificado, '1.2-2')}`
    }, {
      columnDef: 'saldo',
      header: 'Saldo',
      cell: (asig: AsignacionPresupuestal) => `${this.decimalPipe.transform(asig.saldo, '1.2-2')}`
    }, {
      columnDef: 'fecha',
      header: 'Fecha',
      cell: (asig: AsignacionPresupuestal) => `${this.datePipe.transform(asig.fecha, 'dd/MM/yyyy')}`
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    // @Inject(UsuarioService) private user: UsuarioService
  ) { }

  ngOnInit() {
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     this.bandejaGrp = this.fb.group({
    //       anio: ['', [Validators.required]],
    //       meta: ['', [Validators.required]],
    //       partida: ['', [Validators.required]]
    //     });

    //     this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);
    this.bandejaGrp = this.fb.group({
      anio: ['', [Validators.required]],
      meta: ['', [Validators.required]],
      partida: ['', [Validators.required]]
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.bandejaGrp.get('anio').setValue(this.anios[0]);
    this.cargarMetas();
    this.cargarPartidas();

    // this.spinnerService.hide();
    this.buscar();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.push('opt');
  }

  public cargarMetas() {
    this.metas = JSON.parse(JSON.stringify(METAS));
    this.metas.unshift({ id: 0, codigo: '', descripcion: 'TODOS' });

    this.bandejaGrp.get('meta').setValue(this.metas[0]);
  }

  public cargarPartidas() {
    this.partidas = JSON.parse(JSON.stringify(PARTIDAS));
    this.partidas.unshift({ id: 0, nombre: 'TODOS' });

    this.bandejaGrp.get('partida').setValue(this.partidas[0]);
  }

  buscar() {
    let codigoMeta = this.bandejaGrp.get('meta').value.codigo;
    let nombrePartida = this.bandejaGrp.get('partida').value.nombre;

    this.listaAsigPresupuestal = ASIGNACIONPRESUPUESTAL.filter(el => (el.codigoMeta == codigoMeta) || ('' == codigoMeta));
    this.listaAsigPresupuestal = this.listaAsigPresupuestal.filter(el => (el.partida == nombrePartida) || ('TODOS' == nombrePartida));

    this.cargarDatosTabla();
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaAsigPresupuestal.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaAsigPresupuestal);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  exportarExcel() {
    console.log('Exportar');
  }

  regAsigPresupuestal(obj): void {
    console.log(obj);
    const dialogRef = this.dialog.open(RegAsigPresupuestalComponent, {
      width: '600px',
      data: { title: 'REGISTRAR ASIGNACION PRESUPUESTAL', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listaAsigPresupuestal.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

}
