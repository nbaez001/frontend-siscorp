import { Component, OnInit, Inject } from '@angular/core';
import { UajService } from '../../services/uaj.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'uaj-crear-plan-trabajo',
  templateUrl: './crear-plan-trabajo.component.html',
  styleUrls: ['./crear-plan-trabajo.component.scss']
})
export class CrearPlanTrabajoComponent implements OnInit {

  planForm: FormGroup;

  empleados: any = [];
  id_empleado: number;

  constructor(
    private conveniosService: UajService,
    public dialogRef: MatDialogRef<CrearPlanTrabajoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
  ) {
    this.planForm = this.creaForm();
  }

  ngOnInit() {
    this.planForm.get('responsable').valueChanges.subscribe(value => {
      if (value) {
        this.conveniosService.listarCoordinadorPais(value).subscribe(tambos => this.empleados = tambos);
      } else {
        this.empleados = [];
      }
    });
  }

  selectEmpledo(id) {
    this.id_empleado = +id;
  }

  creaForm() {
    return this.formBuilder.group({
      objetivo: ['', Validators.required],
      responsable: ['', Validators.required]
    });
  }

  crearPlan() {
    if (this.planForm.valid) {
      this.spinner.show();
      const data = Object.assign(
        this.planForm.getRawValue(),
        {
          idConvenio: this.data,
          idGestionador: this.id_empleado
        }
      );

      this.conveniosService.guardarPlanTrabajo(data).subscribe(response => {
        if (response.codigo == '00') {
          this.spinner.hide();
          this.matSnackBar.open(
            'Se registro plan de trabajo.',
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
