import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { _mNemonico, PARTIDAS, UNIDADES } from '../../../../data-combustible';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfectacionPresFE } from '../../../../entities/config/afectacion-pres-fe.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DataDialog } from '../../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FondoEncargo } from '../../../../entities/config/fondo-encargo.model';
import { ControlCombustibleService } from '../../../../services/control-combustible.service';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reg-sol-fonfecg',
  templateUrl: './reg-sol-fonfecg.component.html',
  styleUrls: ['./reg-sol-fonfecg.component.scss']
})
export class RegSolFonfecgComponent implements OnInit {
  nroSolFondoEncargo: string = '19-2019';
  abrevUT: string = 'UTAN';
  abrevGIT: string = 'GIT';
  abrevNombre: string = 'YGH';
  unidades = [];
  mnemonicos: any = _mNemonico;
  clasificadoresGasto: any = PARTIDAS;

  formularioGrp: FormGroup;
  messages = {
    'nombresResponsable': {
      'required': 'Campo obligatorio'
    },
    'apellidosResponsable': {
      'required': 'Campo obligatorio'
    },
    'dniResponsable': {
      'required': 'Campo obligatorio'
    },
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'cargoResponsable': {
      'required': 'Campo obligatorio'
    },
    'justificacion': {
      'required': 'Campo obligatorio'
    },
    'fechaSolicitud': {
      'required': 'Campo obligatorio'
    },
    'fecInicioEjecucion': {
      'required': 'Campo obligatorio'
    },
    'fecFinEjecucion': {
      'required': 'Campo obligatorio'
    },
    'nombreBanco': {
      'required': 'Campo obligatorio'
    },
    'cciCuenta': {
      'required': 'Campo obligatorio'
    },
    'declaracionResponsable': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'nombresResponsable': '',
    'apellidosResponsable': '',
    'dniResponsable': '',
    'unidad': '',
    'cargoResponsable': '',
    'justificacion': '',
    'fechaSolicitud': '',
    'fecInicioEjecucion': '',
    'fecFinEjecucion': '',
    'nombreBanco': '',
    'cciCuenta': '',
    'declaracionResponsable': '',
  };

