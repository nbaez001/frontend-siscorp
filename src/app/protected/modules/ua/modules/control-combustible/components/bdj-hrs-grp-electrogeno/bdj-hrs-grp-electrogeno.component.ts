import { Component, OnInit, ViewChild } from '@angular/core';
import { UNIDADES, TAMBOS, CONSUMOSGENERADOR } from '../../data-combustible';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsumoGenerador } from '../../entities/consumo-generador.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { RegHrsGrpElectrogenoComponent } from './reg-hrs-grp-electrogeno/reg-hrs-grp-electrogeno.component';
import { VerObservacionComponent } from '../bdj-ctrl-kilometraje/ver-observacion/ver-observacion.component';
import { DetalleObservacion } from '../../entities/detalle-observacion.model';

@Component({
  selector: 'app-bdj-hrs-grp-electrogeno',
  templateUrl: './bdj-hrs-grp-electrogeno.component.html',
  styleUrls: ['./bdj-hrs-grp-electrogeno.component.scss']
})
export class BdjHrsGrpElectrogenoComponent implements OnInit {
  bandejaGrp: FormGroup;
  unidades = UNIDADES;
  tambos = TAMBOS;
  listaConsumos: ConsumoGenerador[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<ConsumoGenerador>;

  columnsGrilla = [
    {
      columnDef: 'id',
      header: 'N°',
      cell: (consumo: ConsumoGenerador) => `${consumo.id}`
    }, {
      columnDef: 'unidad',
      header: 'UNIDAD',
      cell: (consumo: ConsumoGenerador) => `${consumo.nomUnidad}`
    }, {
      columnDef: 'tambo',
      header: 'TAMBO',
      cell: (consumo: ConsumoGenerador) => `${consumo.nomTambo}`
    }, {
      columnDef: 'descripcionBien',
      header: 'DESCRIPCION BIEN',
      cell: (consumo: ConsumoGenerador) => `${consumo.descripcionBien}`
    }, {
      columnDef: 'marca',
      header: 'MARCA',
      cell: (consumo: ConsumoGenerador) => `${consumo.marca}`
    }, {
      columnDef: 'serie',
      header: 'SERIE',
      cell: (consumo: ConsumoGenerador) => `${consumo.serie}`
    }, {
      columnDef: 'horaInicio',
      header: 'HORA INICIO',
      cell: (consumo: ConsumoGenerador) => `${consumo.horaInicio}`
    }, {
      columnDef: 'horaFin',
      header: 'HORA FIN',
      cell: (consumo: ConsumoGenerador) => `${consumo.horaFin}`
    }, {
      columnDef: 'horas',
      header: 'TOTAL HORAS',
      cell: (consumo: ConsumoGenerador) => `${consumo.horas}`
    }, {
      columnDef: 'fecha',
      header: 'FECHA USO',
      cell: (consumo: ConsumoGenerador) => `${this.datePipe.transform(consumo.fecha, 'dd/MM/yyyy')}`
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     this.bandejaGrp = this.fb.group({
    //       unidad: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
    //       tambo: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
    //     });

    //     this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);
    this.bandejaGrp = this.fb.group({
      unidad: [{ value: '', disabled: true }, [Validators.required]],
      tambo: [{ value: '', disabled: true }, [Validators.required]],
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
    if (this.listaConsumos.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaConsumos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
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


    // if (this.user.perfil.id != 3) {
    //   this.bandejaGrp.get('tambo').setValue(this.tambos.filter(el => el.id == this.user.idTambo)[0]);
    if (true) {
      this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
    } else {
      this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
    }

    this.buscar();
  }

  buscar() {
    let idUnidad = this.bandejaGrp.get('unidad').value.id;
    let idTambo = this.bandejaGrp.get('tambo').value.id;

    this.listaConsumos = CONSUMOSGENERADOR.filter(el => (el.idUnidad == idUnidad) || (0 == idUnidad));
    this.listaConsumos = this.listaConsumos.filter(el => (el.idTambo == idTambo) || (0 == idTambo));

    this.cargarDatosTabla();
  }

  exportarExcel() {
    let url = "http://ccombustible.elnazarenovraem.edu.pe/assets/files/reportes/control-generadores.xlsx";
    window.location.href = url;
  }

  regConsumo(obj): void {
    console.log(obj);
    const dialogRef = this.dialog.open(RegHrsGrpElectrogenoComponent, {
      width: '700px',
      data: { title: 'REGISTRAR HORAS USO GRUPO ELECTROGENO', objeto: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listaConsumos.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  verObsConsumo(obj: ConsumoGenerador): void {
    let detObservacion = new DetalleObservacion();
    detObservacion.titulo = 'Motivo de uso';
    detObservacion.detalle = obj.observacion;

    const dialogRef = this.dialog.open(VerObservacionComponent, {
      width: '600px',
      data: { title: 'MOTIVO DE USO DE GRUPO ELECTROGENO', objeto: detObservacion }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
