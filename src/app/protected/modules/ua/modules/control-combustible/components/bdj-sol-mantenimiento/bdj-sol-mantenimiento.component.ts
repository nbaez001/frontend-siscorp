import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SolicitudMant } from '../../entities/solicitud-mant.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import { UNIDADES, TAMBOS, TIPOSMANTENIMIENTO, ESTADOSOLICITUD, _solicitudesMant } from '../../data-combustible';
import { RegSolMantenimientoComponent } from './reg-sol-mantenimiento/reg-sol-mantenimiento.component';

@Component({
  selector: 'app-bdj-sol-mantenimiento',
  templateUrl: './bdj-sol-mantenimiento.component.html',
  styleUrls: ['./bdj-sol-mantenimiento.component.scss']
})
export class BdjSolMantenimientoComponent implements OnInit {
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
  estadosSolicitud = [];
  listaSolicitudes: SolicitudMant[];

  displayedColumns: string[];
  dataSource: MatTableDataSource<SolicitudMant>;

  columnsGrilla = [
    {
      columnDef: 'id',
      header: 'N°',
      cell: (mant: SolicitudMant) => (mant.id != null) ? `${mant.id}` : ''
    }, {
      columnDef: 'nomUnidad',
      header: 'UNIDAD',
      cell: (mant: SolicitudMant) => (mant.nomUnidad != null) ? `${mant.nomUnidad}` : ''
    }, {
      columnDef: 'nomTambo',
      header: 'TAMBO',
      cell: (mant: SolicitudMant) => (mant.nomTambo != null) ? `${mant.nomTambo}` : ''
    }, {
      columnDef: 'nomTipoMantenimiento',
      header: 'TIPO MANTENIMIENTO',
      cell: (mant: SolicitudMant) => (mant.nomTipoMantenimiento != null) ? `${mant.nomTipoMantenimiento}` : ''
    }, {
      columnDef: 'nomTipoVehiculo',
      header: 'DESCRIPCION BIEN',
      cell: (mant: SolicitudMant) => (mant.nomTipoVehiculo != null) ? `${mant.nomTipoVehiculo}` : ''
    }, {
      columnDef: 'marcaVehiculo',
      header: 'MARCA',
      cell: (mant: SolicitudMant) => (mant.marcaVehiculo != null) ? `${mant.marcaVehiculo}` : ''
    }, {
      columnDef: 'placaVehiculo',
      header: 'PLACA',
      cell: (mant: SolicitudMant) => (mant.placaVehiculo != null) ? `${mant.placaVehiculo}` : ''
    }, {
      columnDef: 'nomProveedor',
      header: 'PROVEEDOR',
      cell: (mant: SolicitudMant) => (mant.nomProveedor != null) ? `${mant.nomProveedor}` : ''
    }, {
      columnDef: 'nomTipoDocumento',
      header: 'TIPO DOCUMENTO',
      cell: (mant: SolicitudMant) => (mant.nomTipoDocumento != null) ? `${mant.nomTipoDocumento}` : ''
    }, {
      columnDef: 'nroDocumento',
      header: 'NRO DOCUMENTO',
      cell: (mant: SolicitudMant) => (mant.nroDocumento != null) ? `${mant.nroDocumento}` : ''
    }, {
      columnDef: 'fecha',
      header: 'FECHA',
      cell: (mant: SolicitudMant) => (mant.fecha != null) ? `${this.datePipe.transform(mant.fecha, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'monto',
      header: 'MONTO',
      cell: (mant: SolicitudMant) => (mant.monto != null) ? `${mant.monto}` : ''
    }, {
      columnDef: 'nomEstado',
      header: 'ESTADO',
      cell: (mant: SolicitudMant) => (mant.nomEstado != null) ? `${mant.nomEstado}` : ''
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe,
    private _snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);
    this.definirTabla();
    this.inicializarVariables();
  }

  // get getUser() {
  //   return this.user;
  // }

  public inicializarVariables(): void {
    this.bandejaGrp = this.fb.group({
      // unidad: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
      unidad: [{ value: '', disabled: false }, [Validators.required]],
      tambo: [{ value: '' }, [Validators.required]],
      tipoMantenimiento: ['', [Validators.required]],
      estadoSolicitud: ['', [Validators.required]],
    });

    this.cargarTipomantenimiento();
    this.cargarEstadosSolicitud();
    this.cargarUnidades();

    // this.spinnerService.hide();
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

    this.cargarTambos();
  }

  public cargarTambos() {
    let idUnidad = this.bandejaGrp.get('unidad').value.id;

    this.tambos = JSON.parse(JSON.stringify(TAMBOS.filter(tb => tb.idUnidad == idUnidad)));
    this.tambos.unshift({ id: 0, nombre: 'TODOS', idUnidad: 0 });

    // if (this.user.perfil.id == 1) {
    //   this.bandejaGrp.get('tambo').setValue(this.tambos.filter(el => el.id == this.user.idTambo)[0]);
    if (true) {
      this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
      this.bandejaGrp.get('tambo').disable();
    } else {
      // if (this.user.perfil.id == 2) {
      if (true) {
        this.bandejaGrp.get('tambo').setValue(this.tambos.filter(el => el.id == 0)[0]);
      } else {
        this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
      }
    }

    this.buscar();
  }

  public cargarTipomantenimiento() {
    this.tiposMantenimiento = JSON.parse(JSON.stringify(TIPOSMANTENIMIENTO));
    this.tiposMantenimiento.unshift({ id: 0, nombre: 'TODOS' });

    this.bandejaGrp.get('tipoMantenimiento').setValue(this.tiposMantenimiento[0]);
  }

  public cargarEstadosSolicitud() {
    this.estadosSolicitud = JSON.parse(JSON.stringify(ESTADOSOLICITUD));
    this.estadosSolicitud.unshift({ id: 0, nombre: 'TODOS' });

    this.bandejaGrp.get('estadoSolicitud').setValue(this.estadosSolicitud[0]);
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaSolicitudes.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaSolicitudes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  buscar() {
    console.log('Buscar');
    let idUnidad = this.bandejaGrp.get('unidad').value.id;
    let idTambo = this.bandejaGrp.get('tambo').value.id;
    let idTipoMantenimiento = this.bandejaGrp.get('tipoMantenimiento').value.id;
    let idEstadoSolicitud = this.bandejaGrp.get('estadoSolicitud').value.id;

    console.log('Unidad: ' + idUnidad + ' - ' + idTambo + ' - ' + idTipoMantenimiento);

    this.listaSolicitudes = _solicitudesMant.filter(el => (el.idUnidad == idUnidad || 0 == idUnidad));
    this.listaSolicitudes = this.listaSolicitudes.filter(el => (el.idTambo == idTambo || 0 == idTambo));
    this.listaSolicitudes = this.listaSolicitudes.filter(el => (el.idTipoMantenimiento == idTipoMantenimiento || 0 == idTipoMantenimiento));
    this.listaSolicitudes = this.listaSolicitudes.filter(el => (el.idEstado == idEstadoSolicitud || 0 == idEstadoSolicitud));

    this.cargarDatosTabla();
  }

  exportarExcel() {
    console.log('Exportar');
  }

  confMantenimiento(obj): void {
    // console.log(obj);
    // const dialogRef = this.dialog.open(RegConfMantVehiculoComponent, {
    //   width: '700px',
    //   data: obj
    // });

    // dialogRef.afterClosed().subscribe(result => {

    // });
  }

  solSolicitudMant(obj): void {
    // this.router.navigate(['/intranet/req-mantenimiento']);
  }

  regSolicitudMant(obj): void {
    let indice = this.listaSolicitudes.indexOf(obj);
    const dialogRef = this.dialog.open(RegSolMantenimientoComponent, {
      width: '800px',
      data: { title: 'Registrar solicitud mantenimiento', objeto: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listaSolicitudes.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  verObsSolicitudMant(obj): void {
    // const dialogRef = this.dialog.open(VerObsMantComponent, {
    //   width: '500px',
    //   data: obj
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log(result);
    // });
  }


}
