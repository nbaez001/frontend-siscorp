import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ModuloAtencion } from '../../../entities/modulo-atencion';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GestionModulosService } from '../../../services/gestion-modulos.service';
import { Encargado } from '../../../entities/encargado';
import { Entidad } from '../../../entities/entidad';

@Component({
  selector: 'tickinterv-modulo-registrar',
  templateUrl: './modulo-registrar.component.html',
  styleUrls: ['./modulo-registrar.component.scss']
})
export class ModuloRegistrarComponent implements OnInit {

  encargados: Encargado[] = [];
  entidades: Entidad[] = [];

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModuloRegistrarComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public modulo: ModuloAtencion,
    private formBuilder: FormBuilder,
    private gestModService: GestionModulosService
  ) { }

  ngOnInit() {
    this.crearForm();
    this.cargarDatos();
  }

  registrarEntidad() {
    // const 
  }

  cargarDatos() {
    this.gestModService.datos().subscribe(({encargados, entidades}) => {
      this.encargados = encargados;
      this.entidades = entidades;
    });
  }

  crearForm() {
    this.form = this.formBuilder.group({
      idModulo: this.modulo.idModulo,
      idEntidad: [this.modulo.idEntidad, Validators.required],
      nombreEntidad: [''],
      logoEntidad: [''],
      idUsuario: [this.modulo.idEncargado, [Validators.required]],
      moduloActivo: [this.modulo.activo || 0, [Validators.required]]
    });
  }

  registrar() {
    if (this.form.valid) {

      const datos = this.form.value;
      datos.moduloActivo = datos.moduloActivo ? 1 : 0;

      const servicio = !!this.modulo.idModulo
        ? this.gestModService.actualizar(datos)
        : this.gestModService.registrar(datos);

      servicio.subscribe((result) => {
        if (result === 1) {
          this.form.get('idEntidad').setErrors({resp: 'ENTIDAD YA TIENE MODULO'});
          this.form.get('idEntidad').markAsTouched();
        } else if (result === 2) {
          this.form.get('idUsuario').setErrors({resp: 'USUARIO YA TIENE MODULO'});
          this.form.get('idUsuario').markAsTouched();
        } else {
          const accion = this.modulo.idModulo ? 'ACTUALIZADO' : 'REGISTRADO';
          this.snackBar.open(`MODULO ${accion} EXITOSAMENTE.`);
          this.dialogRef.close(true);
        }
      });
    } else {
      Object.values(this.form.controls).forEach(c => c.markAsTouched());
    }
  }

}
