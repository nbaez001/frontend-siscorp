import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { CrearAdendaComponent } from '../crear-adenda/crear-adenda.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UajService } from '../../services/uaj.service';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrearPlanTrabajoComponent } from '../crear-plan-trabajo/crear-plan-trabajo.component';

@Component({
  selector: 'uaj-detalle-convenio',
  templateUrl: './detalle-convenio.component.html',
  styleUrls: ['./detalle-convenio.component.scss']
})
export class DetalleConvenioComponent implements OnInit {

  @ViewChild('uploadInput') uploadInput: ElementRef;
  loading: boolean = false;
  archivos: any[] = [];
  datas: any[] = [];
  //storageUrl = environment.backendUrl + 'storage/';

  convenioForm: FormGroup;
  loadingSubmit: boolean = false;
  denominacion: any[];
  entidadesPais: any[];
  tipoConvenio: any[];
  tGobierno: any[];
  sectores: any[];
  programas: any[];
  empleados: any = [];
  coordinadorContraparte: any = [];
  id_empleado: number;

  id_convenio: number;
  tabla_plan_trabajo: boolean = false;

  displayedColumns = ['descripcion', 'objectivo', 'responsable', 'plazo', 'recursos', 'star'];
  dataSource = ELEMENT_DATA;

  constructor(
    private conveniosService: UajService,
    public dialogRef: MatDialogRef<DetalleConvenioComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
  ) {
    this.convenioForm = this.creaForm();
    this.listaDenominacion();
    this.listaTipo();
    this.listaTipoGobierno();
    this.datosConvenio(data);
    this.id_convenio = data;
    this.listaAdenda();
  }

  ngOnInit() {
    this.convenioForm.get('coordinadorPais').valueChanges.subscribe(value => {
      if (value) {
        this.conveniosService.listarCoordinadorPais(value).subscribe(tambos => this.empleados = tambos);
      } else {
        this.empleados = [];
      }
    });
  }

  datosConvenio(id_convenio) {
    this.spinner.show();
    this.conveniosService.datoConvenio(id_convenio).subscribe((response) => {
      this.convenioForm.get("convenio").setValue(response.convenio);
      this.convenioForm.get("convenio").disable();
      this.convenioForm.get("denominacion").setValue(response.denominacion);
      this.convenioForm.get("denominacion").disable();
      this.convenioForm.get("tipoConvenio").setValue(response.tipoConvenio);
      this.convenioForm.get("tipoConvenio").disable();
      this.convenioForm.get("gobierno").setValue(response.gobierno);
      this.convenioForm.get("gobierno").disable();
      this.convenioForm.get("sector").setValue(response.sector);
      this.convenioForm.get("sector").disable();
      this.convenioForm.get("entidad").setValue(response.entidad);
      this.convenioForm.get("entidad").disable();
      this.convenioForm.get("fecha_suscripcion").setValue(response.fecha_suscripcion);
      this.convenioForm.get("fecha_suscripcion").disable();
      this.convenioForm.get("fecha_fin_convenio").setValue(response.fecha_fin_convenio);
      this.convenioForm.get("fecha_fin_convenio").disable();
      this.convenioForm.get("objeto").setValue(response.objeto);
      this.convenioForm.get("objeto").disable();
      this.id_empleado = response.coordinadorPais;
      this.convenioForm.get("coordinadorPais").setValue(response.nombreCoordinadorPais);
      this.convenioForm.get("coordinadorPais").disable();
      this.convenioForm.get("coordinadorContraparte").setValue(response.coordinadorContraparte);
      this.convenioForm.get("coordinadorContraparte").disable();
      this.convenioForm.get("pais").setValue(response.pais);
      this.convenioForm.get("pais").disable();
      this.convenioForm.get("contraparte").setValue(response.contraparte);
      this.convenioForm.get("contraparte").disable();

      this.convenioForm.get("observacion").setValue(response.observacion);
      this.convenioForm.get("plan").setValue("");
      this.spinner.hide();
    });
  }

  selectEmpledo(id) {
    this.id_empleado = +id;
  }

  listaTipoGobierno() {
    this.conveniosService.listarTipoGobierno().subscribe((response) => {
      this.tGobierno = response;
    });
  }

  changetg(event) {
    if (event.isUserInput) {
      this.conveniosService.listarSector(event.source.value).subscribe((response) => {
        this.sectores = response;
      });
    }
  }

  changes(event) {
    if (event.isUserInput) {
      this.conveniosService.listarEntidad(event.source.value).subscribe((response) => {
        this.programas = response;
      });
    }
  }

  changeco(event) {
    if (event.isUserInput) {
      this.conveniosService.listarCoordinadorContraparte(event.source.value).subscribe((response) => {
        this.coordinadorContraparte = response;
      });
    }
  }

  listaDenominacion() {
    this.conveniosService.listarDenominacion().subscribe((response) => {
      this.denominacion = response;
    });
  }

