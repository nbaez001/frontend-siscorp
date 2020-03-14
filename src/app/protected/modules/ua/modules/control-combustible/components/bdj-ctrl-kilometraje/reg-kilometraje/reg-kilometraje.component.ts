import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataDialog } from '../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DatePipe } from '@angular/common';
import { UNIDADES, VEHICULOS, TAMBOS } from '../../../data-combustible';
import { Kilometraje } from '../../../entities/kilometraje.model';

@Component({
  selector: 'app-reg-kilometraje',
  templateUrl: './reg-kilometraje.component.html',
  styleUrls: ['./reg-kilometraje.component.scss']
})
export class RegKilometrajeComponent implements OnInit {
  unidades = [];
  tambos = [];
  vehiculos = [];

  kilometrajeGrp: FormGroup;
  messages = {
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'tambo': {
      'required': 'Campo obligatorio'
    },
    'vehiculo': {
      'required': 'Campo obligatorio'
    },
    'horaSalida': {
      'required': 'Campo obligatorio'
    },
    'horaLlegada': {
      'required': 'Campo obligatorio'
    },
    'kilometrajeSalida': {
      'required': 'Campo obligatorio'
    },
    'kilometrajeLLegada': {
      'required': 'Campo obligatorio'
    },
    'totalKilometraje': {
      'required': 'Campo obligatorio'
    },
    'fecha': {
      'required': 'Campo obligatorio'
    },
    'lugarDestino': {
      'required': 'Campo obligatorio'
    },
    'codSismonitor': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'unidad': '',
    'tambo': '',
    'vehiculo': '',
    'horaSalida': '',
    'horaLlegada': '',
    'kilometrajeSalida': '',
    'kilometrajeLLegada': '',
    'totalKilometraje': '',
    'fecha': '',
    'lugarDestino': '',
    'codSismonitor': ''
  };

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegKilometrajeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.kilometrajeGrp = this.fb.group({
      // unidad: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
      // tambo: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
      unidad: [{ value: '', disabled: false }, [Validators.required]],
      tambo: [{ value: '', disabled: true }, [Validators.required]],
      vehiculo: ['', [Validators.required]],
      horaSalida: ['', [Validators.required]],
      horaLlegada: ['', [Validators.required]],
      kilometrajeSalida: ['', [Validators.required]],
      kilometrajeLLegada: ['', [Validators.required]],
      // totalKilometraje: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
      totalKilometraje: [{ value: '', disabled: true }, [Validators.required]],
      fecha: ['', [Validators.required]],
      lugarDestino: ['', [Validators.required]],
      codSismonitor: ['', [Validators.required]],
      observacion: ['', []]
    });
    this.inicializarVariables();
  }

  validateForm(): void {
    this.validationService.getValidationErrors(this.kilometrajeGrp, this.messages, this.formErrors, true);
  }

  public inicializarVariables(): void {
    this.kilometrajeGrp.get('fecha').setValue(new Date(this.datePipe.transform(new Date(), 'MM/dd/yyyy')));
    this.cargarUnidades();
  }


  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    // if (this.user.perfil.id != 3) {
    //   this.kilometrajeGrp.get('unidad').setValue(this.unidades.filter(el => el.id == this.user.idUnidad)[0]);
    if (true) {
      this.kilometrajeGrp.get('unidad').setValue(this.unidades[0]);
    } else {
      this.kilometrajeGrp.get('unidad').setValue(this.unidades[0]);
    }
    this.cargarTambos();
  }

  public cargarTambos() {
    let idUnidad = this.kilometrajeGrp.get('unidad').value.id;

    this.tambos = JSON.parse(JSON.stringify(TAMBOS.filter(tb => tb.idUnidad == idUnidad)));
    this.tambos.unshift({ id: 0, nombre: 'OFICINA DE UNIDAD TERRITORIAL', idunidad: 0 });

    // if (this.user.perfil.id != 3) {
    //   this.kilometrajeGrp.get('tambo').setValue(this.tambos.filter(el => el.id == this.user.idTambo)[0]);
    if (true) {
      this.kilometrajeGrp.get('tambo').setValue(this.tambos[0]);
    } else {
      this.kilometrajeGrp.get('tambo').setValue(this.tambos[0]);
    }

    this.buscar();
  }

  buscar() {
    let idUnidad = this.kilometrajeGrp.get('unidad').value.id;
    let idTambo = this.kilometrajeGrp.get('tambo').value.id;

    this.vehiculos = VEHICULOS.filter(el => (el.idUnidad == idUnidad) || (0 == idUnidad));
    this.vehiculos = this.vehiculos.filter(el => (el.idTambo == idTambo));

    this.kilometrajeGrp.get('vehiculo').setValue(this.vehiculos[0]);
  }



  calcular(): void {
    this.kilometrajeGrp.get('totalKilometraje').setValue(
      this.kilometrajeGrp.get('kilometrajeLLegada').value - this.kilometrajeGrp.get('kilometrajeSalida').value
    );
  }

  guardar(): void {
    if (this.kilometrajeGrp.valid) {
      let kil = new Kilometraje();
      kil.id = 0;
      kil.unidad = this.kilometrajeGrp.get('unidad').value.nombre;
      kil.tambo = this.kilometrajeGrp.get('tambo').value.nombre;
      kil.tipo = this.kilometrajeGrp.get('vehiculo').value.nomTipo;
      kil.marca = this.kilometrajeGrp.get('vehiculo').value.marca;
      kil.placa = this.kilometrajeGrp.get('vehiculo').value.placa;
      kil.codComisionSISMONITOR = this.kilometrajeGrp.get('codSismonitor').value;
      kil.fechaComision = '07/11/2019';
      kil.horaLlegada = this.kilometrajeGrp.get('horaLlegada').value;
      kil.horaSalida = this.kilometrajeGrp.get('horaSalida').value;
      kil.kilometrajeLlegada = this.kilometrajeGrp.get('kilometrajeLLegada').value;
      kil.kilometrajeSalida = this.kilometrajeGrp.get('kilometrajeSalida').value;
      kil.kilometrosRecorrido = this.kilometrajeGrp.get('totalKilometraje').value;
      kil.lugarDestino = this.kilometrajeGrp.get('lugarDestino').value;
      kil.observaciones = this.kilometrajeGrp.get('observacion').value;

      console.log(kil);
      this.dialogRef.close(kil);
    } else {
      this.validateForm();
    }

  }

}
