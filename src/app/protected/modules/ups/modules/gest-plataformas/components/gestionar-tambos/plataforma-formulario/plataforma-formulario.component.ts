import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { GestionTambosService } from '../../../services/gestion-tambos.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatTabGroup } from '@angular/material';
import { DatosFormPlataforma, Plataforma } from '../../../entities/plataforma';
import { Recurso } from '../../../entities/recurso';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'ups-plataforma-formulario',
  templateUrl: './plataforma-formulario.component.html',
  styleUrls: ['./plataforma-formulario.component.scss']
})
export class PlataformaFormularioComponent implements OnInit, OnDestroy {

  formulario: FormGroup;

  registro: boolean;

  @ViewChild('tabPasos') tabPasos: MatTabGroup;

  tabPasosIndex = 0;

  situaciones: Recurso[] = [];
  estados: Recurso[] = [];
  subEstados: Recurso[] = [];
  ssubEstados: Recurso[] = [];
  ccpps: Recurso[] = [];

  filtro: Subscription;

  constructor(
    public dialogRef: MatDialogRef<PlataformaFormularioComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private gestTambServicio: GestionTambosService,
    @Inject(MAT_DIALOG_DATA) public plataforma: Plataforma
  ) { }

  async ngOnInit() {
    this.crearForm();
    this.registro = !this.plataforma;
    await this.precargarDatos();
    this.situaciones = await this.gestTambServicio.situaciones();

    this.filtro = this.formDetalle.get('centroPoblado').valueChanges.subscribe((v: string) => {
      this.gestTambServicio.centrosPoblados(v).subscribe(ccpps => this.ccpps = ccpps);
    });
  }

  ngOnDestroy() {
    this.filtro.unsubscribe();
  }

  async cargarEstados(idSituacion: number) {
    this.estados = await this.gestTambServicio.estados(idSituacion);
    this.formCondicion.get('estado').setValue('');
    this.formCondicion.get('subEstado').setValue('');
    this.formCondicion.get('ssubEstado').setValue('');
  }

  async cargarSubEstados(idEstado: number) {
    this.subEstados = await this.gestTambServicio.subEstados(idEstado);
    this.formCondicion.get('subEstado').setValue('');
    this.formCondicion.get('ssubEstado').setValue('');
  }

  async cargarSSubEstados(idSsubEstados: number) {
    this.ssubEstados = await this.gestTambServicio.ssubEstados(idSsubEstados);
    this.formCondicion.get('ssubEstado').setValue('');
  }

  async precargarDatos() {
    if (!this.registro) {
      this.formDetalle.setValue({
        nombre: this.plataforma.plataforma,
        snip: this.plataforma.numSNIP,
        codUnico: this.plataforma.codUnico,
        centroPoblado: this.plataforma.centroPoblado,
        idCentroPoblado: this.plataforma.idCentroPoblado,
        unidadTerritorial: this.plataforma.unidadTerritorial,
        latitud: this.plataforma.latitud,
        longitud: this.plataforma.longitud,
        altitud: this.plataforma.altitud
      });

      await this.cargarEstados(this.plataforma.idSituacion);
      await this.cargarSubEstados(this.plataforma.idEstado);
      await this.cargarSSubEstados(this.plataforma.idSubEstado);

      this.formCondicion.setValue({
        situacion: this.plataforma.idSituacion,
        estado: this.plataforma.idEstado,
        subEstado: this.plataforma.idSubEstado,
        ssubEstado: this.plataforma.idSSubEstado,
        fecEjecucion: moment(this.plataforma.fecEjecucion).toDate()
      });
    }
  }

