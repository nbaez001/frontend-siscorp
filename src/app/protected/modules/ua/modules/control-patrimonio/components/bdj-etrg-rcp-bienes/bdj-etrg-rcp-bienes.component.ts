import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { _actaEtrgRcpBienes, _dependencias, _areas } from '../../data-patrimonio';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ActaEtrgRcpBienes } from '../../entities/acta-etrg-rcp-bienes.model';
import { DatePipe } from '@angular/common';
import { RegEtrgRcpBienesComponent } from './reg-etrg-rcp-bienes/reg-etrg-rcp-bienes.component';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';
import { BnsPatrimonialesService } from '../../services/bns-patrimoniales.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-bdj-etrg-rcp-bienes',
  templateUrl: './bdj-etrg-rcp-bienes.component.html',
  styleUrls: ['./bdj-etrg-rcp-bienes.component.scss']
})
export class BdjEtrgRcpBienesComponent implements OnInit {
  bandejaGrp: FormGroup;
  dependencias: any[] = [];
  areas: any[] = [];
  dependenciasDest: any[] = [];
  areasDest: any[] = [];


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
    private spinner: NgxSpinnerService,
    @Inject(BnsPatrimonialesService) private bnsPatrimonialesService: BnsPatrimonialesService,
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
    this.comboDependencias();

    this.buscar();
    // this.spinnerService.hide();
  }

  comboDependencias(): void {
    this.dependencias = JSON.parse(JSON.stringify(_dependencias));
    this.dependencias.unshift({ idCodigo: 0, cidNombre: 'TODOS' });

    this.bandejaGrp.get('dependenciaOrigen').setValue(this.dependencias[0]);
    this.comboAreas();

    this.dependenciasDest = JSON.parse(JSON.stringify(_dependencias));
    this.dependenciasDest.unshift({ idCodigo: 0, cidNombre: 'TODOS' });

    this.bandejaGrp.get('dependenciaDestino').setValue(this.dependenciasDest[0]);
    this.comboAreas2();
  }

  comboAreas(): void {
    this.areas = [];
    let idDependencia = this.bandejaGrp.get('dependenciaOrigen').value.idCodigo;
    this.areas = JSON.parse(JSON.stringify(_areas.filter(el => (el.fidDependencia == idDependencia))));
    this.areas.unshift({ idCodigo: 0, cidNombre: 'TODOS' });

    this.bandejaGrp.get('areaOrigen').setValue(this.areas[0]);
  }

  comboAreas2(): void {
    this.areasDest = [];
    let idDependencia = this.bandejaGrp.get('dependenciaDestino').value.idCodigo;
    this.areasDest = JSON.parse(JSON.stringify(_areas.filter(el => (el.fidDependencia == idDependencia))));
    this.areasDest.unshift({ idCodigo: 0, cidNombre: 'TODOS' });

    this.bandejaGrp.get('areaDestino').setValue(this.areasDest[0]);
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
    let idDependencia = this.bandejaGrp.get('dependenciaOrigen').value.idCodigo;
    let idArea = this.bandejaGrp.get('areaOrigen').value.idCodigo;
    let idDependenciaDest = this.bandejaGrp.get('dependenciaDestino').value.idCodigo;
    let idAreaDest = this.bandejaGrp.get('areaDestino').value.idCodigo;
    let nroDocumento = this.bandejaGrp.get('nroDocumento').value;

    this.listaActaEtrgRcpBienes = JSON.parse(JSON.stringify(_actaEtrgRcpBienes.filter(el => (el.idDependenciaUsuarioEtg == idDependencia || idDependencia == 0))));
    this.listaActaEtrgRcpBienes = JSON.parse(JSON.stringify(this.listaActaEtrgRcpBienes.filter(el => (el.idOficinaUsuarioEtg == idArea || idArea == 0))));
    this.listaActaEtrgRcpBienes = JSON.parse(JSON.stringify(this.listaActaEtrgRcpBienes.filter(el => (el.idDependenciaUsuarioRccion == idDependenciaDest || idDependenciaDest == 0))));
    this.listaActaEtrgRcpBienes = JSON.parse(JSON.stringify(this.listaActaEtrgRcpBienes.filter(el => (el.idOficinaUsuarioRccion == idAreaDest || idAreaDest == 0))));
    this.listaActaEtrgRcpBienes = JSON.parse(JSON.stringify(this.listaActaEtrgRcpBienes.filter(el => (el.cidCodigo.includes(nroDocumento) || nroDocumento == null))));

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

  vista(): void {
    this.spinner.show();
    let params = { url: "/files/cp/Formato03-EntregaRecepcionBienesPatrimoniales.pdf" };
    this.bnsPatrimonialesService.getPdfModelo(params).subscribe(
      (data: any) => {
        const dialogRef = this.dialog.open(PdfViewerComponent, {
          disableClose: true,
          width: '90%',
          data: { titulo: 'VISTA PREVIA - FICHA DE ASIGNACION DE BIENES', dataBlob: data }
        });
        this.spinner.hide();
      }, error => {
        console.error(error);
        this.spinner.hide();
      });
  }


}
