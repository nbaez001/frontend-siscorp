import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FichaIngSldaBT } from '../../entities/ficha-ing-slda-bt';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { BnsPatrimonialesService } from '../../services/bns-patrimoniales.service';
import { _dependencias, _areas, _fichasIngSldaBT } from '../../data-patrimonio';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';
import { RegAutorizIngSldaBtComponent } from './reg-autoriz-ing-slda-bt/reg-autoriz-ing-slda-bt.component';

@Component({
  selector: 'app-bdj-autoriz-ing-slda-bt',
  templateUrl: './bdj-autoriz-ing-slda-bt.component.html',
  styleUrls: ['./bdj-autoriz-ing-slda-bt.component.scss']
})
export class BdjAutorizIngSldaBtComponent implements OnInit {
  bandejaGrp: FormGroup;
  dependencias: any[] = [];
  areas: any[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<FichaIngSldaBT>;
  listaFichaIngSldaBT: FichaIngSldaBT[];

  estadosFichaIngSldaBT: Object[];

  columnsGrilla = [
    {
      columnDef: 'cidCodigo',
      header: 'N° REQUERIMIENTO',
      cell: (ficha: FichaIngSldaBT) => (ficha.cidCodigo != null) ? `${ficha.cidCodigo}-${this.datePipe.transform(ficha.fecha, 'yyyy')}` : ''
    }, {
      columnDef: 'fecha',
      header: 'FECHA',
      cell: (ficha: FichaIngSldaBT) => (ficha.fecha != null) ? `${this.datePipe.transform(ficha.fecha, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'nombreDependencia',
      header: 'RAZON SOCIAL/ EMPRESA/ OFICINA AUTORIZADA',
      cell: (ficha: FichaIngSldaBT) => (ficha.nomDependencia != null) ? `${ficha.nomDependencia}` : ''
    }, {
      columnDef: 'nomPersona',
      header: 'NOMBRE PERSONA AUTORIZADA',
      cell: (ficha: FichaIngSldaBT) => (ficha.nomPersona != null) ? `${ficha.nomPersona}` : ''
    }, {
      columnDef: 'nroDocumento',
      header: 'NRO DOCUMENTO PERSONA AUTORIZADA',
      cell: (ficha: FichaIngSldaBT) => (ficha.nroDocumento != null) ? `${ficha.nroDocumento}` : ''
    }, {
      columnDef: 'telPersona',
      header: 'TELEFONO PERSONA AUTORIZADA',
      cell: (ficha: FichaIngSldaBT) => (ficha.telPersona != null) ? `${ficha.telPersona}` : ''
    }, {
      columnDef: 'nomMotivoIngBT',
      header: 'MOTIVO INGRESO',
      cell: (ficha: FichaIngSldaBT) => (ficha.nomMotivoIngBT != null) ? `${ficha.nomMotivoIngBT}` : ''
    }, {
      columnDef: 'nomUsuario',
      header: 'USUARIO DEL BIEN',
      cell: (ficha: FichaIngSldaBT) => (ficha.nomUsuario != null) ? `${ficha.nomUsuario}` : ''
    }, {
      columnDef: 'cantBienes',
      header: 'CANT. BIENES',
      cell: (ficha: FichaIngSldaBT) => (ficha.cantBienes != null) ? `${ficha.cantBienes}` : ''
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
    if (this.listaFichaIngSldaBT.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaFichaIngSldaBT);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }


  buscar() {
    let idDependenciaIng = this.bandejaGrp.get('dependencia').value.idCodigo;
    let idAreaIng = this.bandejaGrp.get('area').value.idCodigo;
    let cidCodigo = this.bandejaGrp.get('nroDocumento').value;

    this.listaFichaIngSldaBT = JSON.parse(JSON.stringify(_fichasIngSldaBT.filter(el => (el.idDependenciaIng == idDependenciaIng || idDependenciaIng == 0))));
    this.listaFichaIngSldaBT = JSON.parse(JSON.stringify(this.listaFichaIngSldaBT.filter(el => (el.idAreaIng == idAreaIng || idAreaIng == 0))));
    this.listaFichaIngSldaBT = JSON.parse(JSON.stringify(this.listaFichaIngSldaBT.filter(el => (el.cidCodigo.includes(cidCodigo) || cidCodigo == null))));

    this.cargarDatosTabla();
  }

  nuevo() {
    const dialogRef = this.dialog.open(RegAutorizIngSldaBtComponent, {
      width: '900px',
      data: { title: 'REGISTRO AUTORIZACION DE INGRESO/SALIDA BIENES DE TERCEROS', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.listaFichaIngSldaBT.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  exportar(): void {

  }

  vista(adq): void {
    this.spinner.show();
    let params = { url: "/files/cp/Formato04-AutorizacionIngresoSalidaBT.pdf" };
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
