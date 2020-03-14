import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { AsignacionPresupuestal } from '../../../entities/asignacion-presupuestal.model';
import { METAS, PARTIDAS } from '../../../data-combustible';
import { DataDialog } from '../../../entities/data-dialog.model';

@Component({
  selector: 'app-reg-asig-presupuestal',
  templateUrl: './reg-asig-presupuestal.component.html',
  styleUrls: ['./reg-asig-presupuestal.component.scss']
})
export class RegAsigPresupuestalComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'meta': {
      'required': 'Campo obligatorio'
    },
    'partida': {
      'required': 'Campo obligatorio'
    },
    'pim': {
      'required': 'Campo obligatorio'
    },
    'certificado': {
      'required': 'Campo obligatorio'
    },
    'saldo': {
      'required': 'Campo obligatorio'
    },
    'fecha': {
      'required': 'Campo obligatorio'
    }
  };

  formErrors = {
    'meta': '',
    'partida': '',
    'pim': '',
    'certificado': '',
    'saldo': '',
    'fecha': ''
  };

  metas: Object[] = METAS;
  partidas: Object[] = PARTIDAS;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RegAsigPresupuestalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    // @Inject(UsuarioService) private user: UsuarioService,
    @Inject(ValidationService) private validationService: ValidationService) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      meta: ['', [Validators.required]],
      partida: ['', [Validators.required]],
      pim: ['', [Validators.required]],
      certificado: ['', [Validators.required]],
      saldo: ['', [Validators.required]],
      fecha: [{ value: new Date() }, [Validators.required]],
    });

    this.formularioGrp.get('meta').setValue(this.metas[0]);
    this.formularioGrp.get('partida').setValue(this.partidas[0]);
  }

  guardar(): void {
    if (this.formularioGrp.valid) {
      let con = new AsignacionPresupuestal();
      con.id = 0;
      con.codigoMeta = this.formularioGrp.get('meta').value.codigo;
      con.nomMeta = this.formularioGrp.get('meta').value.nombre;
      con.partida = this.formularioGrp.get('partida').value.nombre;
      con.descripcion = this.formularioGrp.get('partida').value.descripcion;
      con.pim = this.formularioGrp.get('pim').value;
      con.certificado = this.formularioGrp.get('certificado').value;
      con.saldo = this.formularioGrp.get('saldo').value;
      con.fecha = this.formularioGrp.get('fecha').value;

      this.dialogRef.close(con);
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

}
