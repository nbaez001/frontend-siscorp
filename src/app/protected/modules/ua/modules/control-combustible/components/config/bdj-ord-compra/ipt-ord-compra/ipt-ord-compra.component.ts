import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataDialog } from '../../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { _estadosOrden } from '../../../../data-combustible';
import { OrdenCompra } from '../../../../entities/config/orden-compra.model';

@Component({
  selector: 'app-ipt-ord-compra',
  templateUrl: './ipt-ord-compra.component.html',
  styleUrls: ['./ipt-ord-compra.component.scss']
})
export class IptOrdCompraComponent implements OnInit {
  formularioGrp: FormGroup;
  messages = {
    'nroOrdenCompra': {
      'required': 'Campo obligatorio'
    },
    'anioOrdenCompra': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'nroOrdenCompra': '',
    'anioOrdenCompra': '',
  };

  estadosOrden = _estadosOrden;

  // get getUser() { return this.user; }

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<IptOrdCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    // @Inject(UsuarioService) private user: UsuarioService,
    @Inject(ValidationService) private validationService: ValidationService) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nroOrdenCompra: ['', [Validators.required]],
      anioOrdenCompra: ['', [Validators.required]],
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
  }


  guardar(): void {
    if (this.formularioGrp.valid) {
      let kil = new OrdenCompra();
      kil.id = 0;
      kil.nroOrdenCompra = this.formularioGrp.get('nroOrdenCompra').value;
      kil.nroExpSIAF = '000000654';
      kil.monto = 12545.00;
      kil.fecha = new Date();
      kil.fecha.setFullYear(this.formularioGrp.get('anioOrdenCompra').value)
      kil.idEstado = this.estadosOrden[0].id;
      kil.nomEstado = this.estadosOrden[0].nombre;

      this.dialogRef.close(kil);
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

}
