import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Modulo } from '../../../entities/modulo';
import { ModuloService } from '../../../services/modulo.service';
import { Observable } from 'rxjs';
import { ErrorTransaccion } from '../../../entities/error-transaccion';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Unidad } from '../../../entities/unidad';

@Component({
  selector: 'security-modulo-form',
  templateUrl: './modulo-form.component.html',
  styleUrls: ['./modulo-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModuloFormComponent implements OnInit {

  formModulo: FormGroup;

  unidades: Unidad[] = [];

  constructor(
    private moduloService: ModuloService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModuloFormComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private modulo: Modulo
  ) { }

  ngOnInit() {
    this.formModulo = this.fb.group({
      nombreModulo: [this.modulo.nombreModulo || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      codigoUnidad: [this.modulo.codigoUnidad || '', Validators.required]
    });

    this.moduloService.listaUnidades().subscribe((unidades) => this.unidades = unidades);
  }

  get nuevoModulo(): boolean {
    return this.modulo === null;
  }

  get titulo(): string {
    return this.nuevoModulo ? 'Crear Módulo' : 'Actualizar Módulo';
  }

  guardar() {

    if (this.formModulo.valid) {

      this.transaccion.subscribe(
        () => {
          this.dialogRef.close(true);
          this.snackBar.open('Transacción realizada exitosamente');
        },
        (error: HttpErrorResponse) => {
          this.formModulo.get('nombreModulo').setErrors({err: error.error.mensaje});
        }
      );

    } else {
      this.formModulo.get('nombreModulo').markAsTouched();
      this.formModulo.get('codigoUnidad').markAsTouched();
    }

  }

  eliminar() {
    const eliminar: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    eliminar.componentInstance.message = '¿Seguro que desea eliminar el módulo?';

    eliminar.afterClosed().subscribe((elimino) => {
      if (!!elimino) {
        this.moduloService
          .eliminar(this.modulo.codigoModulo)
          .subscribe(() => this.dialogRef.close(true));
      }
    });
  }

  private get transaccion() {

    let transaccion: Observable<ErrorTransaccion>;

    const datos = Object.assign(
      this.modulo,
      this.formModulo.value
    );

    if (this.nuevoModulo) {

      transaccion = this.moduloService.crear(datos);

    } else {

      transaccion = this.moduloService.editar(datos);

    }

    return transaccion;

  }

}
