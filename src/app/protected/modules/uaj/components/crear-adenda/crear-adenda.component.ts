import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { UajService } from '../../services/uaj.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'uaj-crear-adenda',
  templateUrl: './crear-adenda.component.html',
  styleUrls: ['./crear-adenda.component.scss']
})
export class CrearAdendaComponent implements OnInit {

  @ViewChild('uploadInput') uploadInput: ElementRef;
  loading: boolean = false;
  archivos: any = {};
  flat_archivo: boolean = false;

  adendaForm: FormGroup;
  loadingSubmit: boolean = false;

  constructor(
    private conveniosService: UajService,
    public dialogRef: MatDialogRef<CrearAdendaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
  ) {
    this.adendaForm = this.creaForm();
    console.log(data);
  }

  ngOnInit() {

  }

  cargarArchivos(files: FileList) {

    if (!files.length) {
      return;
    }

    this.loading = true;

    for (let i = 0; i < files.length; i++) {
      const formData: FormData = new FormData();
      formData.append('file', files.item(i));

      this.conveniosService.upload(formData).subscribe(
        response => {
          this.archivos = {
            directory: response.directory,
            filename: response.filename,
            filetype: response.filetype
          };

          this.flat_archivo = true;
        },
        () => {
          this.matSnackBar.open(
            'No se pudo subir uno o más archivos.',
            'Cerrar',
            { duration: 4000, verticalPosition: 'top', horizontalPosition: 'end' }
          );
        },
        () => {
          this.loading = false;
          this.uploadInput.nativeElement.value = '';
        }
      );
    }
  }

  removerArchivo(archivo) {
    this.conveniosService.unlink(archivo.directory).subscribe((r) => {
      this.archivos = {};
      this.flat_archivo = false;
    });
  }

  creaForm() {
    return this.formBuilder.group({
      numero: ['', Validators.required],
      fecha: ['', Validators.required],
      plazo: ['', Validators.required],
    });
  }

  crearAdenda() {
    if (this.adendaForm.valid) {
      this.spinner.show();
      const convenio = Object.assign(
        this.adendaForm.getRawValue(),
        {
          idConvenio: this.data,
          archivo: this.archivos,
        }
      );

      this.conveniosService.guardarAdenda(convenio).subscribe(response => {
        if (response.codigo == '00') {
          this.spinner.hide();
          this.matSnackBar.open(
            'Se registro adenda.',
            'Cerrar',
            { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' }
          )
          this.dialogRef.close(true);
        } else {
          console.log(response.mensaje);
        }
      });
    } else {
      Object.keys(this.adendaForm.controls).forEach(control => {
        this.adendaForm.controls[control].markAsTouched();
      });
    }
  }

}
