import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FichaAsignacion } from '../../entities/ficha-asignacion.model';
import { DatePipe } from '@angular/common';
import { _fichasAsignacion } from '../../data-patrimonio';
import { RegAsigBienesComponent } from './reg-asig-bienes/reg-asig-bienes.component';

@Component({
  selector: 'app-bdj-asig-bienes',
  templateUrl: './bdj-asig-bienes.component.html',
  styleUrls: ['./bdj-asig-bienes.component.scss']
})
export class BdjAsigBienesComponent implements OnInit {
  bandejaGrp: FormGroup;
  dependencias: any[] = [];
  areas: any[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<FichaAsignacion>;
  listaFichaAsignacion: FichaAsignacion[];

  estadosFichaAsignacion: Object[];

  columnsGrilla = [
    {
      columnDef: 'cidCodigo',
      header: 'N° DOCUMENTO',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.cidCodigo != null) ? `${adquisicion.cidCodigo}-${this.datePipe.transform(adquisicion.fecInicio, 'yyyy')}` : ''
    }, {
      columnDef: 'fecInicio',
      header: 'FECHA',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.fecInicio != null) ? `${this.datePipe.transform(adquisicion.fecInicio, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'nomEmpleado',
      header: 'USUARIO',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.nomEmpleado != null) ? `${adquisicion.nomEmpleado} ${adquisicion.apeEmpleado}` : ''
    }, {
      columnDef: 'dniEmpleado',
      header: 'DNI',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.dniEmpleado != null) ? `${adquisicion.dniEmpleado}` : ''
    }, {
      columnDef: 'cargoEmpleado',
      header: 'CARGO EMPLEADO',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.cargoEmpleado != null) ? `${adquisicion.cargoEmpleado}` : ''
    }, {
      columnDef: 'local',
      header: 'LOCAL',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.local != null) ? `${adquisicion.local}` : ''
    }, {
      columnDef: 'dependencia',
      header: 'DEPENDENCIA',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.dependencia != null) ? `${adquisicion.dependencia}` : ''
    }, {
      columnDef: 'oficina',
      header: 'OFICINA',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.oficina != null) ? `${adquisicion.oficina}` : ''
    }, {
      columnDef: 'cantBienes',
      header: 'CANT. BIENES',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.cantBienes != null) ? `${adquisicion.cantBienes}` : ''
    }];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading: boolean;

  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    //this.spinnerService.show();
    this.bandejaGrp = this.fb.group({
      dependencia: ['', []],
      area: ['', []],
      nroDocumento: ['', []],
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
    // this.comboEstadoFichaAsignacion();
    this.buscar();
    // this.spinnerService.hide();
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaFichaAsignacion.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaFichaAsignacion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }


  buscar() {
    let idDependencia = this.bandejaGrp.get('dependencia').value.cidCodigo;
    let idArea = this.bandejaGrp.get('area').value.cidCodigo;
    let nroDocumento = this.bandejaGrp.get('nroDocumento').value;

    this.listaFichaAsignacion = _fichasAsignacion;//.filter(el => (el.idUnidad == idUnidad && el.idTambo == idTambo && el.idVehiculo == idVehiculo) || (el.idUnidad == idUnidad && el.idTambo == idTambo && 0 == idVehiculo) || (el.idUnidad == idUnidad && 0 == idTambo && 0 == idVehiculo) || (0 == idUnidad && 0 == idTambo && 0 == idVehiculo));

    this.cargarDatosTabla();
  }

  nuevo() {
    const dialogRef = this.dialog.open(RegAsigBienesComponent, {
      width: '900px',
      data: { title: 'REGISTRO ASIGNACION DE BIENES', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.listaFichaAsignacion.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  exportar(): void {

  }

  verDetalle(adq): void {
    console.log(adq);
    // const dialogRef = this.dialog.open(VerDetAdqComponent, {
    //   width: '80%',
    //   data: { title: 'DETALLE ADQUISICION', objeto: adq }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    // });
  }

}
