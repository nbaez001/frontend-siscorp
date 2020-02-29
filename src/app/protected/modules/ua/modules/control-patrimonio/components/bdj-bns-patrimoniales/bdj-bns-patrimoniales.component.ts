import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DatePipe, DecimalPipe } from '@angular/common';
import { _unidades, _tambos, _bienesPatrimoniales, _estadoBienPatrimonio } from '../../data-patrimonio';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { BienPatrimonio } from '../../entities/bien-patrimonio.model';

@Component({
  selector: 'app-bdj-bns-patrimoniales',
  templateUrl: './bdj-bns-patrimoniales.component.html',
  styleUrls: ['./bdj-bns-patrimoniales.component.scss']
})
export class BdjBnsPatrimonialesComponent implements OnInit {
  bandejaGrp: FormGroup;
  listaBaja: BienPatrimonio[] = [];

  unidades: any[];
  tambos: any[];
  estadosBien: any[];

  displayedColumns: string[];
  dataSource: MatTableDataSource<BienPatrimonio>;
  listaBienesPatrimonio: BienPatrimonio[];
  selection = new SelectionModel<BienPatrimonio>(true, []);//PARA SELECTOR
  columnsGrilla = [
    {
      columnDef: 'unidad',
      header: 'UNIDAD',
      cell: (bn: BienPatrimonio) => (bn.unidad != null) ? `${bn.unidad.nombre}` : ''
    }, {
      columnDef: 'tambo',
      header: 'TAMBO',
      cell: (bn: BienPatrimonio) => (bn.tambo != null) ? `${bn.tambo.nombre}` : ''
    }, {
      columnDef: 'codPatrimonio',
      header: 'CODIGO PATRIMONIO',
      cell: (bn: BienPatrimonio) => (bn.codPatrimonio != null) ? `${bn.codPatrimonio}` : ''
    }, {
      columnDef: 'denominacion',
      header: 'DESCRIPCION BIEN',
      cell: (bn: BienPatrimonio) => (bn.denominacion != null) ? `${bn.denominacion.cidNombre}` : ''
    }, {
      columnDef: 'marca',
      header: 'MARCA',
      cell: (bn: BienPatrimonio) => (bn.marca != null) ? `${bn.marca.nombre}` : ''
    }, {
      columnDef: 'modelo',
      header: 'MODELO',
      cell: (bn: BienPatrimonio) => (bn.modelo != null) ? `${bn.modelo.nombre}` : ''
    }, {
      columnDef: 'color',
      header: 'COLOR',
      cell: (bn: BienPatrimonio) => (bn.color != null) ? `${this.mostrarColor(bn.color)}` : ''
    }, {
      columnDef: 'serie',
      header: 'SERIE',
      cell: (bn: BienPatrimonio) => (bn.cidSerie != null) ? `${bn.cidSerie}` : ''
    }, {
      columnDef: 'medida',
      header: 'MEDIDA',
      cell: (bn: BienPatrimonio) => (bn.txtMedida != null) ? `${bn.txtMedida}` : ''
    }, {
      columnDef: 'anio',
      header: 'AÑO',
      cell: (bn: BienPatrimonio) => (bn.anio != null) ? `${bn.anio}` : ''
    }, {
      columnDef: 'placa',
      header: 'PLACA',
      cell: (bn: BienPatrimonio) => (bn.placa != null) ? `${bn.placa}` : ''
    }, {
      columnDef: 'chasis',
      header: 'CHASIS',
      cell: (bn: BienPatrimonio) => (bn.chasis != null) ? `${bn.chasis}` : ''
    }, {
      columnDef: 'motor',
      header: 'MOTOR',
      cell: (bn: BienPatrimonio) => (bn.motor != null) ? `${bn.motor}` : ''
    }, {
      columnDef: 'nomEstado',
      header: 'ESTADO',
      cell: (bn: BienPatrimonio) => (bn.estado != null) ? `${bn.estado.nombre}` : ''
    }, {
      columnDef: 'caracteristica',
      header: 'CARACTERISTICAS',
      cell: (bn: BienPatrimonio) => (bn.txtCaracteristica != null) ? (bn.txtCaracteristica.length > 60 ? `${bn.txtCaracteristica.substr(0, 59)}...` : `${bn.txtCaracteristica}`) : ''
    }, {
      columnDef: 'codigoCuenta',
      header: 'CUENTA',
      cell: (bn: BienPatrimonio) => (bn.cuenta.codigo != null) ? bn.cuenta.codigo : ''
    }, {
      columnDef: 'nombreCuenta',
      header: 'DESCRIPCION DE LA CUENTA',
      cell: (bn: BienPatrimonio) => (bn.cuenta.nombre != null) ? bn.cuenta.nombre : ''
    }, {
      columnDef: 'fechaRegistro',
      header: 'FECHA REGISTRO',
      cell: (bn: BienPatrimonio) => this.datePipe.transform(bn.fechaRegistro, 'dd/MM/yyyy')
    }, {
      columnDef: 'fechaContabilidad',
      header: 'FECHA CONTABILIDAD',
      cell: (bn: BienPatrimonio) => this.datePipe.transform(bn.fechaContabilidad, 'dd/MM/yyyy')
    }, {
      columnDef: 'nroDocAdquisicion',
      header: 'NRO. DOC. ADQUISICION',
      cell: (bn: BienPatrimonio) => (bn.nroDocAdquisicion != null) ? bn.nroDocAdquisicion : ''
    }, {
      columnDef: 'valorAdquisicion',
      header: 'VALOR ADQUISICION',
      cell: (bn: BienPatrimonio) => this.decimalPipe.transform(bn.valorAdquisicion, '1.2-2')
    }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading: boolean;

  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private router: Router,
  ) { }

