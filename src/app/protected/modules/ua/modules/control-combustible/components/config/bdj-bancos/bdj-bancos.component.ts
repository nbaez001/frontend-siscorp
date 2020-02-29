import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Banco } from '../../../entities/config/banco.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { _estadosBanco, _bancos } from '../../../data-combustible';
import { RegBancoComponent } from './reg-banco/reg-banco.component';

@Component({
  selector: 'app-bdj-bancos',
  templateUrl: './bdj-bancos.component.html',
  styleUrls: ['./bdj-bancos.component.scss']
})
export class BdjBancosComponent implements OnInit {
  bandejaGrp: FormGroup;
  messages = {
    'estado': {
      'required': 'Campo obligatorio'
    },
    'fecInicio': {
      'required': 'Campo obligatorio'
    },
    'fecFin': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'estado': '',
    'fecInicio': '',
    'fecFin': ''
  };

  estadosBanco = [];
  listaBancos: Banco[];

  displayedColumns: string[];
  dataSource: MatTableDataSource<Banco>;

  columnsGrilla = [
    {
      columnDef: 'id',
      header: 'N°',
      cell: (obj: Banco) => `${obj.id}`
    }, {
      columnDef: 'nombre',
      header: 'NOMBRE',
      cell: (obj: Banco) => `${obj.nombre}`
    }, {
      columnDef: 'nomTipoDocumento',
      header: 'TIPO DOCUMENTO',
      cell: (obj: Banco) => `${obj.nomTipoDocumento}`
    }, {
      columnDef: 'nroDocumento',
      header: 'NRO DOCUMENTO',
      cell: (obj: Banco) => `${obj.nroDocumento}`
    }, {
      columnDef: 'fecha',
      header: 'FECHA',
      cell: (obj: Banco) => `${this.datePipe.transform(obj.fecha, 'dd/MM/yyyy')}`
      // }, {
      //   columnDef: 'nomEstado',
      //   header: 'ESTADO',
      //   cell: (obj: Banco) => `${obj.nomEstado}`
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     this.bandejaGrp = this.fb.group({
    //       estado: ['', [Validators.required]],
    //       fecInicio: ['', [Validators.required]],
    //       fecFin: ['', [Validators.required]]
    //     });

    //     this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);
    this.bandejaGrp = this.fb.group({
      estado: ['', [Validators.required]],
      fecInicio: ['', [Validators.required]],
      fecFin: ['', [Validators.required]]
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  // get getUser() {
  //   return this.user;
  // }

  public inicializarVariables(): void {
    this.cargarEstadosBanco();

    // this.spinnerService.hide();
  }

  public cargarEstadosBanco() {
    this.estadosBanco = JSON.parse(JSON.stringify(_estadosBanco));
    this.estadosBanco.unshift({ id: 0, nombre: 'TODOS' });

    this.bandejaGrp.get('estado').setValue(this.estadosBanco[0]);

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
    this.dataSource = null;
    if (this.listaBancos.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaBancos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  buscar() {
    let idEstado = this.bandejaGrp.get('estado').value.id;
    this.listaBancos = _bancos.filter(el => (el.idEstado == idEstado) || (0 == idEstado));

    this.cargarDatosTabla();
  }

  exportar() {
    console.log('Exportar');
  }

  regBanco(obj): void {
    console.log(obj);
    const dialogRef = this.dialog.open(RegBancoComponent, {
      width: '700px',
      data: { title: 'REGISTRAR BANCO', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listaBancos.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editBanco(obj): void {
    let indice = this.listaBancos.indexOf(obj);
    const dialogRef = this.dialog.open(RegBancoComponent, {
      width: '700px',
      data: { title: 'MODIFICAR BANCO', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.listaBancos.splice(indice, 1);
        this.listaBancos.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }


}
