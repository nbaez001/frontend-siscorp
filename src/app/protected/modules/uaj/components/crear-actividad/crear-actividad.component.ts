import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UajService } from '../../services/uaj.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'uaj-crear-actividad',
  templateUrl: './crear-actividad.component.html',
  styleUrls: ['./crear-actividad.component.scss']
})
export class CrearActividadComponent implements OnInit {

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
    public dialogRef: MatDialogRef<CrearActividadComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
  ) {
    this.planForm = this.creaForm();

    for (let i = this.fecha.getFullYear(); i <= (this.fecha.getFullYear() + 10); i++) {
      this.anios.push(i);
    }

    this.planForm.get("anio").setValue(+data.anio);

    if (+data.anio != 0) {
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

  crearPlan() {
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
        { idPlan: this.data.idPlanTrabajo }
      );

      this.conveniosService.guardarActividad(data).subscribe(response => {
        if (response.codigo == '00') {
          this.spinner.hide();
          this.matSnackBar.open(
            'Se registro actividad.',
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

}

