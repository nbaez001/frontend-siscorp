import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { OrdenServicio } from '../../../../entities/config/orden-servicio.model';
import { _monedas } from '../../../../data-combustible';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DetalleOrdenServicio } from '../../../../entities/config/detalle-orden-servicio.model';
import { MatTableDataSource, MatPaginator, MatStepper, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AfectacionPresOS } from '../../../../entities/config/afectacion-pres-os.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DecimalPipe, DatePipe } from '@angular/common';
import { DataDialog } from '../../../../entities/data-dialog.model';
import { BuscProveedorComponent } from '../../bdj-ord-compra/cfg-ord-compra/busc-proveedor/busc-proveedor.component';

@Component({
  selector: 'app-cfg-ord-serv',
  templateUrl: './cfg-ord-serv.component.html',
  styleUrls: ['./cfg-ord-serv.component.scss']
})
export class CfgOrdServComponent implements OnInit {
  fileupload: any;
  ordenCompra: OrdenServicio;
  monedas = _monedas;

  formularioGrp: FormGroup;
  messages = {
    'nroOrdenServicio': {
      'required': 'Campo obligatorio'
    },
    'nroExpSIAF': {
      'required': 'Campo obligatorio'
    },
    'fecha': {
      'required': 'Campo obligatorio'
    },
    'concepto': {
      'required': 'Campo obligatorio'
    },
    'monto': {
      'required': 'Campo obligatorio'
    },
    'proveedor': {
      'required': 'Campo obligatorio'
    },
    'docOrden': {
      'required': 'Campo obligatorio'
    },
    'nroCuadroAdquisicion': {
      'required': 'Campo obligatorio'
    },
    'tipoProceso': {
      'required': 'Campo obligatorio'
    },
    'nroContrato': {
      'required': 'Campo obligatorio'
    },
    'moneda': {
      'required': 'Campo obligatorio'
    },
    'tc': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'nroOrdenServicio': '',
    'nroExpSIAF': '',
    'fecha': '',
    'concepto': '',
    'monto': '',
    'proveedor': '',
    'docOrden': '',
    'nroCuadroAdquisicion': '',
    'tipoProceso': '',
    'nroContrato': '',
    'moneda': '',
    'tc': '',
  };

  formularioGrp2: FormGroup;
  messages2 = {
    'codigo': {
      'required': 'Campo obligatorio'
    },
    'unidadMedida': {
      'required': 'Campo obligatorio'
    },
    'descripcion': {
      'required': 'Campo obligatorio'
    },
    'precioTotal': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors2 = {
    'codigo': '',
    'unidadMedida': '',
    'descripcion': '',
    'precioTotal': '',
  };
  listaDetalleOC: DetalleOrdenServicio[] = [];
  dataSource2: MatTableDataSource<DetalleOrdenServicio> = null;
  displayedColumns2: string[];
  columnsGrilla2 = [
    {
      columnDef: 'codigo',
      header: 'CODIGO',
      cell: (obj: DetalleOrdenServicio) => `${obj.codigo}`
    }, {
      columnDef: 'unidadMedida',
      header: 'UNIDAD MEDIDA',
      cell: (obj: DetalleOrdenServicio) => `${obj.unidadMedida}`
    }, {
      columnDef: 'descripcion',
      header: 'DESCRIPCION',
      cell: (obj: DetalleOrdenServicio) => `${obj.descripcion}`
    }, {
      columnDef: 'precioTotal',
      header: 'TOTAL',
      cell: (obj: DetalleOrdenServicio) => `${this.decimalPipe.transform(obj.precioTotal, '1.2-2')}`
    }];


  formularioGrp3: FormGroup;
  messages3 = {
    'metaMnemonico': {
      'required': 'Campo obligatorio'
    },
    'cadenaFuncional': {
      'required': 'Campo obligatorio'
    },
    'ffRb': {
      'required': 'Campo obligatorio'
    },
    'clasificadorGasto': {
      'required': 'Campo obligatorio'
    },
    'monto': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors3 = {
    'metaMnemonico': '',
    'cadenaFuncional': '',
    'ffRb': '',
    'clasificadorGasto': '',
    'monto': '',
  };
  listaAfectacionPresOS: AfectacionPresOS[] = [];
  dataSource3: MatTableDataSource<AfectacionPresOS> = null;
  displayedColumns3: string[];
  columnsGrilla3 = [
    {
      columnDef: 'metaMnemonico',
      header: 'META/ MNEMONICO',
      cell: (obj: AfectacionPresOS) => `${obj.metaMnemonico}`
    }, {
      columnDef: 'cadenaFuncional',
      header: 'CADENA FUNCIONAL',
      cell: (obj: AfectacionPresOS) => `${obj.cadenaFuncional}`
    }, {
      columnDef: 'ffRb',
      header: 'FF/RB',
      cell: (obj: AfectacionPresOS) => `${obj.ffRb}`
    }, {
      columnDef: 'clasificadorGasto',
      header: 'CLASIFICADOR GASTO',
      cell: (obj: AfectacionPresOS) => `${obj.clasificadorGasto}`
    }, {
      columnDef: 'monto',
      header: 'MONTO',
      cell: (obj: AfectacionPresOS) => `${this.decimalPipe.transform(obj.monto, '1.2-2')}`
    }];

  @ViewChild(MatPaginator) paginator2: MatPaginator;
  @ViewChild(MatPaginator) paginator3: MatPaginator;

  @ViewChild('stepper') private myStepper: MatStepper;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<CfgOrdServComponent>,
    public dialog: MatDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nroOrdenServicio: ['', [Validators.required]],
      nroExpSIAF: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      concepto: ['', [Validators.required]],
      monto: ['', [Validators.required]],
      proveedor: ['', [Validators.required]],
      docOrden: [{ value: '', disabled: true }, []],
      nroCuadroAdquisicion: ['', []],
      tipoProceso: ['', []],
      nroContrato: ['', []],
      moneda: ['', []],
      tc: ['', []],
    });

