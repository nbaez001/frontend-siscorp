import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CuadroControlTambo } from '../../entities/cuadro-control-tambo.model';
import { MatDialog } from '@angular/material';
import { UNIDADES, TAMBOS, CUADROCONTROLTAMBO } from '../../data-combustible';

@Component({
  selector: 'app-cuadro-ctrl-detallado',
  templateUrl: './cuadro-ctrl-detallado.component.html',
  styleUrls: ['./cuadro-ctrl-detallado.component.scss']
})
export class CuadroCtrlDetalladoComponent implements OnInit {
  bandejaGrp: FormGroup;
  unidades = [];
  tambos = [];
  anios: Object[] = [{ valor: 2019 }, { valor: 2018 }, { valor: 2017 }];
  meses: Object[] = [{ valor: 0, nombre: 'ENERO' }, { valor: 1, nombre: 'FEBRERO' }, { valor: 2, nombre: 'MARZO' }, { valor: 3, nombre: 'ABRIL' }, { valor: 4, nombre: 'MAYO' }, { valor: 5, nombre: 'JUNIO' }, { valor: 6, nombre: 'JULIO' }, { valor: 7, nombre: 'AGOSTO' }, { valor: 8, nombre: 'SETIEMBRE' }, { valor: 9, nombre: 'OCTUBRE' }, { valor: 10, nombre: 'NOVIEMBRE' }, { valor: 11, nombre: 'DICIEMBRE' }];

  listaControl: CuadroControlTambo[] = [];

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    // @Inject(UsuarioService) private user: UsuarioService
  ) { }

  ngOnInit() {
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     this.bandejaGrp = this.fb.group({
    //       unidad: ['', [Validators.required]],
    //       tambo: ['', [Validators.required]],
    //       anio: ['', [Validators.required]]
    //     });

    //     // this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);
    this.bandejaGrp = this.fb.group({
      unidad: ['', [Validators.required]],
      tambo: ['', [Validators.required]],
      anio: ['', [Validators.required]]
    });

    // this.definirTabla();
    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.cargarUnidades();
  }

  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    this.bandejaGrp.get('unidad').setValue(this.unidades[0]);

    this.cargarTambos();
  }

  public cargarTambos() {
    this.tambos = JSON.parse(JSON.stringify(TAMBOS));
    this.tambos.unshift({ id: 0, nombre: 'TODOS' });

    this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
    this.bandejaGrp.get('anio').setValue(this.anios[0]);

    this.buscar();
  }

  buscar() {
    let idUnidad = this.bandejaGrp.get('unidad').value.id;
    let anio = this.bandejaGrp.get('anio').value.id;

    this.listaControl = CUADROCONTROLTAMBO.filter(el => (el.idUnidad == idUnidad) || (0 == idUnidad));
    // this.spinnerService.hide();
  }

  exportarExcel() {
    let url = "http://ccombustible.elnazarenovraem.edu.pe/assets/files/reportes/cuadro-control-detallado.xlsx";
    window.location.href = url;
  }


}
