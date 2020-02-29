import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FichaSldaRtno } from '../../entities/ficha-slda-rtno.model';
import { DatePipe } from '@angular/common';
import { _fichasSldaRtno } from '../../data-patrimonio';
import { RegSldaRtnoComponent } from './reg-slda-rtno/reg-slda-rtno.component';

@Component({
  selector: 'app-bdj-autoriz-slda-rtno',
  templateUrl: './bdj-autoriz-slda-rtno.component.html',
  styleUrls: ['./bdj-autoriz-slda-rtno.component.scss']
})
export class BdjAutorizSldaRtnoComponent implements OnInit {
  bandejaGrp: FormGroup;
  dependencias: any[] = [];
  areas: any[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<FichaSldaRtno>;
  listaFichaSldaRtno: FichaSldaRtno[];

  estadosFichaSldaRtno: Object[];

  columnsGrilla = [
    {
      columnDef: 'cidCodigo',
      header: 'N° REQUERIMIENTO',
      cell: (ficha: FichaSldaRtno) => (ficha.cidCodigo != null) ? `${ficha.cidCodigo}-${this.datePipe.transform(ficha.fecha, 'yyyy')}` : ''
    }, {
      columnDef: 'fecha',
      header: 'FECHA',
      cell: (ficha: FichaSldaRtno) => (ficha.fecha != null) ? `${this.datePipe.transform(ficha.fecha, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'nomUsuarioRpble',
      header: 'NOMBRE RESPONSABLE',
      cell: (ficha: FichaSldaRtno) => (ficha.nomUsuarioRpble != null) ? `${ficha.nomUsuarioRpble}` : ''
    }, {
      columnDef: 'cargoUsuarioRpble',
      header: 'CARGO RESPONSABLE',
      cell: (ficha: FichaSldaRtno) => (ficha.cargoUsuarioRpble != null) ? `${ficha.cargoUsuarioRpble}` : ''
    }, {
      columnDef: 'nombreDependencia',
      header: 'RAZON SOCIAL/ EMPRESA/ OFICINA',
      cell: (ficha: FichaSldaRtno) => (ficha.nomDependencia != null) ? `${ficha.nomDependencia}` : ''
    }, {
      columnDef: 'nomRespTraslado',
      header: 'NOMBRE RESPONSABLE TRASLADO',
      cell: (ficha: FichaSldaRtno) => (ficha.nomRespTraslado != null) ? `${ficha.nomRespTraslado}` : ''
    }, {
      columnDef: 'nomMotivoSalida',
      header: 'MOTIVO SALIDA',
      cell: (ficha: FichaSldaRtno) => (ficha.nomMotivoSalida != null) ? `${ficha.nomMotivoSalida}` : ''
    }, {
      columnDef: 'docReferencia',
      header: 'DOC. REFERENCIA',
      cell: (ficha: FichaSldaRtno) => (ficha.docReferencia != null) ? `${ficha.docReferencia}` : ''
    }, {
      columnDef: 'cantBienes',
      header: 'CANT. BIENES',
      cell: (ficha: FichaSldaRtno) => (ficha.cantBienes != null) ? `${ficha.cantBienes}` : ''
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
    // this.comboEstadoFichaSldaRtno();
    this.buscar();
    // this.spinnerService.hide();
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaFichaSldaRtno.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaFichaSldaRtno);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }


  buscar() {
    let idDependencia = this.bandejaGrp.get('dependencia').value.cidCodigo;
    let nroDocumento = this.bandejaGrp.get('nroDocumento').value;

    this.listaFichaSldaRtno = _fichasSldaRtno;//.filter(el => (el.idUnidad == idUnidad && el.idTambo == idTambo && el.idVehiculo == idVehiculo) || (el.idUnidad == idUnidad && el.idTambo == idTambo && 0 == idVehiculo) || (el.idUnidad == idUnidad && 0 == idTambo && 0 == idVehiculo) || (0 == idUnidad && 0 == idTambo && 0 == idVehiculo));

    this.cargarDatosTabla();
  }

  nuevo() {
    const dialogRef = this.dialog.open(RegSldaRtnoComponent, {
      width: '900px',
      data: { title: 'REGISTRO SALIDA/RETORNO DE BIENES PATRIMONIALES', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.listaFichaSldaRtno.unshift(result);
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