  crearForm() {
    this.formulario = this.fb.group({
      detalle: this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        snip: ['', [Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]+$'), this.vldSnpoCod.bind(this)]],
        codUnico: ['', [Validators.minLength(7), Validators.maxLength(7), Validators.pattern('^[0-9]+$'), this.vldSnpoCod.bind(this)]],
        centroPoblado: ['', Validators.required],
        idCentroPoblado: ['', Validators.required],
        unidadTerritorial: '',
        latitud: ['', [Validators.minLength(3), Validators.maxLength(20)]],
        longitud: ['', [Validators.minLength(3), Validators.maxLength(20)]],
        altitud: ['', [Validators.minLength(3), Validators.maxLength(20)]]
      }),
      condicion: this.fb.group({
        situacion: ['', Validators.required],
        estado: ['', Validators.required],
        subEstado: ['', Validators.required],
        ssubEstado: ['', Validators.required],
        fecEjecucion: [new Date(), Validators.required]
      })
    });
  }

  vldSnpoCod(control: AbstractControl) {

    let resultado = null;

    if (!control.parent) {
      return resultado;
    }

    const snip = control.parent.get('snip').value;
    const codUnico = control.parent.get('codUnico').value;

    if (!snip && !codUnico) {
      resultado = {err: 'SNIP o COD. ÚNICO es requerido.'};
    }

    return resultado;
  }

  get formDetalle(): FormGroup {
    return this.formulario.get('detalle') as FormGroup;
  }

  get formCondicion(): FormGroup {
    return this.formulario.get('condicion') as FormGroup;
  }

  siguiente() {

    if (this.formDetalle.get('centroPoblado').valid && this.formDetalle.get('idCentroPoblado').invalid) {
      this.formDetalle.get('centroPoblado').setErrors({err: 'Debe seleccionar un centro poblado existente.'});
    }

    this.formDetalle.get('snip').updateValueAndValidity();
    this.formDetalle.get('codUnico').updateValueAndValidity();

    if (this.formDetalle.invalid) {
      Object.values(this.formDetalle.controls).forEach(c => c.markAsTouched());
    } else {
      this.tabPasos.selectedIndex = 1;
    }
  }

  finalizar() {

    if (this.formCondicion.valid) {

      const datos: DatosFormPlataforma = this.formDetalle.value;
      datos.idPlataforma = this.registro ? null : this.plataforma.idPlataforma;
      datos.ssubEstado = this.formCondicion.get('ssubEstado').value;
      datos.fecEjecucion = moment(this.formCondicion.get('fecEjecucion').value).format('YYYY-MM-DD');

      const servicio = this.registro
        ? this.gestTambServicio.registrar(datos)
        : this.gestTambServicio.actualizar(datos);

      servicio.subscribe((r) => {

        if (r.codigo === 0) {
          this.dialogRef.close(true);
          const mensaje = this.registro
            ? 'EL REGISTRO SE REALIZO EXITOSAMENTE'
            : 'LA ACTUALIZACIÓN SE REALIZO EXITOSAMENTE';
          this.snackBar.open(mensaje);
        } else if (r.codigo === 50003)  { // ERROR DE SNIP UNICO
          this.formDetalle.get('snip').setErrors({err: r.mensaje});
          this.tabPasos.selectedIndex = 0;
        } else {
          this.snackBar.open('Error desconocido al realizar la acción, comuniquese con UTI.', '', {panelClass: 'mat-red-bg'});
        }

      });
    } else {
      Object.values(this.formCondicion.controls).forEach(c => c.markAsTouched());
    }
  }

  quitarCcpp() {
    this.formDetalle.get('centroPoblado').setValue('');
    this.formDetalle.get('idCentroPoblado').setValue('');
    this.formDetalle.get('unidadTerritorial').setValue('');
  }

  ccppSeleccionado(ccpp: Recurso) {
    this.formDetalle.get('idCentroPoblado').setValue(ccpp.id);
    this.formDetalle.get('unidadTerritorial').setValue(ccpp.unidadTerritorial);
  }

  buscarCCPP() {
    const { latitud, longitud, altitud } = this.formDetalle.value;

    if (!!latitud && !!longitud && !!altitud) {
      this.gestTambServicio.filtrarCCPP(longitud, latitud, altitud).subscribe((ccpp) => {
        if (!!ccpp) {
          this.formDetalle.get('centroPoblado').setValue(ccpp.nombre);
          this.formDetalle.get('idCentroPoblado').setValue(ccpp.id);
          this.formDetalle.get('unidadTerritorial').setValue(ccpp.unidadTerritorial);
        } else {
          this.snackBar.open('Centro poblado no encontrado.', '', {panelClass: 'mat-red-bg'});
        }
      });
    } else {
      this.snackBar.open('Latitud, longitud y altitud son requeridos.', '', {panelClass: 'mat-red-bg'});
    }
  }

}
