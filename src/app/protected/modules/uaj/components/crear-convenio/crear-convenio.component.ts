import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { UajService } from '../../services/uaj.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'uaj-crear-convenio',
  templateUrl: './crear-convenio.component.html',
  styleUrls: ['./crear-convenio.component.scss']
})
export class CrearConvenioComponent implements OnInit {

  @ViewChild('uploadInput') uploadInput: ElementRef;
  loading: boolean = false;
  archivos: any[] = [];

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

  constructor(
    private conveniosService: UajService,
    public dialogRef: MatDialogRef<CrearConvenioComponent>,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
  ) {
    this.convenioForm = this.creaForm();
    this.listaDenominacion();
    this.listaTipo();
    this.listaTipoGobierno();
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
    });
  }

  Crearconvenio() {
    this.spinner.show();
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
          this.spinner.hide();
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

}
