import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfectacionPresFE } from '../../../../entities/config/afectacion-pres-fe.model';
import { PARTIDAS } from '../../../../data-combustible';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataDialog } from '../../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { FondoEncargo } from '../../../../entities/config/fondo-encargo.model';

@Component({
  selector: 'app-reg-fondo-ecg',
  templateUrl: './reg-fondo-ecg.component.html',
  styleUrls: ['./reg-fondo-ecg.component.scss']
})
export class RegFondoEcgComponent implements OnInit {
  formularioGrp: FormGroup;
  detFormularioGrp: FormGroup;

  partidas: Object[] = PARTIDAS;
  fileupload: any;

  columnsGrilla = [
    {
      columnDef: 'ffRb',
      header: 'FF/Rb',
      cell: (det: AfectacionPresFE) => `${det.ffRb}`
    }, {
      columnDef: 'mNemonico',
      header: 'Meta/Nmonico',
      cell: (det: AfectacionPresFE) => `${det.mNemonico}`
    }, {
      columnDef: 'clasificadorGasto',
      header: 'Clasif. Gasto',
      cell: (det: AfectacionPresFE) => `${det.clasificadorGasto}`
    }, {
      columnDef: 'descripcion',
      header: 'Descripcion',
      cell: (det: AfectacionPresFE) => `${det.descripcion}`
    }, {
      columnDef: 'monto',
      header: 'Monto',
      cell: (det: AfectacionPresFE) => `${det.monto}`
    }];

  messages = {
    'nroResAdministracion': {
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
    'observacion': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'nroResAdministracion': '',
    'fecha': '',
    'concepto': '',
    'monto': '',
    'observacion': ''
  };

  listaAfectacionPresFE: AfectacionPresFE[] = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<AfectacionPresFE>;
  messages2 = {
    'ffRb': {
      'required': 'Campo obligatorio'
    },
    'metaMnemonico': {
      'required': 'Campo obligatorio'
    },
    'clasificadorGasto': {
      'required': 'Campo obligatorio'
    },
    'descripcion': {
      'required': 'Campo obligatorio'
    },
    'monto': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors2 = {
    'ffRb': '',
    'metaMnemonico': '',
    'clasificadorGasto': '',
    'descripcion': '',
    'monto': ''
  };

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RegFondoEcgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    // @Inject(UsuarioService) private user: UsuarioService
  ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nroResAdministracion: ['', [Validators.required]],
      concepto: ['', [Validators.required]],
      monto: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
      archResAdministracion: [{ value: '', disabled: true }, [Validators.required]],
    });

    this.detFormularioGrp = this.fb.group({
      ffRb: ['', [Validators.required]],
      metaMnemonico: ['', [Validators.required]],
      clasificadorGasto: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      monto: ['', [Validators.required]]
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  public inicializarVariables(): void {

  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaAfectacionPresFE.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaAfectacionPresFE);
    }
  }

  public buscarResAdm(evt): void {
    document.getElementById('fileInput').click();
  }

  public cargarResAdm(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp.get('archResAdministracion').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.formularioGrp.get('archResAdministracion').setValue(nombreArchivo);
    }
  }

  guardar(): void {
    if (this.formularioGrp.valid) {
      let kil = new FondoEncargo();
      kil.id = 0;
      kil.concepto = this.formularioGrp.get('concepto').value;
      kil.nroResAdministracion = this.formularioGrp.get('nroResAdministracion').value;
      kil.monto = this.formularioGrp.get('monto').value;
      kil.fecha = this.formularioGrp.get('fecha').value;
      kil.observacion = this.formularioGrp.get('observacion').value;
      console.log(kil);
      this.dialogRef.close(kil);
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

  agregar() {
    if (this.detFormularioGrp.valid) {
      let kil = new AfectacionPresFE();
      kil.id = 0;
      kil.ffRb = this.detFormularioGrp.get('ffRb').value;
      kil.mNemonico = this.detFormularioGrp.get('metaMnemonico').value;
      kil.clasificadorGasto = this.detFormularioGrp.get('clasificadorGasto').value;
      kil.descripcion = this.detFormularioGrp.get('descripcion').value;
      kil.monto = this.detFormularioGrp.get('monto').value;
      console.log(kil);

      this.validationService.setAsUntouched(this.detFormularioGrp, this.messages2);
      this.listaAfectacionPresFE.push(kil);
      this.cargarDatosTabla();
    } else {
      this.validationService.getValidationErrors(this.detFormularioGrp, this.messages2, this.formErrors2, true);
    }
  }

}
