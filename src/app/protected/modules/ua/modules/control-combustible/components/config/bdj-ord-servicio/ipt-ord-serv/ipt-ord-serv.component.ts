import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataDialog } from '../../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { _estadosOrden } from '../../../../data-combustible';
import { OrdenServicio } from '../../../../entities/config/orden-servicio.model';

@Component({
  selector: 'app-ipt-ord-serv',
  templateUrl: './ipt-ord-serv.component.html',
  styleUrls: ['./ipt-ord-serv.component.scss']
})
export class IptOrdServComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'nroOrdenServicio': {
      'required': 'Campo obligatorio'
    },
    'anioOrdenServicio': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'nroOrdenServicio': '',
    'anioOrdenServicio': '',
  };

  estadosOrden = _estadosOrden;

  // get getUser() { return this.user; }

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<IptOrdServComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    // @Inject(UsuarioService) private user: UsuarioService,
    @Inject(ValidationService) private validationService: ValidationService) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nroOrdenServicio: ['', [Validators.required]],
      anioOrdenServicio: ['', [Validators.required]],
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
  }


  guardar(): void {
    if (this.formularioGrp.valid) {
      let kil = new OrdenServicio();
      kil.id = 0;
      kil.nroOrdenServicio = this.formularioGrp.get('nroOrdenServicio').value;
      kil.nroExpSIAF = '000000654';
      kil.monto = 12545.00;
      kil.fecha = new Date();
      kil.fecha.setFullYear(this.formularioGrp.get('anioOrdenServicio').value)
      kil.idEstado = this.estadosOrden[0].id;
      kil.nomEstado = this.estadosOrden[0].nombre;

      this.dialogRef.close(kil);
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

}
