import { Component, OnInit, ViewChild } from '@angular/core';
import { _actaEtrgRcpBienes } from '../../data-patrimonio';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ActaEtrgRcpBienes } from '../../entities/acta-etrg-rcp-bienes.model';
import { DatePipe } from '@angular/common';
import { RegEtrgRcpBienesComponent } from './reg-etrg-rcp-bienes/reg-etrg-rcp-bienes.component';

@Component({
  selector: 'app-bdj-etrg-rcp-bienes',
  templateUrl: './bdj-etrg-rcp-bienes.component.html',
  styleUrls: ['./bdj-etrg-rcp-bienes.component.scss']
})
export class BdjEtrgRcpBienesComponent implements OnInit {
  bandejaGrp: FormGroup;
  dependencias: any[] = [];
  areas: any[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<ActaEtrgRcpBienes>;
  listaActaEtrgRcpBienes: ActaEtrgRcpBienes[];

  estadosActaEtrgRcpBienes: Object[];

  columnsGrilla = [
    {
      columnDef: 'cidCodigo',
      header: 'N° DOCUMENTO',
      cell: (obj: ActaEtrgRcpBienes) => (obj.cidCodigo != null) ? `${obj.cidCodigo}-${this.datePipe.transform(obj.fecha, 'yyyy')}` : ''
    }, {
      columnDef: 'fecha',
      header: 'FECHA',
      cell: (obj: ActaEtrgRcpBienes) => (obj.fecha != null) ? `${this.datePipe.transform(obj.fecha, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'nomUsuarioEtg',
      header: 'NOMBRE USUARIO QUE ENTREGA',
      cell: (obj: ActaEtrgRcpBienes) => (obj.nomUsuarioEtg != null) ? `${obj.nomUsuarioEtg}` : ''
    }, {
      columnDef: 'dniUsuarioEtg',
      header: 'DNI USUARIO ENTREGA',
      cell: (obj: ActaEtrgRcpBienes) => (obj.dniUsuarioEtg != null) ? `${obj.dniUsuarioEtg}` : ''
    }, {
      columnDef: 'dependenciaUsuarioEtg',
      header: 'DEPENDENCIA ORIGEN',
      cell: (obj: ActaEtrgRcpBienes) => (obj.dependenciaUsuarioEtg != null) ? `${obj.dependenciaUsuarioEtg}` : ''
    }, {
      columnDef: 'oficinaUsuarioEtg',
      header: 'OFICINA ORIGEN',
      cell: (obj: ActaEtrgRcpBienes) => (obj.oficinaUsuarioEtg != null) ? `${obj.oficinaUsuarioEtg}` : ''
    }, {
      columnDef: 'nomUsuarioRccion',
      header: 'NOMBRE USUARIO RECEPCIONA',
      cell: (obj: ActaEtrgRcpBienes) => (obj.nomUsuarioRccion != null) ? `${obj.nomUsuarioRccion}` : ''
    }, {
      columnDef: 'dniUsuarioRccion',
      header: 'DNI USUARIO RECEPCIONA',
      cell: (obj: ActaEtrgRcpBienes) => (obj.dniUsuarioRccion != null) ? `${obj.dniUsuarioRccion}` : ''
    }, {
      columnDef: 'dependenciaUsuarioRccion',
      header: 'DEPENDENCIA DESTINO',
      cell: (obj: ActaEtrgRcpBienes) => (obj.dependenciaUsuarioRccion != null) ? `${obj.dependenciaUsuarioRccion}` : ''
    }, {
      columnDef: 'oficinaUsuarioRccion',
      header: 'OFICINA DESTINO',
      cell: (obj: ActaEtrgRcpBienes) => (obj.oficinaUsuarioRccion != null) ? `${obj.oficinaUsuarioRccion}` : ''
    }, {
      columnDef: 'cantBienes',
      header: 'CANT. BIENES',
      cell: (obj: ActaEtrgRcpBienes) => (obj.cantBienes != null) ? `${obj.cantBienes}` : ''
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
      dependenciaOrigen: ['', []],
      areaOrigen: ['', []],
      dependenciaDestino: ['', []],
      areaDestino: ['', []],
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
    if (this.listaActaEtrgRcpBienes.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaActaEtrgRcpBienes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }


  buscar() {
    let idDependencia = this.bandejaGrp.get('dependenciaOrigen').value.cidCodigo;
    let idArea = this.bandejaGrp.get('areaOrigen').value.cidCodigo;
    let nroDocumento = this.bandejaGrp.get('nroDocumento').value;

    this.listaActaEtrgRcpBienes = _actaEtrgRcpBienes;//.filter(el => (el.idUnidad == idUnidad && el.idTambo == idTambo && el.idVehiculo == idVehiculo) || (el.idUnidad == idUnidad && el.idTambo == idTambo && 0 == idVehiculo) || (el.idUnidad == idUnidad && 0 == idTambo && 0 == idVehiculo) || (0 == idUnidad && 0 == idTambo && 0 == idVehiculo));

    this.cargarDatosTabla();
  }

  nuevo() {
    const dialogRef = this.dialog.open(RegEtrgRcpBienesComponent, {
      width: '900px',
      data: { title: 'REGISTRO ACTA DE ENTREGA - RECEPCION DE BIENES PATRIMONIALES', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.listaActaEtrgRcpBienes.unshift(result);
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