    this.formularioGrp2 = this.fb.group({
      codigo: ['', [Validators.required]],
      unidadMedida: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precioTotal: ['', [Validators.required]],
    });

    this.formularioGrp3 = this.fb.group({
      metaMnemonico: ['', [Validators.required]],
      cadenaFuncional: ['', [Validators.required]],
      ffRb: ['', [Validators.required]],
      clasificadorGasto: ['', [Validators.required]],
      monto: ['', [Validators.required]],
    });

    this.inicializarVariables();
  }

  // get getUser() { return this.user };

  salir(): void {
    this.dialogRef.close(null);
  }

  public inicializarVariables(): void {
    this.ordenCompra = JSON.parse(JSON.stringify(this.data.objeto));
    this.formularioGrp.get('nroOrdenServicio').setValue(this.ordenCompra.nroOrdenServicio);
    this.formularioGrp.get('nroExpSIAF').setValue(this.ordenCompra.nroExpSIAF);
    this.formularioGrp.get('fecha').setValue(this.ordenCompra.fecha);
    this.formularioGrp.get('concepto').setValue(this.ordenCompra.concepto);
    this.formularioGrp.get('monto').setValue(this.ordenCompra.monto);
    this.formularioGrp.get('proveedor').setValue(this.ordenCompra.nomProveedor);

    this.definirTabla();
    // this.listarDetalleMantenimiento();
  }

  definirTabla(): void {
    this.displayedColumns2 = [];
    this.columnsGrilla2.forEach(c => {
      this.displayedColumns2.push(c.columnDef);
    });
    this.displayedColumns2.unshift('id');
    this.displayedColumns2.push('opt');

    //TABLA SEGUNDA
    this.displayedColumns3 = [];
    this.columnsGrilla3.forEach(c => {
      this.displayedColumns3.push(c.columnDef);
    });
    this.displayedColumns3.unshift('id');
    this.displayedColumns3.push('opt');
  }

  public cargarDatosTabla2(): void {
    this.dataSource2 = null;
    if (this.listaDetalleOC.length > 0) {
      this.dataSource2 = new MatTableDataSource(this.listaDetalleOC);
      this.dataSource2.paginator = this.paginator2;
    }
  }

  public cargarDatosTabla3(): void {
    this.dataSource3 = null;
    if (this.listaAfectacionPresOS.length > 0) {
      this.dataSource3 = new MatTableDataSource(this.listaAfectacionPresOS);
      this.dataSource3.paginator = this.paginator3;
    }
  }

  buscarProveedor(evt): void {
    const dialogRef3 = this.dialog.open(BuscProveedorComponent, {
      width: '800px',
      data: { title: 'Buscar proveedores', objeto: null }
    });

    dialogRef3.afterClosed().subscribe(result => {
      if (result) {
        this.formularioGrp.get('proveedor').setValue(result.nombre);
      }
    });
  }

  guardarDetalleOC(): void {
    if (this.formularioGrp2.valid) {
      let detOrden = new DetalleOrdenServicio();
      detOrden.id = 0;
      detOrden.codigo = this.formularioGrp2.get('codigo').value;
      detOrden.unidadMedida = this.formularioGrp2.get('unidadMedida').value;
      detOrden.descripcion = this.formularioGrp2.get('descripcion').value;
      detOrden.precioTotal = this.formularioGrp2.get('precioTotal').value;

      this.listaDetalleOC.push(detOrden);
      this.cargarDatosTabla2();
      this.validationService.setAsUntouched(this.formularioGrp2, this.formErrors2);
    } else {
      this.validationService.getValidationErrors(this.formularioGrp2, this.messages2, this.formErrors2, true);
    }
  }

  quitarDetalleOC(obj): void {
    let index = this.listaDetalleOC.indexOf(obj);
    this.listaDetalleOC.splice(index, 1);
    this.cargarDatosTabla2();
  }

  guardarAfectacionPres(): void {
    if (this.formularioGrp3.valid) {
      let afectPres = new AfectacionPresOS();
      afectPres.id = 0;
      afectPres.metaMnemonico = this.formularioGrp3.get('metaMnemonico').value;
      afectPres.cadenaFuncional = this.formularioGrp3.get('cadenaFuncional').value;
      afectPres.ffRb = this.formularioGrp3.get('ffRb').value;
      afectPres.clasificadorGasto = this.formularioGrp3.get('clasificadorGasto').value;
      afectPres.monto = this.formularioGrp3.get('monto').value;

      this.listaAfectacionPresOS.push(afectPres);
      this.cargarDatosTabla3();
      this.validationService.setAsUntouched(this.formularioGrp3, this.formErrors3);
    } else {
      this.validationService.getValidationErrors(this.formularioGrp3, this.messages3, this.formErrors3, true);
    }
  }

  quitarAfectacionPres(obj): void {
    let index = this.listaAfectacionPresOS.indexOf(obj);
    this.listaAfectacionPresOS.splice(index, 1);
    this.cargarDatosTabla3();
  }

  guardar(): void {
    if (this.formularioGrp.valid) {
      this.ordenCompra.id = 0;
      this.ordenCompra.nroOrdenServicio = this.formularioGrp.get('nroOrdenServicio').value;
      this.ordenCompra.nroExpSIAF = this.formularioGrp.get('nroExpSIAF').value;
      this.ordenCompra.fecha = this.formularioGrp.get('fecha').value;
      this.ordenCompra.concepto = this.formularioGrp.get('concepto').value;
      this.ordenCompra.monto = this.formularioGrp.get('monto').value;
      this.ordenCompra.nomProveedor = this.formularioGrp.get('proveedor').value;
      // this.ordenCompra.docOrden = this.formularioGrp.get('docOrden').value;
      this.ordenCompra.nroCuadroAdquisicion = this.formularioGrp.get('nroCuadroAdquisicion').value;
      this.ordenCompra.tipoProceso = this.formularioGrp.get('tipoProceso').value;
      this.ordenCompra.nroContrato = this.formularioGrp.get('nroContrato').value;
      this.ordenCompra.idMoneda = this.formularioGrp.get('moneda').value.id;
      this.ordenCompra.nomMoneda = this.formularioGrp.get('moneda').value.nombre;
      this.ordenCompra.tc = this.formularioGrp.get('tc').value;

      console.log(this.ordenCompra);
      console.log('TODO CORRECTO');
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }

  }

  public buscarOrden(evt): void {
    document.getElementById('fileInput').click();
  }

  public cargarOrden(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp.get('docOrden').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.formularioGrp.get('docOrden').setValue(nombreArchivo);
    }
  }

  anterior(stepper: MatStepper) {
    stepper.previous();
  }

  siguiente(stepper: MatStepper) {
    console.log('INDICE: ' + stepper.selectedIndex);
    if (stepper.selectedIndex == 0) {
      if (this.formularioGrp.valid) {
        stepper.next();
      } else {
        this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
      }
    } else {
      if (stepper.selectedIndex == 1) {
        //VALIDAR FORM 2
        if (this.listaDetalleOC.length > 0) {
          stepper.next();
        } else {
          this._snackBar.open('Ingrese al menos un detalle de la Orden', 'OK', { duration: 1000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] })
        }
      } else {
        //VALIDAR FORM 3
      }
    }
  }
  quitarAfectacionPresOS(el): void {

  }

  move(index: number) {
    this.myStepper.selectedIndex = index;
  }

  stepChanged(event, stepper) {
    stepper.selected.interacted = false;
  }

  limpiar(): void {

  }


}
