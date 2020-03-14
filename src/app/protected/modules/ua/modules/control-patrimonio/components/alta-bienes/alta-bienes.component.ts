import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { _adquisiciones, _formasAdquisicion, _aniosAdquisicion, _mesesAdquisicion } from '../../data-patrimonio';
import { DatePipe } from '@angular/common';
import { RegAdqMasivoComponent } from './reg-adq-masivo/reg-adq-masivo.component';
import { RegAdqIndividualComponent } from './reg-adq-individual/reg-adq-individual.component';
import { VerDetAdqComponent } from './ver-det-adq/ver-det-adq.component';
import { Adquisicion } from '../../entities/adquisicion.model';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-alta-bienes',
  templateUrl: './alta-bienes.component.html',
  styleUrls: ['./alta-bienes.component.scss']
})
export class AltaBienesComponent implements OnInit {
  brands = [
    { label: 'Audi', value: 'Audi' },
    { label: 'BMW', value: 'BMW' },
    { label: 'Fiat', value: 'Fiat' },
    { label: 'Ford', value: 'Ford' },
    { label: 'Honda', value: 'Honda' },
    { label: 'Jaguar', value: 'Jaguar' },
    { label: 'Mercedes', value: 'Mercedes' },
    { label: 'Renault', value: 'Renault' },
    { label: 'VW', value: 'VW' },
    { label: 'Volvo', value: 'Volvo' }
  ];

  bandejaGrp: FormGroup;

  displayedColumns: string[];
  dataSource: MatTableDataSource<Adquisicion>;
  listaAdquisicion: Adquisicion[];

  formasAdquisicion: Object[];
  aniosAdquisicion: Object[];
  mesesAdquisicion: Object[];
  estadosAdquisicion: Object[];

  columnsGrilla = [
    {
      columnDef: 'nomFormaAdquisicion',
      header: 'FORMA ADQUISICION',
      cell: (adquisicion: Adquisicion) => (adquisicion.adquisicion != null) ? `${adquisicion.adquisicion.nombre}` : ''
    }, {
      columnDef: 'nroDocSustentatorio',
      header: 'DOC. SUSTENTATORIO',
      cell: (adquisicion: Adquisicion) => (adquisicion.nroDocSustentatorio != null) ? `${adquisicion.nroDocSustentatorio}` : ''
    }, {
      columnDef: 'fecha',
      header: 'FECHA ADQUISICION',
      cell: (adquisicion: Adquisicion) => (adquisicion.fecha != null) ? `${this.datePipe.transform(adquisicion.fecha, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'totalBienes',
      header: 'TOTAL BIENES',
      cell: (adquisicion: Adquisicion) => (adquisicion.totalBienes != null) ? `${adquisicion.totalBienes}` : ''
    }];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading: boolean;

  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private datePipe: DatePipe, //private spinnerService: Ng4LoadingSpinnerService,
  ) { }

  ngOnInit() {
    //this.spinnerService.show();
    this.bandejaGrp = this.fb.group({
      formaAdquisicion: ['', []],
      nroDocSustentatorio: ['', []],
      anioAdquisicion: ['', []],
      mesAdquisicion: ['', []],
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.push('opt');
    this.displayedColumns.unshift('id');
  }

  public inicializarVariables(): void {
    this.comboFormaAdquisicion();
    this.comboAniosAdquisicion();
    this.comboMesesAdquisicion();
    // this.comboEstadoAdquisicion();
    this.buscar();
    // this.spinnerService.hide();
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaAdquisicion.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaAdquisicion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  comboFormaAdquisicion() {
    this.formasAdquisicion = JSON.parse(JSON.stringify(_formasAdquisicion));
    this.formasAdquisicion.unshift({ id: 0, nombre: 'TODOS' });
    this.bandejaGrp.get('formaAdquisicion').setValue(this.formasAdquisicion[0]);
  }

  comboAniosAdquisicion() {
    this.aniosAdquisicion = JSON.parse(JSON.stringify(_aniosAdquisicion));
    this.aniosAdquisicion.unshift({ valor: 0, nombre: 'TODOS' });
    this.bandejaGrp.get('anioAdquisicion').setValue(this.aniosAdquisicion[0]);
  }
  comboMesesAdquisicion() {
    this.mesesAdquisicion = JSON.parse(JSON.stringify(_mesesAdquisicion));
    this.mesesAdquisicion.unshift({ valor: -1, nombre: 'TODOS' });
    this.bandejaGrp.get('mesAdquisicion').setValue(this.mesesAdquisicion[0]);
  }
  // comboEstadoAdquisicion() {
  //   this.estadosAdquisicion = _estadosAdquisicion;
  // }

  buscar() {
    let idformaAdquisicion = this.bandejaGrp.get('formaAdquisicion').value.id;
    let nroDocSustentatorio = this.bandejaGrp.get('nroDocSustentatorio').value;
    let idAnioAdquisicion = this.bandejaGrp.get('anioAdquisicion').value.id;
    let idMesAdquisicion = this.bandejaGrp.get('mesAdquisicion').value.id;

    this.listaAdquisicion = _adquisiciones;//.filter(el => (el.idUnidad == idUnidad && el.idTambo == idTambo && el.idVehiculo == idVehiculo) || (el.idUnidad == idUnidad && el.idTambo == idTambo && 0 == idVehiculo) || (el.idUnidad == idUnidad && 0 == idTambo && 0 == idVehiculo) || (0 == idUnidad && 0 == idTambo && 0 == idVehiculo));

    this.cargarDatosTabla();
  }

  regAdqMasivo() {
    const dialogRef = this.dialog.open(RegAdqMasivoComponent, {
      width: '800px',
      data: { title: 'REGISTRO ADQUISICION MASIVO', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.listaAdquisicion.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  regAdqIndividual(): void {
    const dialogRef = this.dialog.open(RegAdqIndividualComponent, {
      width: '95%',
      minWidth: '95%',
      // maxHeight: '80vh',
      // height:'80vh',
      data: { title: 'REGISTRAR ALTA BIENES', objeto: null },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listaAdquisicion.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  exportar(): void {

  }

  verAdquisicion(adq): void {
    const dialogRef = this.dialog.open(VerDetAdqComponent, {
      width: '80%',
      data: { title: 'DETALLE ADQUISICION', objeto: adq }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}
