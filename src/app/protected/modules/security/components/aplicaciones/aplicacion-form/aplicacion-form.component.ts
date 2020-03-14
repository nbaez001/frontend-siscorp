import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AplicacionService } from '../../../services/aplicacion.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Aplicacion } from '../../../entities/aplicacion';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { Observable } from 'rxjs';
import { ErrorTransaccion } from '../../../entities/error-transaccion';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'security-aplicacion-form',
  templateUrl: './aplicacion-form.component.html',
  styleUrls: ['./aplicacion-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AplicacionFormComponent implements OnInit {

  nombreAplicacion: FormControl = new FormControl(
    '',
    [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
  );

  constructor(
    private aplicacionService: AplicacionService,
    public dialogRef: MatDialogRef<AplicacionFormComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private aplicacion: Aplicacion
  ) { }

  ngOnInit() {

    if (!this.nuevaAplicacion) {
      this.nombreAplicacion.setValue(this.aplicacion.nombreAplicacion);
    }

  }

  get nuevaAplicacion(): boolean {
    return this.aplicacion === null;
  }

  get titulo(): string {
    return this.nuevaAplicacion ? 'Crear Aplicación' : 'Actualizar Aplicación';
  }

  guardar() {

    if (this.nombreAplicacion.valid) {

      this.transaccion.subscribe(
        () => {
          this.dialogRef.close(true);
          this.snackBar.open('Transacción realizada exitosamente');
        },
        (error: HttpErrorResponse) => {
          this.nombreAplicacion.setErrors({err: error.error.mensaje});
        }
      );

    } else {
      this.nombreAplicacion.markAsTouched();
    }

  }

  eliminar() {

    const eliminar: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    eliminar.componentInstance.message = '¿Seguro que desea eliminar la aplicación?';

    eliminar.afterClosed().subscribe((elimino) => {
      if (!!elimino) {
        this.aplicacionService
          .eliminar(this.aplicacion.codigoAplicacion)
          .subscribe(() => this.dialogRef.close(true));
      }
    });
  }

  private get transaccion() {

    let transaccion: Observable<ErrorTransaccion>;

    if (this.nuevaAplicacion) {

      transaccion = this.aplicacionService.crear({
        nombreAplicacion: this.nombreAplicacion.value
      });

    } else {

      transaccion = this.aplicacionService.editar({
        codigoAplicacion: this.aplicacion.codigoAplicacion,
        nombreAplicacion: this.nombreAplicacion.value
      });

    }

    return transaccion;

  }

}
