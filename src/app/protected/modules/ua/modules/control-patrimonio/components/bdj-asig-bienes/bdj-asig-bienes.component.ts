import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FichaAsignacion } from '../../entities/ficha-asignacion.model';
import { DatePipe } from '@angular/common';
import { _fichasAsignacion, _dependencias, _areas, _estadosFichaAsignacion } from '../../data-patrimonio';
import { RegAsigBienesComponent } from './reg-asig-bienes/reg-asig-bienes.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';
import { BnsPatrimonialesService } from '../../services/bns-patrimoniales.service';
import { UaCommonService } from 'app/protected/modules/ua/services/ua-common.service';
import { _perfilesMCP, _estadosFichaAsignacionMCP } from 'app/protected/modules/ua/common-ua';

@Component({
  selector: 'app-bdj-asig-bienes',
  templateUrl: './bdj-asig-bienes.component.html',
  styleUrls: ['./bdj-asig-bienes.component.scss']
})
export class BdjAsigBienesComponent implements OnInit {
  perfiles: any = _perfilesMCP;

  bandejaGrp: FormGroup;
  dependencias: any[] = [];
  areas: any[] = [];
  estadosFichaAsignacion: any[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<FichaAsignacion>;
  listaFichaAsignacion: FichaAsignacion[];

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
      cell: (adquisicion: FichaAsignacion) => (adquisicion.nomDependencia != null) ? `${adquisicion.nomDependencia}` : ''
    }, {
      columnDef: 'oficina',
      header: 'AREA',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.nomArea != null) ? `${adquisicion.nomArea}` : ''
    }, {
      columnDef: 'estado',
      header: 'ESTADO FICHA ASIGNACION',
      cell: (adquisicion: FichaAsignacion) => (adquisicion.nomEstadoFicha != null) ? `${adquisicion.nomEstadoFicha}` : ''
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
    private spinner: NgxSpinnerService,
    @Inject(BnsPatrimonialesService) private bnsPatrimonialesService: BnsPatrimonialesService,
    @Inject(UaCommonService) private uaCommonService: UaCommonService,
  ) { }

  ngOnInit() {
    //this.spinnerService.show();
    this.bandejaGrp = this.fb.group({
      dependencia: ['', [Validators.required]],
      area: ['', [Validators.required]],
      nroDocumento: ['', []],
      estado: ['', [Validators.required]],
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

  get getUaCommonService(): UaCommonService {
    return this.uaCommonService;
  }

  inicializarVariables(): void {
    this.comboDependencias();
    this.comboEstadosFicha();
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

  comboEstadosFicha(): void {
    this.estadosFichaAsignacion = JSON.parse(JSON.stringify(_estadosFichaAsignacion));
    this.estadosFichaAsignacion.unshift({ idCodigo: 0, cidNombre: 'TODOS' });
    this.bandejaGrp.get('estado').setValue(this.estadosFichaAsignacion[0]);
  }

  cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaFichaAsignacion.length > 0) {
      this.evaluarBotonesAccion(this.listaFichaAsignacion);
      this.dataSource = new MatTableDataSource(this.listaFichaAsignacion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  evaluarBotonesAccion(lista: FichaAsignacion[]): void {
    lista.forEach(el => {
      if (this.uaCommonService.getIdPerfilMCP() == _perfilesMCP.coordPatrimonio.idCodigo && el.idEstadoFicha == _estadosFichaAsignacionMCP.confCoordPatrimonio.idCodigo) {
        el.flgConfCoordPatrimonio = true;
      } else if (this.uaCommonService.getIdPerfilMCP() == _perfilesMCP.jefeUnidad.idCodigo && el.idEstadoFicha == _estadosFichaAsignacionMCP.confJefeUnidad.idCodigo) {
        el.flgConfJefeUnidad = true;
      } else if (this.uaCommonService.getIdPerfilMCP() == _perfilesMCP.usuarioFinal.idCodigo && el.idEstadoFicha == _estadosFichaAsignacionMCP.confUsuario.idCodigo) {
        el.flgConfUsuario = true;
      } else if (this.uaCommonService.getIdPerfilMCP() == _perfilesMCP.asistPatrimonio.idCodigo && el.idEstadoFicha == _estadosFichaAsignacionMCP.confAsistPatrimonio.idCodigo) {
        el.flgConfAsistPatrimonio = true;
      }
    })
  }


  buscar() {
    let idDependencia = this.bandejaGrp.get('dependencia').value.idCodigo;
    let idArea = this.bandejaGrp.get('area').value.idCodigo;
    let nroDocumento = this.bandejaGrp.get('nroDocumento').value;
    let idEstadoFicha = this.bandejaGrp.get('estado').value.idCodigo;

    this.listaFichaAsignacion = JSON.parse(JSON.stringify(_fichasAsignacion.filter(el => (el.idDependencia == idDependencia || idDependencia == 0))));
    this.listaFichaAsignacion = JSON.parse(JSON.stringify(this.listaFichaAsignacion.filter(el => (el.idArea == idArea || idArea == 0))));
    this.listaFichaAsignacion = JSON.parse(JSON.stringify(this.listaFichaAsignacion.filter(el => (el.cidCodigo.includes(nroDocumento) || nroDocumento == null))));
    this.listaFichaAsignacion = JSON.parse(JSON.stringify(this.listaFichaAsignacion.filter(el => (el.idEstadoFicha == idEstadoFicha || idEstadoFicha == 0))));

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

  vista(adq): void {
    this.spinner.show();
    let params = { url: "/files/cp/Formato01-FichaAsignacionDeBienes.pdf" };
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

  confCoordPatrimonio(row) {
    const dialogRef = this.dialog.open(RegAsigBienesComponent, {
      width: '900px',
      data: { title: 'DETALLE ASIGNACION DE BIENES', objeto: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  confJefeUnidad(row) {
    const dialogRef = this.dialog.open(RegAsigBienesComponent, {
      width: '900px',
      data: { title: 'DETALLE ASIGNACION DE BIENES', objeto: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }


  confUsuario(row) {
    const dialogRef = this.dialog.open(RegAsigBienesComponent, {
      width: '900px',
      data: { title: 'DETALLE ASIGNACION DE BIENES', objeto: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  confAsistPatrimonio(row) {
    const dialogRef = this.dialog.open(RegAsigBienesComponent, {
      width: '900px',
      data: { title: 'DETALLE ASIGNACION DE BIENES', objeto: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}
