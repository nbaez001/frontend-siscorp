import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FichaSldaRtno } from '../../entities/ficha-slda-rtno.model';
import { DatePipe } from '@angular/common';
import { _fichasSldaRtno, _dependencias, _areas } from '../../data-patrimonio';
import { RegSldaRtnoComponent } from './reg-slda-rtno/reg-slda-rtno.component';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';
import { BnsPatrimonialesService } from '../../services/bns-patrimoniales.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private spinner: NgxSpinnerService,
    @Inject(BnsPatrimonialesService) private bnsPatrimonialesService: BnsPatrimonialesService,
  ) { }

  ngOnInit() {
    //this.spinnerService.show();
    this.bandejaGrp = this.fb.group({
      dependencia: ['', [Validators.required]],
      area: ['', [Validators.required]],
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
    this.comboDependencias();
    this.buscar();
    // this.spinnerService.hide();
  }

  comboDependencias(): void {
    this.dependencias = JSON.parse(JSON.stringify(_dependencias));
    this.dependencias.unshift({ idCodigo: 0, cidNombre: 'TODOS' });

    this.bandejaGrp.get('dependencia').setValue(this.dependencias[0]);
    this.comboAreas();
  }

  comboAreas(): void {
    this.areas = [];
    let idDependencia = this.bandejaGrp.get('dependencia').value.idCodigo;

    this.areas = JSON.parse(JSON.stringify(_areas.filter(el => (el.fidDependencia == idDependencia))));
    this.areas.unshift({ idCodigo: 0, cidNombre: 'TODOS' });
    this.bandejaGrp.get('area').setValue(this.areas[0]);
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
    let idDependencia = this.bandejaGrp.get('dependencia').value.idCodigo;
    let idArea = this.bandejaGrp.get('area').value.idCodigo;
    let nroDocumento = this.bandejaGrp.get('nroDocumento').value;

    this.listaFichaSldaRtno = JSON.parse(JSON.stringify(_fichasSldaRtno.filter(el => (el.idDependenciaSol == idDependencia || idDependencia == 0))));
    this.listaFichaSldaRtno = JSON.parse(JSON.stringify(this.listaFichaSldaRtno.filter(el => (el.idAreaSol == idArea || idArea == 0))));
    this.listaFichaSldaRtno = JSON.parse(JSON.stringify(this.listaFichaSldaRtno.filter(el => (el.cidCodigo.includes(nroDocumento) || nroDocumento == null))));

    this.cargarDatosTabla();
  }

  nuevo() {
    const dialogRef = this.dialog.open(RegSldaRtnoComponent, {
      width: '900px',
      data: { title: 'REGISTRO AUTORIZACION DE SALIDA/RETORNO DE BIENES PATRIMONIALES', objeto: null }
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

  vista(adq): void {
    this.spinner.show();
    let params = { url: "/files/cp/Formato02-AutorizacionSalidaRetornoBienesPatrimoniales.pdf" };
    this.bnsPatrimonialesService.getPdfModelo(params).subscribe(
      (data: any) => {
        const dialogRef = this.dialog.open(PdfViewerComponent, {
          disableClose: true,
          width: '90%',
          data: { titulo: 'FICHA DE ASIGNACION DE BIENES', dataBlob: data }
        });
        this.spinner.hide();
      }, error => {
        console.error(error);
        this.spinner.hide();
      });
  }

}
