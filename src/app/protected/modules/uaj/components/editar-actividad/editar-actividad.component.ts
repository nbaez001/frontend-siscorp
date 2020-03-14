import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UajService } from '../../services/uaj.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';

@Component({
  selector: 'uaj-editar-actividad',
  templateUrl: './editar-actividad.component.html',
  styleUrls: ['./editar-actividad.component.scss']
})
export class EditarActividadComponent implements OnInit {

  planForm: FormGroup;

  meses: any = [
    { id: 1, mes: 'Enero' },
    { id: 2, mes: 'Febrero' },
    { id: 3, mes: 'Marzo' },
    { id: 4, mes: 'Abril' },
    { id: 5, mes: 'Mayo' },
    { id: 6, mes: 'Junio' },
    { id: 7, mes: 'Julio' },
    { id: 8, mes: 'Agosto' },
    { id: 9, mes: 'Setiembre' },
    { id: 10, mes: 'Octubre' },
    { id: 11, mes: 'Noviembre' },
    { id: 12, mes: 'Diciembre' }];

  anios: any = [];
  fecha: Date = new Date();

  constructor(
    private conveniosService: UajService,
    public dialogRef: MatDialogRef<EditarActividadComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private matDialog: MatDialog,
  ) {
    this.planForm = this.creaForm();

    for (let i = this.fecha.getFullYear(); i <= (this.fecha.getFullYear() + 10); i++) {
      this.anios.push(i);
    }

    this.datoActividad();

    if (+data.cantActividad != 1) {
      this.planForm.get("anio").disable();
    }
  }

  ngOnInit() { }

  creaForm() {
    return this.formBuilder.group({
      objetivo: ['', Validators.required],
      actividad: ['', Validators.required],
      indicador: ['', Validators.required],
      programado: ['', Validators.pattern('[0-9]*')],
      ejecutado: ['', Validators.pattern('[0-9]*')],
      anio: ['', Validators.required],
      mesInicio: ['', Validators.required],
      mesFin: ['', Validators.required],
    });
  }

  datoActividad() {
    this.conveniosService.datoActividad(this.data.idActividad).subscribe((response) => {
      this.planForm.get("objetivo").setValue(response.objetivo);
      this.planForm.get("actividad").setValue(response.actividad);
      this.planForm.get("indicador").setValue(response.indicador);
      this.planForm.get("programado").setValue(response.programado);
      this.planForm.get("ejecutado").setValue(response.ejecutado);
      this.planForm.get("anio").setValue(+response.anio);
      this.planForm.get("mesInicio").setValue(+response.mesInicio);
      this.planForm.get("mesFin").setValue(+response.mesFin);
    });
  }

  actualizarPlan() {
    if (this.planForm.valid) {

      if (this.planForm.get("mesFin").value < this.planForm.get("mesInicio").value) {
        this.matSnackBar.open(
          'Mes fin no puede ser menor.',
          'Cerrar',
          { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end', panelClass: ['red-snackbar'] }
        )

        return false;
      }

      this.spinner.show();
      const data = Object.assign(
        this.planForm.getRawValue(),
        { idActividad: this.data.idActividad }
      );

      this.conveniosService.actualizarActividad(data).subscribe(response => {
        if (response.codigo == '00') {
          this.spinner.hide();
          this.matSnackBar.open(
            'Se actualizo actividad.',
            'Cerrar',
            { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' }
          )
          this.dialogRef.close(true);
        } else {
          console.log(response.mensaje);
        }
      });
    } else {
      Object.keys(this.planForm.controls).forEach(control => {
        this.planForm.controls[control].markAsTouched();
      });
    }
  }

  eliminarActividad() {
    const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.matDialog.open(ConfirmMessageComponent);
    dialogMessage.componentInstance.message = '¿Está seguro de eliminar la actividad?';
    dialogMessage.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.conveniosService.eliminarActividad(this.data.idActividad).subscribe(response => {
          if (response.codigo == '00') {
            this.matSnackBar.open(
              'Se Eliminó Actividad.',
              'Cerrar',
              { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' }
            )
            this.dialogRef.close(true);
          } else {
            console.log(response.mensaje);
          }
        });
      }
    });
  }
}
