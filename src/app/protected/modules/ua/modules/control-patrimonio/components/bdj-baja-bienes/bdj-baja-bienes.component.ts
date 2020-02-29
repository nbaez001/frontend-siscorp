import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { _aniosAdquisicion, _mesesAdquisicion, _estadosBaja, _listaBajas } from '../../data-patrimonio';
import { RegBajaBienesComponent } from './reg-baja-bienes/reg-baja-bienes.component';
import { VerBajaBienesComponent } from './reg-baja-bienes/ver-baja-bienes/ver-baja-bienes.component';
import { Baja } from '../../entities/baja.model';

@Component({
  selector: 'app-bdj-baja-bienes',
  templateUrl: './bdj-baja-bienes.component.html',
  styleUrls: ['./bdj-baja-bienes.component.scss']
})
export class BdjBajaBienesComponent implements OnInit {
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
  dataSource: MatTableDataSource<Baja>;
  listaBaja: Baja[];

  // formasBaja: Object[];
  aniosBaja: Object[];
  mesesBaja: Object[];
  estadosBaja: Object[];

  columnsGrilla = [
    {
      columnDef: 'disposicionFinal',
      header: 'DISPOSICION FINAL',
      cell: (baja: Baja) => (baja.disposicionFinal != null) ? `${baja.disposicionFinal.nombre}` : ''
    }, {
      columnDef: 'nroDocSustentatorio',
      header: 'DOC. SUSTENTATORIO',
      cell: (baja: Baja) => (baja.nroDocSustentatorio != null) ? `${baja.nroDocSustentatorio}` : ''
    }, {
      columnDef: 'fecha',
      header: 'FECHA Baja',
      cell: (baja: Baja) => (baja.fecha != null) ? `${this.datePipe.transform(baja.fecha, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'estado',
      header: 'ESTADO',
      cell: (baja: Baja) => (baja.estado != null) ? `${baja.estado.nombre}` : ''
    }, {
      columnDef: 'totalBienes',
      header: 'TOTAL BIENES',
      cell: (baja: Baja) => (baja.totalBienes != null) ? `${baja.totalBienes}` : ''
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
      nroDocSustentatorio: ['', []],
      anioBaja: ['', []],
      mesBaja: ['', []],
      estadoBaja: ['', []],
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
    // this.comboFormaBaja();
    this.comboAniosBaja();
    this.comboMesesBaja();
    this.comboEstadoBaja();
    this.buscar();
    // this.spinnerService.hide();
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaBaja.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaBaja);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  comboAniosBaja() {
    this.aniosBaja = JSON.parse(JSON.stringify(_aniosAdquisicion));
    this.aniosBaja.unshift({ valor: 0, nombre: 'TODOS' });
    this.bandejaGrp.get('anioBaja').setValue(this.aniosBaja[0]);
  }
  comboMesesBaja() {
    this.mesesBaja = JSON.parse(JSON.stringify(_mesesAdquisicion));
    this.mesesBaja.unshift({ valor: -1, nombre: 'TODOS' });
    this.bandejaGrp.get('mesBaja').setValue(this.mesesBaja[0]);
  }
  comboEstadoBaja() {
    this.estadosBaja = JSON.parse(JSON.stringify(_estadosBaja));
    this.estadosBaja.unshift({ id: 0, nombre: 'TODOS' });
    this.bandejaGrp.get('estadoBaja').setValue(this.estadosBaja[0]);
  }

  buscar() {
    // let idformaBaja = this.bandejaGrp.get('formaBaja').value.id;
    let nroDocSustentatorio = this.bandejaGrp.get('nroDocSustentatorio').value;
    let anioBaja = this.bandejaGrp.get('anioBaja').value.valor;
    let mesBaja = this.bandejaGrp.get('mesBaja').value.valor;
    let idEstadoBaja = this.bandejaGrp.get('estadoBaja').value.id;

    this.listaBaja = JSON.parse(JSON.stringify(_listaBajas.filter(el => (el.nroDocSustentatorio.includes(nroDocSustentatorio)))));//
    this.listaBaja = this.listaBaja.filter(el => (this.datePipe.transform(el.fecha, 'yyyy') == anioBaja || anioBaja == 0));
    this.listaBaja = this.listaBaja.filter(el => (this.datePipe.transform(el.fecha, 'MM') == (mesBaja + 1) || (mesBaja + 1) == 0));
    this.listaBaja = this.listaBaja.filter(el => (el.estado.id == idEstadoBaja || idEstadoBaja == 0));
    console.log('LISTA FILTRADA');
    console.log(this.listaBaja);


    // str.includes("world");


    this.cargarDatosTabla();
  }

  nuevo() {
    const dialogRef = this.dialog.open(RegBajaBienesComponent, {
      width: '1200px',
      data: { title: 'REGISTRO DE BAJA DE BIENES', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.listaBaja.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  exportar(): void {

  }

  detalleBaja(baja): void {
    const dialogRef = this.dialog.open(VerBajaBienesComponent, {
      width: '1000px',
      data: { title: 'DETALLE DE BAJA', objeto: baja }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
