import { Component, OnInit, Inject } from '@angular/core';
import { Generador } from '../../../entities/generador.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConsumoGenerador } from '../../../entities/consumo-generador.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { UNIDADES, TAMBOS, generadores } from '../../../data-combustible';
import { DataDialog } from '../../../entities/data-dialog.model';

@Component({
  selector: 'app-reg-hrs-grp-electrogeno',
  templateUrl: './reg-hrs-grp-electrogeno.component.html',
  styleUrls: ['./reg-hrs-grp-electrogeno.component.scss']
})
export class RegHrsGrpElectrogenoComponent implements OnInit {
  unidades = [];
  tambos = [];
  generadores: Generador[] = [];

  consumoGeneradorGrp: FormGroup;
  messages = {
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'tambo': {
      'required': 'Campo obligatorio'
    },
    'generador': {
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
    'observacion': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'unidad': '',
    'tambo': '',
    'generador': '',
    'fecha': '',
    'horaInicio': '',
    'horaFin': '',
    'totalHoras': '',
    'observacion': ''
  };

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RegHrsGrpElectrogenoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    // @Inject(UsuarioService) private user: UsuarioService
  ) { }

  ngOnInit() {
    this.consumoGeneradorGrp = this.fb.group({
      unidad: [{ value: '', disabled: true }, [Validators.required]],
      tambo: [{ value: '', disabled: true }, [Validators.required]],
      generador: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      horaFin: ['', [Validators.required]],
      totalHoras: [{ value: '', disabled: true }, [Validators.required]],
      observacion: ['', [Validators.required]]
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.cargarUnidades();
  }

  calcular(): void {
    this.consumoGeneradorGrp.get('totalHoras').setValue(this.timeCalc());
  }

  timeCalc() {
    let start = this.consumoGeneradorGrp.get('horaInicio').value; //to update time value in each input bar
    let end = this.consumoGeneradorGrp.get('horaFin').value; //to update time value in each input bar

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

  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    // if (this.user.perfil.id != 3) {
    //   this.consumoGeneradorGrp.get('unidad').setValue(this.unidades.filter(el => el.id == this.user.idUnidad)[0]);
    if (true) {
      this.consumoGeneradorGrp.get('unidad').setValue(this.unidades[0]);
    } else {
      this.consumoGeneradorGrp.get('unidad').setValue(this.unidades[0]);
    }
    this.cargarTambos();
  }

  public cargarTambos() {
    let idUnidad = this.consumoGeneradorGrp.get('unidad').value.id;

    this.tambos = JSON.parse(JSON.stringify(TAMBOS.filter(tb => tb.idUnidad == idUnidad)));
    this.tambos.unshift({ id: 0, nombre: 'OFICINA DE UNIDAD TERRITORIAL', idunidad: 0 });

    // if (this.user.perfil.id != 3) {
    //   this.consumoGeneradorGrp.get('tambo').setValue(this.tambos.filter(el => el.id == this.user.idTambo)[0]);
    if (true) {
      this.consumoGeneradorGrp.get('tambo').setValue(this.tambos[0]);
    } else {
      this.consumoGeneradorGrp.get('tambo').setValue(this.tambos[0]);
    }

    this.buscar();
  }

  buscar() {
    let idUnidad = this.consumoGeneradorGrp.get('unidad').value.id;
    let idTambo = this.consumoGeneradorGrp.get('tambo').value.id;

    this.generadores = generadores.filter(el => (el.idUnidad == idUnidad) || (0 == idUnidad));
    this.generadores = this.generadores.filter(el => (el.idTambo == idTambo));

    this.consumoGeneradorGrp.get('generador').setValue(this.generadores[0]);
  }

  guardar(): void {
    if (this.consumoGeneradorGrp.valid) {
      let con = new ConsumoGenerador();
      con.id = 0;
      con.nomUnidad = this.consumoGeneradorGrp.get('unidad').value.nombre;
      con.nomTambo = this.consumoGeneradorGrp.get('tambo').value.nombre;
      con.marca = this.consumoGeneradorGrp.get('generador').value.marca;
      con.serie = this.consumoGeneradorGrp.get('generador').value.serie;
      con.horaInicio = this.consumoGeneradorGrp.get('horaInicio').value;
      con.horaFin = this.consumoGeneradorGrp.get('horaFin').value;
      con.horas = this.consumoGeneradorGrp.get('totalHoras').value;
      con.fecha = this.consumoGeneradorGrp.get('fecha').value;
      con.observacion = this.consumoGeneradorGrp.get('observacion').value;

      this.dialogRef.close(con);
    } else {
      this.validationService.getValidationErrors(this.consumoGeneradorGrp, this.messages, this.formErrors, true);
    }

  }
}
