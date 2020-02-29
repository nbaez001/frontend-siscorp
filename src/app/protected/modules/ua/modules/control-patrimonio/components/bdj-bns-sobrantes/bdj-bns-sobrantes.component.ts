import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DatePipe } from '@angular/common';
import { _departamentos, _estadosBien, _bienesSobrantes, _provincias, _distritos, _centrosPoblado, _unidades, _tambos } from '../../data-patrimonio';
import { RegMasivBnsSbrtsComponent } from './reg-masiv-bns-sbrts/reg-masiv-bns-sbrts.component';
import { RegIndvBnsSbrtsComponent } from './reg-indv-bns-sbrts/reg-indv-bns-sbrts.component';
import { SelectionModel } from '@angular/cdk/collections';
import { AltaBnsSobrComponent } from './alta-bns-sobr/alta-bns-sobr.component';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { BienSobrante } from '../../entities/bien-sobrante.model';

@Component({
  selector: 'app-bdj-bns-sobrantes',
  templateUrl: './bdj-bns-sobrantes.component.html',
  styleUrls: ['./bdj-bns-sobrantes.component.scss']
})
export class BdjBnsSobrantesComponent implements OnInit {
  formularioGrp: FormGroup;

  listaIngresoPatrimonio: BienSobrante[] = [];

  departamentos: any[];
  provincias: any[];
  distritos: any[];
  centrosPoblados: any[];
  estadosBienesSobrantes: any[];
  unidades: any[];
  tambos: any[];

  displayedColumns: string[];
  dataSource: MatTableDataSource<BienSobrante>;
  listaBienesSobrante: BienSobrante[];
  selection = new SelectionModel<BienSobrante>(true, []);//PARA SELECTOR
  columnsGrilla = [
    {
      columnDef: 'unidad',
      header: 'UNIDAD',
      cell: (bn: BienSobrante) => (bn.unidad != null) ? `${bn.unidad.nombre}` : ''
    }, {
      columnDef: 'tambo',
      header: 'TAMBO',
      cell: (bn: BienSobrante) => (bn.tambo != null) ? `${bn.tambo.nombre}` : ''
    }, {
      columnDef: 'codigo',
      header: 'CODIGO INTERNO',
      cell: (bn: BienSobrante) => (bn.codigo != null) ? `${bn.codigo}` : ''
    }, {
      columnDef: 'denominacion',
      header: 'DESCRIPCION BIEN',
      cell: (bn: BienSobrante) => (bn.denominacion != null) ? `${bn.denominacion.cidNombre}` : ''
    }, {
      columnDef: 'marca',
      header: 'MARCA',
      cell: (bn: BienSobrante) => (bn.marca != null) ? `${bn.marca.cidNombre}` : ''
    }, {
      columnDef: 'modelo',
      header: 'MODELO',
      cell: (bn: BienSobrante) => (bn.modelo != null) ? `${bn.modelo.cidNombre}` : ''
    }, {
      columnDef: 'color',
      header: 'COLOR',
      cell: (bn: BienSobrante) => (bn.color != null) ? `${this.mostrarColor(bn.color)}` : ''
    }, {
      columnDef: 'serie',
      header: 'SERIE',
      cell: (bn: BienSobrante) => (bn.cidSerie != null) ? `${bn.cidSerie}` : ''
    }, {
      columnDef: 'medida',
      header: 'MEDIDA',
      cell: (bn: BienSobrante) => (bn.txtMedida != null) ? `${bn.txtMedida}` : ''
    }, {
      columnDef: 'anio',
      header: 'AÑO',
      cell: (bn: BienSobrante) => (bn.anio != null) ? `${bn.anio}` : ''
    }, {
      columnDef: 'placa',
      header: 'PLACA',
      cell: (bn: BienSobrante) => (bn.placa != null) ? `${bn.placa}` : ''
    }, {
      columnDef: 'chasis',
      header: 'CHASIS',
      cell: (bn: BienSobrante) => (bn.chasis != null) ? `${bn.chasis}` : ''
    }, {
      columnDef: 'motor',
      header: 'MOTOR',
      cell: (bn: BienSobrante) => (bn.motor != null) ? `${bn.motor}` : ''
    }, {
      columnDef: 'nomEstado',
      header: 'ESTADO',
      cell: (bn: BienSobrante) => (bn.estado != null) ? `${bn.estado.nombre}` : ''
    }, {
      columnDef: 'comentarios',
      header: 'COMENTARIOS',
      cell: (bn: BienSobrante) => (bn.txtObservacion != null) ? (bn.txtObservacion.length > 60 ? `${bn.txtObservacion.substr(0, 59)}...` : `${bn.txtObservacion}`) : ''
    }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading: boolean;

  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private datePipe: DatePipe, //private spinnerService: Ng4LoadingSpinnerService,
  ) { }

