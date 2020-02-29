import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UNIDADES, TAMBOS, CONSUMOSDESLIZADOR } from '../../data-combustible';
import { HorasDeslizador } from '../../entities/horas-deslizador.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RegHrsDeslizadorComponent } from './reg-hrs-deslizador/reg-hrs-deslizador.component';
import { VerObservacionComponent } from '../bdj-ctrl-kilometraje/ver-observacion/ver-observacion.component';
import { DetalleObservacion } from '../../entities/detalle-observacion.model';

@Component({
  selector: 'app-bdj-hrs-deslizador',
  templateUrl: './bdj-hrs-deslizador.component.html',
  styleUrls: ['./bdj-hrs-deslizador.component.scss']
})
export class BdjHrsDeslizadorComponent implements OnInit {
  bandejaGrp: FormGroup;
  unidades = UNIDADES;
  tambos = TAMBOS;
  listaHorasDeslizador: HorasDeslizador[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<HorasDeslizador>;

  columnsGrilla = [
    {
      columnDef: 'id',
      header: 'N°',
      cell: (consumo: HorasDeslizador) => `${consumo.id}`
    }, {
      columnDef: 'unidad',
      header: 'UNIDAD',
      cell: (consumo: HorasDeslizador) => `${consumo.nomUnidad}`
    }, {
      columnDef: 'tambo',
      header: 'TAMBO',
      cell: (consumo: HorasDeslizador) => `${consumo.nomTambo}`
    }, {
      columnDef: 'descripcionBien',
      header: 'DESCRIPCION BIEN',
      cell: (consumo: HorasDeslizador) => `${consumo.descripcionBien}`
    }, {
      columnDef: 'marca',
      header: 'MARCA',
      cell: (consumo: HorasDeslizador) => `${consumo.marca}`
    }, {
      columnDef: 'serie',
      header: 'SERIE',
      cell: (consumo: HorasDeslizador) => `${consumo.serie}`
    }, {
      columnDef: 'horaInicio',
      header: 'HORA INICIO',
      cell: (consumo: HorasDeslizador) => `${consumo.horaInicio}`
    }, {
      columnDef: 'horaFin',
      header: 'HORA FIN',
      cell: (consumo: HorasDeslizador) => `${consumo.horaFin}`
    }, {
      columnDef: 'horas',
      header: 'TOTAL HORAS',
      cell: (consumo: HorasDeslizador) => `${this.decimalPipe.transform(consumo.horas, '1.2-2')}`
    }, {
      columnDef: 'lugarDestino',
      header: 'LUGAR DESTINO',
      cell: (consumo: HorasDeslizador) => (consumo.lugarDestino != null) ? `${consumo.lugarDestino}` : ''
    }, {
      columnDef: 'codComisionSISMONITOR',
      header: 'COD. COMISION SISMONITOR',
      cell: (consumo: HorasDeslizador) => (consumo.codComisionSISMONITOR != null) ? `${consumo.codComisionSISMONITOR}` : ''
    }, {
      columnDef: 'fechaComision',
      header: 'FECHA COMISION',
      cell: (consumo: HorasDeslizador) => (consumo.fechaComision != null) ? `${this.datePipe.transform(consumo.fechaComision, 'dd/MM/yyyy')}` : ''
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     this.bandejaGrp = this.fb.group({
    //       unidad: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
    //       tambo: [{ value: '', disabled: this.user.perfil.id == 1 }, [Validators.required]],
    //     });

    //     this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);
    this.bandejaGrp = this.fb.group({
      unidad: [{ value: '', disabled: false }, [Validators.required]],
      tambo: [{ value: '', disabled: false }, [Validators.required]],
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  // get getUser() {
  //   return this.user;
  // }

  public inicializarVariables(): void {
    this.dataSource = null;
    this.cargarUnidades();
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
    if (this.listaHorasDeslizador.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaHorasDeslizador);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    // if (this.user.perfil.id != 3) {
    if (true) {
      this.bandejaGrp.get('unidad').setValue(this.unidades.filter(el => el.id == 20)[0]);
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
    if (true) {
      this.bandejaGrp.get('tambo').setValue(this.tambos.filter(el => el.id == 90)[0]);
    } else {
      if (true) {
        // if (this.user.perfil.id == 2) {
        this.bandejaGrp.get('tambo').setValue(this.tambos.filter(el => el.id == 0)[0]);
      } else {
        this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
      }
    }

    this.buscar();
  }

  buscar() {
    let idUnidad = this.bandejaGrp.get('unidad').value.id;
    let idTambo = this.bandejaGrp.get('tambo').value.id;

    this.listaHorasDeslizador = CONSUMOSDESLIZADOR.filter(el => (el.idUnidad == idUnidad) || (0 == idUnidad));
    this.listaHorasDeslizador = this.listaHorasDeslizador.filter(el => (el.idTambo == idTambo) || (0 == idTambo));

    this.cargarDatosTabla();
  }

  exportarExcel() {
    let url = "http://ccombustible.elnazarenovraem.edu.pe/assets/files/reportes/control-deslizadores.xlsx";
    window.location.href = url;
  }

  regConsumo(obj): void {
    console.log(obj);
    const dialogRef = this.dialog.open(RegHrsDeslizadorComponent, {
      width: '700px',
      data: { title: 'REGISTRAR HORAS USO DESLIZADOR', objeto: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listaHorasDeslizador.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  verObsConsumo(obj: HorasDeslizador): void {
    let detObservacion = new DetalleObservacion();
    detObservacion.titulo = 'Observacion';
    detObservacion.detalle = obj.observacion;

    const dialogRef = this.dialog.open(VerObservacionComponent, {
      width: '600px',
      data: { title: 'OBSERVACION DURANTE LA INTERVENSION/COMISION', objeto: detObservacion }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
