import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { GestionTambosService } from '../../../services/gestion-tambos.service';
import { Plataforma } from '../../../entities/plataforma';
import * as moment from 'moment';
import { Recurso } from '../../../entities/recurso';

@Component({
  selector: 'ups-plataforma-formulario-condicion',
  templateUrl: './plataforma-formulario-condicion.component.html',
  styleUrls: ['./plataforma-formulario-condicion.component.scss']
})
export class PlataformaFormularioCondicionComponent implements OnInit {

  formCondicion: FormGroup;

  subEstados: Recurso[] = [];
  ssubEstados: Recurso[] = [];

  constructor(
    public dialogRef: MatDialogRef<PlataformaFormularioCondicionComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private gestTambServicio: GestionTambosService,
    @Inject(MAT_DIALOG_DATA) public plataforma: Plataforma
  ) { }

  async ngOnInit() {
    this.crearForm();

    this.subEstados = await this.gestTambServicio.subEstados(this.plataforma.idEstado);
    this.ssubEstados = await this.gestTambServicio.ssubEstados(this.plataforma.idSubEstado);
  }

  crearForm() {
    this.formCondicion = this.fb.group({
      subEstado: ['', Validators.required],
      ssubEstado: ['', Validators.required],
      fecEjecucion: [new Date(), Validators.required]
    });
  }

  async cargarSSubEstados(idSubEstados: number) {
    this.ssubEstados = await this.gestTambServicio.ssubEstados(idSubEstados);
    this.formCondicion.get('ssubEstado').setValue('');
  }

  actualizar() {
    if (this.formCondicion.valid) {

      const idSsubEstado = +this.formCondicion.get('ssubEstado').value;
      const fecEjecucion = moment(this.formCondicion.get('fecEjecucion').value).format('YYYY-MM-DD');

      if (
        idSsubEstado === this.plataforma.idSSubEstado &&
        this.plataforma.fecEjecucion.slice(0, 10) === fecEjecucion
      ) {
        this.snackBar.open('No se encontraron cambios.', '', {panelClass: 'mat-red-bg'});
      } else {
        this.gestTambServicio
        .actualizarCondicion(this.plataforma.idPlataforma, idSsubEstado, fecEjecucion)
        .subscribe(() => {
          this.dialogRef.close(true);
          this.snackBar.open('Condición actualizada.', '', {panelClass: 'mat-primary-bg'});
        });
      }

    } else {
      Object.values(this.formCondicion.controls).forEach(c => c.markAsTouched());
    }
  }

}
