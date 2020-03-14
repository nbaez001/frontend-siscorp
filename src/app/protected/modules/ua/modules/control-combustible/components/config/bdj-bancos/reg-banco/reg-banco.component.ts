import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataDialog } from '../../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { Banco } from '../../../../entities/config/banco.model';
import { _estadosBanco, _tiposDocumento } from '../../../../data-combustible';

@Component({
  selector: 'app-reg-banco',
  templateUrl: './reg-banco.component.html',
  styleUrls: ['./reg-banco.component.scss']
})
export class RegBancoComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'nombre': {
      'required': 'Campo obligatorio'
    },
    'tipoDocumento': {
      'required': 'Campo obligatorio'
    },
    'nroDocumento': {
      'required': 'Campo obligatorio'
    },
    'fecha': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'nombre': '',
    'tipoDocumento': '',
    'nroDocumento': '',
    'fecha': '',
  };

  estadosBanco = [];
  tiposDocumento = [];

  // get getUser() { return this.user; }

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RegBancoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    // @Inject(UsuarioService) private user: UsuarioService,
    @Inject(ValidationService) private validationService: ValidationService) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      nroDocumento: ['', [Validators.required]],
      // estado: ['', [Validators.required]],
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.cargarEstadosBanco();
    this.cargarTiposDocumento();
  }

  public cargarEstadosBanco() {
    this.estadosBanco = JSON.parse(JSON.stringify(_estadosBanco));
  }

  public cargarTiposDocumento() {
    this.tiposDocumento = JSON.parse(JSON.stringify(_tiposDocumento));
    this.formularioGrp.get('tipoDocumento').setValue(this.tiposDocumento[0]);
  }

  guardar(): void {
    if (this.formularioGrp.valid) {
      let kil = new Banco();
      kil.id = 0;
      kil.nombre = this.formularioGrp.get('nombre').value;
      kil.idTipoDocumento = this.formularioGrp.get('tipoDocumento').value.id;
      kil.nomTipoDocumento = this.formularioGrp.get('tipoDocumento').value.nombre;
      kil.nroDocumento = this.formularioGrp.get('nroDocumento').value;
      // kil.idEstado = this.formularioGrp.get('estado').value.id;
      // kil.nomEstado = this.formularioGrp.get('estado').value.nombre;
      kil.fecha = new Date();

      this.dialogRef.close(kil);
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

}