  listaTipo() {
    this.conveniosService.listarTipoConvenio().subscribe((response) => {
      this.tipoConvenio = response;
    });
  }

  cargarArchivos(files: FileList) {
    if (!files.length) {
      return;
    }

    this.loading = true;

    for (let i = 0; i < files.length; i++) {
      const formData: FormData = new FormData();
      formData.append('storage', 'convenios/archivos');
      formData.append('file', files.item(i));

      // this.conveniosService.upload(formData).subscribe(
      //   response => {
      //     this.archivos.push({
      //       directorio: response.path,
      //       nombre: response.name + '.' + response.extension,
      //     });
      //   },
      //   () => {
      //     this.matSnackBar.open(
      //       'No se pudo subir uno o más archivos.',
      //       'Cerrar',
      //       { duration: 4000, verticalPosition: 'top', horizontalPosition: 'end' }
      //     );
      //   },
      //   () => {
      //     this.loading = false;
      //     this.uploadInput.nativeElement.value = '';
      //   }
      // );
    }
  }

  removerArchivo(archivo) {
    // this.conveniosService.unlink(archivo.directorio).subscribe(() => {
    //   const archivoIndex = this.archivos.indexOf(archivo);
    //   this.archivos.splice(archivoIndex, 1);
    // });
  }

  creaForm() {
    return this.formBuilder.group({
      convenio: ['', Validators.required],
      denominacion: ['', Validators.required],
      tipoConvenio: ['', Validators.required],
      gobierno: ['', Validators.required],
      sector: ['', Validators.required],
      entidad: ['', Validators.required],
      fecha_suscripcion: [''],
      fecha_fin_convenio: [''],
      objeto: ['', Validators.required],
      coordinadorPais: ['', Validators.required],
      coordinadorContraparte: ['', Validators.required],
      pais: ['', Validators.required],
      contraparte: ['', Validators.required],
      observacion: [''],
      plan: ['']
    });
  }

  Crearconvenio() {

    if (this.convenioForm.valid) {
      this.loadingSubmit = true;
      const convenio = Object.assign(
        this.convenioForm.getRawValue(),
        {
          coordinadorPais: this.id_empleado,
          archivo: '',//this.archivos,
          //flat_entidad: this.flat_entidad
        }
      );

      this.conveniosService.guardarConvenio(convenio).subscribe(response => {
        if (response.codigo == '00') {
          this.loadingSubmit = false;
          this.matSnackBar.open(
            'Se Registro convenio.',
            'Cerrar',
            { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' }
          )
          this.dialogRef.close(true);
        } else {
          console.log(response.mensaje);
        }
      });
    } else {
      Object.keys(this.convenioForm.controls).forEach(control => {
        this.convenioForm.controls[control].markAsTouched();
      });
    }
  }

  nuevoAdenda() {
    const adendaDialog = this.matDialog.open(CrearAdendaComponent, {
      panelClass: 'dialog-no-padding',
      data: this.id_convenio
    });

    adendaDialog.afterClosed().subscribe(result => {
      if (result) {
        this.listaAdenda();
      }
    });
  }

  listaAdenda() {
    this.conveniosService.listarAdenda(this.id_convenio).subscribe((response) => {
      console.log(response);
      this.datas = response;
    });
  }

  nuevoPlan() {
    const planDialog = this.matDialog.open(CrearPlanTrabajoComponent, {
      panelClass: 'dialog-no-padding',
      data: this.id_convenio
    });

    planDialog.afterClosed().subscribe(result => {
      if (result) {
        //this.listaAdenda();
      }
    });
  }

  verPlanTrabajo(text: string) {
    if (text.length > 0) {
      this.tabla_plan_trabajo = true;
    } else {
      this.tabla_plan_trabajo = false;
    }
    console.log(text);
  }

}

export interface PeriodicElement {
  descripcion: string;
  objectivo: string;
  responsable: string;
  plazo: string;
  recursos: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  { descripcion: 'Prueba de registro de evento', objectivo: 'asdasdad', responsable: 'Franklin Ruis Asto Leon', plazo: '02/20/2020', recursos: '5' },
  { descripcion: 'prueba 1', objectivo: 'asdasdasd', responsable: 'Franklin Ruis Asto Leon', plazo: '02/20/2020', recursos: '3' },
  { descripcion: 'prueba 2', objectivo: 'asdasdad', responsable: 'Franklin Ruis Asto Leon', plazo: '02/20/2020', recursos: '6' },
  { descripcion: 'prueba 3', objectivo: 'adasdad', responsable: 'Franklin Ruis Asto Leon', plazo: '02/20/2020', recursos: '7' },
  { descripcion: 'prueba 4', objectivo: 'adsdasda', responsable: 'Franklin Ruis Asto Leon', plazo: '02/20/2020', recursos: '9' },
];