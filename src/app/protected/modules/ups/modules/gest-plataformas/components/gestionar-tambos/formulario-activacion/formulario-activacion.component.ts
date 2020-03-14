import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GestionTambosService } from '../../../services/gestion-tambos.service';

@Component({
  selector: 'ups-formulario-activacion',
  templateUrl: './formulario-activacion.component.html',
  styleUrls: ['./formulario-activacion.component.scss']
})
export class FormularioActivacionComponent implements OnInit {

  observacion: FormControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(1255)]);

  constructor(
    public dialogRef: MatDialogRef<FormularioActivacionComponent>,
    private pltServicio: GestionTambosService,
    @Inject(MAT_DIALOG_DATA) private idHistorial: number
  ) { }

  ngOnInit() {
  }

  observar() {
    this.pltServicio
      .plataformaActividad({id: this.idHistorial, observacion: this.observacion.value})
      .subscribe(() => this.dialogRef.close(true));
  }

}
