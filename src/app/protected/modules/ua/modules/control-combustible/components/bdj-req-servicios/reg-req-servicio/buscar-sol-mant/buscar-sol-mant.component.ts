import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SolicitudMant } from '../../../../entities/solicitud-mant.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DataDialog } from '../../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { UNIDADES, TAMBOS, TIPOSMANTENIMIENTO, _solicitudesMant } from '../../../../data-combustible';

@Component({
  selector: 'app-buscar-sol-mant',
  templateUrl: './buscar-sol-mant.component.html',
  styleUrls: ['./buscar-sol-mant.component.scss']
})
export class BuscarSolMantComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'tambo': {
      'required': 'Campo obligatorio'
    },
    'tipoMantenimiento': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'unidad': '',
    'tambo': '',
    'tipoMantenimiento': ''
  };

  unidades = [];
  tambos = [];
  tiposMantenimiento = [];

  listaSolicitudMant: SolicitudMant[];
  dataSource: MatTableDataSource<SolicitudMant>;
  selection = new SelectionModel<SolicitudMant>(true, []);//PARA SELECTOR
  displayedColumns: string[];
  columnsGrilla = [
    {
      columnDef: 'id',
      header: 'N°',
      cell: (cond: SolicitudMant) => `${cond.id}`
    }, {
      columnDef: 'nomTambo',
      header: 'TAMBO',
      cell: (cond: SolicitudMant) => `${cond.nomTambo}`
    }, {
      columnDef: 'nomTipoMantenimiento',
      header: 'TIPO MANTENIMIENTO',
      cell: (cond: SolicitudMant) => `${cond.nomTipoMantenimiento}`
    }, {
      columnDef: 'nomTipoVehiculo',
      header: 'VEHICULO',
      cell: (cond: SolicitudMant) => `${cond.nomTipoVehiculo} ${cond.marcaVehiculo} ${cond.placaVehiculo}`
    }, {
      columnDef: 'nomProveedor',
      header: 'PROVEEDOR',
      cell: (cond: SolicitudMant) => `${cond.nomProveedor} - ${cond.nomTipoDocumento}: ${cond.nroDocumento}`
    }, {
      columnDef: 'monto',
      header: 'MONTO',
      cell: (cond: SolicitudMant) => `S/.${this.decimalPipe.transform(cond.monto, '1.2-2')}`
    }, {
      columnDef: 'fecha',
      header: 'FECHA',
      cell: (cond: SolicitudMant) => this.datePipe.transform(cond.fecha, 'dd/MM/yyyy')
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<BuscarSolMantComponent>,
    // private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      unidad: [{ value: '', disabled: true }, [Validators.required]],
      tambo: ['', [Validators.required]],
      tipoMantenimiento: ['', []],
      inicioFecha: ['', []],
      finFecha: ['', []]
    });

    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, false);
    });

    this.inicializarVariables();
  }
  // get getUser(): UsuarioService { return this.user; }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: SolicitudMant): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('select');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaSolicitudMant.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaSolicitudMant);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public inicializarVariables(): void {
    this.definirTabla();
    this.cargarTipomantenimiento();
    this.cargarUnidades();
  }

  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    // if (this.user.perfil.id != 3) {
    //   this.formularioGrp.get('unidad').setValue(this.unidades.filter(el => el.id == this.user.idUnidad)[0]);
    if (true) {
      this.formularioGrp.get('unidad').setValue(this.unidades[0]);
    } else {
      this.formularioGrp.get('unidad').setValue(this.unidades[0]);
    }
    this.cargarTambos();
  }

  public cargarTambos() {
    let idUnidad = this.formularioGrp.get('unidad').value.id;

    this.tambos = JSON.parse(JSON.stringify(TAMBOS.filter(tb => tb.idUnidad == idUnidad)));
    this.tambos.unshift({ id: 0, nombre: 'TODOS', idUnidad: 0 });

    // if (this.user.perfil.id == 1) {
    //   this.formularioGrp.get('tambo').setValue(this.tambos.filter(el => el.id == this.user.idTambo)[0]);
    if (true) {
      this.formularioGrp.get('tambo').setValue(this.tambos[0]);
      this.formularioGrp.get('tambo').disable();
    } else {
      // if (this.user.perfil.id == 2) {
      if (true) {
        this.formularioGrp.get('tambo').setValue(this.tambos.filter(el => el.id == 0)[0]);
      } else {
        this.formularioGrp.get('tambo').setValue(this.tambos[0]);
      }
    }

    this.buscar();
  }

  public cargarTipomantenimiento() {
    this.tiposMantenimiento = JSON.parse(JSON.stringify(TIPOSMANTENIMIENTO));
    this.tiposMantenimiento.unshift({ id: 0, nombre: 'TODOS' });

    this.formularioGrp.get('tipoMantenimiento').setValue(this.tiposMantenimiento[0]);
  }

  buscar(): void {
    let idUnidad = this.formularioGrp.get('unidad').value.id;
    let idTambo = this.formularioGrp.get('tambo').value.id;
    let idTipoMantenimiento = this.formularioGrp.get('tipoMantenimiento').value.id;
    console.log('llego a buscar: ' + idUnidad + ' ' + idTambo + ' ' + idTipoMantenimiento);

    this.listaSolicitudMant = JSON.parse(JSON.stringify(_solicitudesMant));
    this.listaSolicitudMant = this.listaSolicitudMant.filter(el => (el.idUnidad == idUnidad || 0 == idUnidad));
    this.listaSolicitudMant = this.listaSolicitudMant.filter(el => (el.idTambo == idTambo || 0 == idTambo));
    this.listaSolicitudMant = this.listaSolicitudMant.filter(el => (el.idTipoMantenimiento == idTipoMantenimiento || 0 == idTipoMantenimiento));

    console.log('LISTA DE SOLICITUDES');
    console.log(this.listaSolicitudMant);

    this.cargarDatosTabla();
  }

  agregar(): void {
    this.dialogRef.close(this.selection.selected);
  }

  limpiar(){
    
  }

}