  ngOnInit() {
    // this.spinnerService.show();
    this.formularioGrp = this.fb.group({
      unidad: ['', []],
      tambo: ['', []],
      estadoBien: ['', []],
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  comboUnidades(): void {
    this.unidades = JSON.parse(JSON.stringify(_unidades));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });
    this.formularioGrp.get('unidad').setValue(this.unidades[0]);
    this.comboTambos();
  }

  comboTambos(): void {
    let idUnidad = this.formularioGrp.get('unidad').value.id;
    this.tambos = JSON.parse(JSON.stringify(_tambos.filter(el => el.idUnidad == idUnidad)));
    this.tambos.unshift({ id: 0, nombre: 'TODOS' });
    this.formularioGrp.get('tambo').setValue(this.tambos[0]);
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
    if (this.isAllSelected()) {
      this.selection.clear();
      this.listaIngresoPatrimonio = [];
    } else {
      this.listaIngresoPatrimonio = [];
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        this.listaIngresoPatrimonio.push(row);
      });
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BienSobrante): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  seleccion(row: BienSobrante): void {
    this.selection.toggle(row)
    if (!this.selection.isSelected(row)) {
      let index = this.listaIngresoPatrimonio.indexOf(row);
      this.listaIngresoPatrimonio.splice(index, 1);
    } else {
      this.listaIngresoPatrimonio.push(row);
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
    this.comboEstadoBienSobrante();
    this.buscar();
    // this.spinnerService.hide();
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaBienesSobrante.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaBienesSobrante);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  comboEstadoBienSobrante() {
    this.estadosBienesSobrantes = _estadosBien;
    this.estadosBienesSobrantes.unshift({ id: 0, nombre: 'TODOS' });

    this.formularioGrp.get('estadoBien').setValue(this.estadosBienesSobrantes[0]);
  }

  buscar() {
    let idUnidad = this.formularioGrp.get('unidad').value.id;
    let idTambo = this.formularioGrp.get('tambo').value.id;

    this.listaBienesSobrante = JSON.parse(JSON.stringify(_bienesSobrantes.filter(el => (el.unidad.id == idUnidad) || (idUnidad == 0))));
    this.listaBienesSobrante = this.listaBienesSobrante.filter(el => (el.tambo.id == idTambo) || (idTambo == 0));
    this.cargarDatosTabla();
  }

  regAdqMasivo() {
    const dialogRef = this.dialog.open(RegMasivBnsSbrtsComponent, {
      width: '800px',
      data: { title: 'REGISTRO MASIVO DE BIENES SOBRANTES', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  regAdqIndividual(): void {
    const dialogRef = this.dialog.open(RegIndvBnsSbrtsComponent, {
      width: '95%',
      minWidth: '95%',
      data: { title: 'REGISTRO INDIVIDUAL DE BIENES SOBRANTES', objeto: null },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.length > 0) {
        result.reverse();
        result.forEach(el => {
          this.listaBienesSobrante.unshift(el);
        });
        this.cargarDatosTabla();
      }
    });
  }

  exportar(): void {

  }

  verBienSobrante(): void {

  }

  ingresarPatrimonio(): void {
    if (!this.selection.isEmpty()) {
      const dialogRef = this.dialog.open(AltaBnsSobrComponent, {
        width: '95%',
        minWidth: '95%',
        data: { title: 'INGRESO DE BIENES SOBRANTES A PATRIMONIO', objeto: this.selection.selected },
        disableClose: false
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let lista = result.lista;

          lista.forEach(el2 => {
            this.listaBienesSobrante.forEach(el => {
              if (el2 == el) {
                let idx = this.listaBienesSobrante.indexOf(el);
                this.listaBienesSobrante.splice(idx, 1);
              }
            });
          });
          console.log(this.listaBienesSobrante);
          this.cargarDatosTabla();
        }
      });
    } else {
      const dialogRef = this.dialog.open(InfoMessageComponent, {
        data: { title: 'ALERTA', message: 'SELECCIONE AL MENOS UN BIEN SOBRANTE', message2: null, alerta: true, confirmacion: false, valor: null },
        disableClose: false
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
        }
      });
    }
  }

  verAdquisicion() {

  }

}