  ngOnInit() {
    // this.spinnerService.show();
    this.bandejaGrp = this.fb.group({
      unidad: ['', []],
      tambo: ['', []],
      nombreBien: ['', []],
      codigoPatrimonio: ['', []],
      estadoBien: ['', []],

    });

    this.definirTabla();
    this.inicializarVariables();
  }

  mostrarColor(lista: any) {
    let colores = '';
    lista.forEach(el => {
      colores += el.nombre + ',';
    });
    return colores.substr(0, lista.length - 2);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    if (this.isAllSelected()) {
      this.selection.clear();
      this.listaBaja = [];
    } else {
      this.listaBaja = [];
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        this.listaBaja.push(row);
      });
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BienPatrimonio): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  seleccion(row: BienPatrimonio): void {
    this.selection.toggle(row)
    if (!this.selection.isSelected(row)) {
      let index = this.listaBaja.indexOf(row);
      this.listaBaja.splice(index, 1);
    } else {
      this.listaBaja.push(row);
    }
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.push('opt');
    this.displayedColumns.unshift('id');
    this.displayedColumns.unshift('select');
  }

  public inicializarVariables(): void {
    this.comboUnidades();
    this.comboEstadoBienes();
    // this.comboEstadoBienPatrimonio();
    this.buscar();
    // this.spinnerService.hide();
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaBienesPatrimonio.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaBienesPatrimonio);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  // comboEstadoBienPatrimonio() {
  //   this.estadosBienesSobrantes = _estadosBien;
  //   this.estadosBienesSobrantes.unshift({ id: 0, nombre: 'TODOS' });

  //   this.bandejaGrp.get('estadoBien').setValue(this.estadosBienesSobrantes[0]);
  // }

  comboUnidades() {
    this.unidades = JSON.parse(JSON.stringify(_unidades));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    this.bandejaGrp.get('unidad').setValue(this.unidades[0]);
    this.comboTambos();
  }

  comboEstadoBienes() {
    this.estadosBien = JSON.parse(JSON.stringify(_estadoBienPatrimonio));
    this.estadosBien.unshift({ id: 0, nombre: 'TODOS' });

    this.bandejaGrp.get('estadoBien').setValue(this.estadosBien[0]);
  }

  comboTambos() {
    let idUnidad = this.bandejaGrp.get('unidad').value.id;
    this.tambos = _tambos.filter(el => (el.idUnidad == idUnidad));
    this.tambos.unshift({ id: 0, nombre: 'TODOS' });

    this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
  }

  buscar() {
    let idUnidad = this.bandejaGrp.get('unidad').value.id;
    let idTambo = this.bandejaGrp.get('tambo').value.id;

    this.listaBienesPatrimonio = _bienesPatrimoniales.filter(el => (el.unidad.id == idUnidad) || (idUnidad == 0));
    this.listaBienesPatrimonio = this.listaBienesPatrimonio.filter(el => (el.tambo.id == idTambo) || (idTambo == 0));

    console.log('LISTA DE BIENES');
    console.log(this.listaBienesPatrimonio);
    this.cargarDatosTabla();
  }

  // regAdqMasivo() {
  //   const dialogRef = this.dialog.open(RegMasivBnsSbrtsComponent, {
  //     width: '800px',
  //     data: null
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(result);
  //   });
  // }

  // regAdqIndividual(): void {
  //   const dialogRef = this.dialog.open(RegIndvBnsSbrtsComponent, {
  //     width: '95%',
  //     minWidth: '95%',
  //     data: null,
  //     disableClose: true
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != null && result.length > 0) {
  //       result.reverse();
  //       result.forEach(el => {
  //         this.listaBienesPatrimonio.unshift(el);
  //       });
  //       this.cargarDatosTabla();
  //     }
  //   });
  // }

  exportar(): void {

  }

  verBienPatrimonio(): void {

  }

  bajaBienes(): void {
    // this.ro
    // this.router.navigate('/about');
    this.router.navigate(['/sesion/login']);
  }

}
