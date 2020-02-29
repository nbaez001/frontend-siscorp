import { Component, OnInit, Inject } from '@angular/core';
import { Deslizador } from '../../../entities/deslizador.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UNIDADES, TAMBOS, deslizadores } from '../../../data-combustible';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HorasDeslizador } from '../../../entities/horas-deslizador.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DataDialog } from '../../../entities/data-dialog.model';

@Component({
  selector: 'app-reg-hrs-deslizador',
  templateUrl: './reg-hrs-deslizador.component.html',
  styleUrls: ['./reg-hrs-deslizador.component.scss']
})
export class RegHrsDeslizadorComponent implements OnInit {
  unidades = UNIDADES;
  tambos = TAMBOS;
  deslizadores: Deslizador[] = [];

  consumoDeslizadorGrp: FormGroup;
  messages = {
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'tambo': {
      'required': 'Campo obligatorio'
    },
    'deslizador': {
      'required': 'Campo obligatorio'
    },
    'fecha': {
      'required': 'Campo obligatorio'
    },
    'horaInicio': {
      'required': 'Campo obligatorio'
    },
    'horaFin': {
      'required': 'Campo obligatorio'
    },
    'totalHoras': {
      'required': 'Campo obligatorio'
    },
    'lugarDestino': {
      'required': 'Campo obligatorio'
    },
    'codSismonitor': {
      'required': 'Campo obligatorio'
    },
    'observacion': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'unidad': '',
    'tambo': '',
    'deslizador': '',
    'fecha': '',
    'horaInicio': '',
    'horaFin': '',
    'totalHoras': '',
    'lugarDestino': '',
    'codSismonitor': '',
    'observacion': ''
  };

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RegHrsDeslizadorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    // @Inject(UsuarioService) private user: UsuarioService
  ) { }

  ngOnInit() {
    this.consumoDeslizadorGrp = this.fb.group({
      unidad: [{ value: '', disabled: true }, [Validators.required]],
      tambo: [{ value: '', disabled: true }, [Validators.required]],
      deslizador: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      horaFin: ['', [Validators.required]],
      totalHoras: [{ value: '', disabled: true }, [Validators.required]],
      lugarDestino: ['', [Validators.required]],
      codSismonitor: ['', [Validators.required]],
      observacion: ['', [Validators.required]]
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.cargarUnidades();
  }

  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    // if (this.user.perfil.id != 3) {
    if (true) {
      this.consumoDeslizadorGrp.get('unidad').setValue(this.unidades.filter(el => el.id == 20)[0]);
    } else {
      this.consumoDeslizadorGrp.get('unidad').setValue(this.unidades[0]);
    }
    this.cargarTambos();
  }

  public cargarTambos() {
    let idUnidad = this.consumoDeslizadorGrp.get('unidad').value.id;

    this.tambos = JSON.parse(JSON.stringify(TAMBOS.filter(tb => tb.idUnidad == idUnidad)));
    this.tambos.unshift({ id: 0, nombre: 'OFICINA DE UNIDAD TERRITORIAL', idUnidad: 0 });

    // if (this.user.perfil.id == 1) {
    if (true) {
      this.consumoDeslizadorGrp.get('tambo').setValue(this.tambos.filter(el => el.id == 90)[0]);
    } else {
      // if (this.user.perfil.id == 2) {
      if (true) {
        this.consumoDeslizadorGrp.get('tambo').setValue(this.tambos.filter(el => el.id == 0)[0]);
      } else {
        this.consumoDeslizadorGrp.get('tambo').setValue(this.tambos[0]);
      }
    }

    this.buscar();
  }

  buscar() {
    let idUnidad = this.consumoDeslizadorGrp.get('unidad').value.id;
    let idTambo = this.consumoDeslizadorGrp.get('tambo').value.id;

    this.deslizadores = deslizadores.filter(el => (el.idUnidad == idUnidad));
    this.deslizadores = this.deslizadores.filter(el => (el.idTambo == idTambo));
  }

  calcular(): void {
    this.consumoDeslizadorGrp.get('totalHoras').setValue(this.timeCalc());
  }

  timeCalc() {
    let start = this.consumoDeslizadorGrp.get('horaInicio').value; //to update time value in each input bar
    let end = this.consumoDeslizadorGrp.get('horaFin').value; //to update time value in each input bar

    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
    return (hours + minutes / 60).toFixed(1);
  }

  guardar(): void {
    if (this.consumoDeslizadorGrp.valid) {
      let con = new HorasDeslizador();
      con.id = 0;
      con.nomUnidad = this.consumoDeslizadorGrp.get('unidad').value.nombre;
      con.nomTambo = this.consumoDeslizadorGrp.get('tambo').value.nombre;
      con.potencia = this.consumoDeslizadorGrp.get('deslizador').value.potencia;
      con.horaInicio = this.consumoDeslizadorGrp.get('horaInicio').value;
      con.horaFin = this.consumoDeslizadorGrp.get('horaFin').value;
      con.horas = this.consumoDeslizadorGrp.get('totalHoras').value;
      con.fechaComision = this.consumoDeslizadorGrp.get('fecha').value;
      con.lugarDestino = this.consumoDeslizadorGrp.get('lugarDestino').value;
      con.codComisionSISMONITOR = this.consumoDeslizadorGrp.get('codSismonitor').value;
      con.observacion = this.consumoDeslizadorGrp.get('observacion').value;

      this.dialogRef.close(con);
    } else {
      this.validationService.getValidationErrors(this.consumoDeslizadorGrp, this.messages, this.formErrors, true);
    }
  }


}
