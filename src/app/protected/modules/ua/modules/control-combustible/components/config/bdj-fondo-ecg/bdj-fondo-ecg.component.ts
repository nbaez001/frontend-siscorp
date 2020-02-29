import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FondoEncargo } from '../../../entities/config/fondo-encargo.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RegFondoEcgComponent } from './reg-fondo-ecg/reg-fondo-ecg.component';
import { _fondosEncargo } from '../../../data-combustible';

@Component({
  selector: 'app-bdj-fondo-ecg',
  templateUrl: './bdj-fondo-ecg.component.html',
  styleUrls: ['./bdj-fondo-ecg.component.scss']
})
export class BdjFondoEcgComponent implements OnInit {
  bandejaGrp: FormGroup;
  listaFE: FondoEncargo[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<FondoEncargo>;

  columnsGrilla = [
    {
      columnDef: 'id',
      header: 'N°',
      cell: (orden: FondoEncargo) => `${orden.id}`
    }, {
      columnDef: 'nroResAdministracion',
      header: 'N° Res. Administracion',
      cell: (orden: FondoEncargo) => `${orden.nroResAdministracion}-${this.datePipe.transform(orden.fecha, 'yyyy')}`
    }, {
      columnDef: 'concepto',
      header: 'Concepto',
      cell: (orden: FondoEncargo) => `${orden.concepto}`
    }, {
      columnDef: 'fecha',
      header: 'Fecha',
      cell: (orden: FondoEncargo) => this.datePipe.transform(orden.fecha, 'dd/MM/yyyy')
    }, {
      columnDef: 'monto',
      header: 'Monto',
      cell: (orden: FondoEncargo) => `${this.decimalPipe.transform(orden.monto, '1.2-2')}`
    }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    // @Inject(UsuarioService) private user: UsuarioService
  ) { }

  ngOnInit() {
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     this.bandejaGrp = this.fb.group({
    //       name: ['', [Validators.required]]
    //     });

    //     this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);
    this.bandejaGrp = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.dataSource = null;
    this.buscar();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    if (this.listaFE.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaFE);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  buscar() {
    this.listaFE = JSON.parse(JSON.stringify(_fondosEncargo));
    this.cargarDatosTabla();
  }

  exportarExcel() {
    console.log('Exportar');
  }

  nuevo(evt) {
    const dialogRef = this.dialog.open(RegFondoEcgComponent, {
      width: '700px',
      data: { title: 'REGISTRAR FONDO POR ENCARGO', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listaFE.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  exportar() {

  }


}
