import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IntervencionService } from '../../services/intervencion.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModuloAtencion } from '../../entities/modulo-atencion';
import { TipoDocumento } from '../../entities/tipo-documento';
import { Genero } from '../../entities/genero';
import { Persona } from '../../entities/persona';

@Component({
  selector: 'tickinterv-registro-atencion',
  templateUrl: './registro-atencion.component.html',
  styleUrls: ['./registro-atencion.component.scss']
})
export class RegistroAtencionComponent implements OnInit {

  atencionForm: FormGroup;

  documentoTipos: TipoDocumento[];
  generos: Genero[];

  persona: Persona;
  consultaReniecOk = false;

  fechaActual = new Date();

  archivos: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RegistroAtencionComponent>,
    private formBuilder: FormBuilder,
    private intrvService: IntervencionService,
    @Inject(MAT_DIALOG_DATA)
    public datos: DatosRegistroAtencion
  ) {
  }

  ngOnInit() {
    this.crearFormulario();
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    this.intrvService.datosForm(this.datos.idPersona || 0).subscribe(datos => {
      this.generos = datos.generos;
      this.documentoTipos = datos.documentoTipos;

      if (!!this.datos.idPersona) {
        this.persona = datos.persona;
        this.agregarPersonaAlForm();
      }

    });
  }

  agregarPersonaAlForm(): void {
    this.atencionForm.get('nombre').setValue(this.persona.cidNombre || '');
    this.atencionForm.get('apellidoPaterno').setValue(this.persona.cidApellidoPaterno || '');
    this.atencionForm.get('apellidoMaterno').setValue(this.persona.cidApellidoMaterno || '');
    this.atencionForm.get('fidTipoDocumento').setValue(this.persona.fidTipoDocumento || 1);
    this.atencionForm.get('nroDocumento').setValue(this.persona.numDocumento || '');
    this.atencionForm.get('fechaNacimiento').setValue(this.persona.fecNacimiento || '');
    this.atencionForm.get('fidGenero').setValue(this.persona.fidGenero || '');
    this.atencionForm.controls.fidTipoDocumento.disable();
    this.atencionForm.controls.fidGenero.disable();
  }

  crearFormulario(): void {
    this.atencionForm = this.formBuilder.group({
      fidModuloAtencion:  ['', [Validators.required]],

      // DATOS PERSONA
      nombre: ['', [Validators.required]],
      apellidoPaterno: ['', [Validators.required]],
      apellidoMaterno: ['', [Validators.required]],
      fidTipoDocumento: [1, [Validators.required]],
      nroDocumento: ['', [Validators.required]],
      fechaNacimiento: [''],
      fidGenero: ['', [Validators.required]]
    });
  }

  registrar(): void {
    if (this.atencionForm.valid) {

      const datos = this.atencionForm.getRawValue();
      datos.fidModuloOrigen = this.datos.moduloPertenece.idModulo;
      datos.idAtencionPadre = this.datos.idAtencionPadre;
      datos.archivos = this.archivos.length === 0 ? '' : '{archivos: ' + JSON.stringify(this.archivos) + '}';

      this.intrvService.registrarAtencion(datos).subscribe((registrado) => {

        if (registrado) {
          this.dialogRef.close(true);
        }

        this.snackBar.open(registrado ? 'ATENCIÓN REGISTRADA SATISFACTORIAMENTE.' : 'EL USUARIO ESTA ACTUALMENTE EN COLA DE OTRO MÓDULO');

      });

    } else {
      Object.values(this.atencionForm.controls).forEach(c => c.markAsTouched());
    }
  }

  buscarReniec(): void {
    const nroDocumento = this.atencionForm.get('nroDocumento').value;
    const regexp = /^[0-9]+$/;

    if (nroDocumento.length === 8 && regexp.test(nroDocumento)) {
      this.intrvService.consultarPersona(nroDocumento).subscribe(persona => {
        this.consultaReniecOk = !!persona;

        if (this.consultaReniecOk) {
          this.persona = persona;
          this.agregarPersonaAlForm();
        }

        this.snackBar.open(this.consultaReniecOk ? 'Persona encontrada.' : 'Persona no encontrada.');
      });
    } else {
      this.snackBar.open('Nro de documento debe ser de 8 números.');
    }
  }

  revertirBusqueda() {
    this.consultaReniecOk = false;
    this.persona = {} as Persona;
    this.agregarPersonaAlForm();
  }

  subirArchivos(archivos: FileList): void {
    for (let i = 0; i < archivos.length; i++) {

      const formData: FormData = new FormData();
      formData.append('archivo', archivos.item(i));

      this.intrvService.subirArchivo(formData).subscribe(resp => {
        this.archivos.push({ruta: resp.nombreArchivo});
      });
    }
  }

  escribiendoDni() {
    const nroDocumento = this.atencionForm.get('nroDocumento').value;
    const regexp = /^[0-9]+$/;

    if (this.atencionForm.get('fidTipoDocumento').value === 1 && nroDocumento.length === 8 && regexp.test(nroDocumento)) {
      this.buscarReniec();
    }
  }

}

interface DatosRegistroAtencion {
  idPersona?: number;
  idAtencionPadre?: number;
  moduloPertenece: ModuloAtencion;
  modulos: ModuloAtencion[];
}