  detFormularioGrp: FormGroup;
  messages2 = {
    'mnemonico': {
      'required': 'Campo obligatorio'
    },
    'clasificadorGasto': {
      'required': 'Campo obligatorio'
    },
    'nombrebnss': {
      'required': 'Campo obligatorio'
    },
    'unidadMedida': {
      'required': 'Campo obligatorio'
    },
    'cantidad': {
      'required': 'Campo obligatorio'
    },
    'precioUnitario': {
      'required': 'Campo obligatorio'
    },
    'monto': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors2 = {
    'mnemonico': '',
    'clasificadorGasto': '',
    'nombrebnss': '',
    'unidadMedida': '',
    'cantidad': '',
    'precioUnitario': '',
    'monto': '',
  };
  listaAfectacionPresFE: AfectacionPresFE[] = [];
  dataSource: MatTableDataSource<AfectacionPresFE> = null;
  displayedColumns: string[];
  columnsGrilla = [
    {
      columnDef: 'mNemonico',
      header: 'META/ NMONICO',
      cell: (cond: AfectacionPresFE) => `${cond.mNemonico}`
    }, {
      columnDef: 'clasificadorGasto',
      header: 'CLASIFICADOR GASTO',
      cell: (cond: AfectacionPresFE) => `${cond.clasificadorGasto}`
    }, {
      columnDef: 'descripcion',
      header: 'NOMBRE BIEN O SERVICIO',
      cell: (cond: AfectacionPresFE) => `${cond.descripcion}`
    }, {
      columnDef: 'unidadMedida',
      header: 'UNIDAD MEDIDA',
      cell: (cond: AfectacionPresFE) => `${cond.unidadMedida}`
    }, {
      columnDef: 'cantidad',
      header: 'CANTIDAD',
      cell: (cond: AfectacionPresFE) => `${cond.cantidad}`
    }, {
      columnDef: 'precioUnitario',
      header: 'PRECIO UNITARIO',
      cell: (cond: AfectacionPresFE) => `S/.${this.decimalPipe.transform(cond.precioUnitario, '1.2-2')}`
    }, {
      columnDef: 'monto',
      header: 'MONTO',
      cell: (cond: AfectacionPresFE) => `S/.${this.decimalPipe.transform(cond.monto, '1.2-2')}`
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegSolFonfecgComponent>,
    public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    @Inject(ControlCombustibleService) private controlCombustibleService: ControlCombustibleService,
    private spinner: NgxSpinnerService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombresResponsable: ['', [Validators.required]],
      apellidosResponsable: ['', [Validators.required]],
      dniResponsable: ['', [Validators.required]],
      unidad: ['', [Validators.required]],
      cargoResponsable: ['', [Validators.required]],
      justificacion: ['', [Validators.required]],
      fechaSolicitud: ['', [Validators.required]],
      fecInicioEjecucion: ['', [Validators.required]],
      fecFinEjecucion: ['', [Validators.required]],
      nombreBanco: ['', [Validators.required]],
      cciCuenta: ['', [Validators.required]],
      declaracionResponsable: ['Yo, {{el Responsable del fondo por Encargo}}, me comprometo a rendir cuenta documentada del fondo recibido, en el plazo señalado en la Resolución de Administración que me asigna el mismo, caso contrario autorizo de manera expresa el descuento del monto otorgado de mis haberes u honorarios profesionales, según  corresponda. De conformidad con lo establecido en la Directiva N°................................., aprobada por Resolución Directoral N°..............................., la cual declaro conocer y aceptar.', [Validators.required]],
    });

    this.detFormularioGrp = this.fb.group({
      mnemonico: ['', [Validators.required]],
      clasificadorGasto: ['', [Validators.required]],
      nombrebnss: ['', [Validators.required]],
      unidadMedida: ['', [Validators.required]],
      cantidad: ['', [Validators.required]],
      precioUnitario: ['', [Validators.required]],
      monto: ['', [Validators.required]],
    });

    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, false);
    });

    this.inicializarVariables();
  }
  // get getUser(): UsuarioService { return this.user; }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaAfectacionPresFE.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaAfectacionPresFE);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public inicializarVariables(): void {
    this.definirTabla();
    this.cargarUnidades();
  }

  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    // if (this.user.perfil.id != 3) {
    //   this.formularioGrp.get('unidad').setValue(this.unidades.filter(el => el.id == this.user.idUnidad)[0]);
    if (true) {
      this.formularioGrp.get('unidad').setValue(this.unidades[0]);
    } else {
      this.formularioGrp.get('unidad').setValue(this.unidades[0]);
    }
  }

  vista() {
    this.spinner.show();
    let params = { url: "/files/formato01-fondoEncargo.pdf" };
    this.controlCombustibleService.getPdfModelo(params).subscribe(
      (data: any) => {
        const dialogReg: MatDialogRef<PdfViewerComponent> = this.dialog.open(PdfViewerComponent, {
          disableClose: true,
          width: '90%',
          data: { titulo: 'VISTA PREVIA SOLICITUD DE OTORGAMIENTO DE ENCARGO', dataBlob: data }
        });
        this.spinner.hide();
      }, error => {
        console.error(error);
        this.spinner.hide();
      });
  }

  // _base64ToArrayBuffer(base64) {
  //   const binary_string = window.atob(base64);
  //   const len = binary_string.length;
  //   const bytes = new Uint8Array(len);
  //   for (let i = 0; i < len; i++) {
  //     bytes[i] = binary_string.charCodeAt(i);
  //   }
  //   return bytes.buffer;
  // }

  extractPdf(res) {
    let myBlob: Blob = new Blob([res], { type: 'application/pdf' });
    var fileURL = URL.createObjectURL(myBlob);
    window.open(fileURL);
  }

  agregar(): void {
    if (this.detFormularioGrp.valid) {
      let ap = new AfectacionPresFE();
      ap.id = 0;
      ap.mNemonico = this.detFormularioGrp.get('mnemonico').value.nombre;
      ap.clasificadorGasto = this.detFormularioGrp.get('clasificadorGasto').value.nombre;
      ap.descripcion = this.detFormularioGrp.get('nombrebnss').value;
      ap.unidadMedida = this.detFormularioGrp.get('unidadMedida').value;
      ap.cantidad = this.detFormularioGrp.get('cantidad').value;
      ap.precioUnitario = this.detFormularioGrp.get('precioUnitario').value;
      ap.monto = this.detFormularioGrp.get('monto').value;

      this.listaAfectacionPresFE.push(ap);
      this.validationService.setAsUntouched(this.detFormularioGrp, this.formErrors2, ["mnemonico", "clasificadorGasto"])

      this.cargarDatosTabla();
    } else {
      this.validationService.getValidationErrors(this.detFormularioGrp, this.messages2, this.formErrors2, true);
    }
  }

  guardar(): void {
    if (this.formularioGrp.valid) {
      if (this.listaAfectacionPresFE.length > 0) {
        let kil = new FondoEncargo();
        kil.id = 0;
        console.log(kil);

        this.dialogRef.close(kil);
      } else {
        this._snackBar.open('Agregue al menos un detalle de afectacion presupuestal', 'OK', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

  limpiar(): void {

  }

}
