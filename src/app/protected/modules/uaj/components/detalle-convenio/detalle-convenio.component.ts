import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { CrearAdendaComponent } from '../crear-adenda/crear-adenda.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UajService } from '../../services/uaj.service';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrearPlanTrabajoComponent } from '../crear-plan-trabajo/crear-plan-trabajo.component';
import { ViewFileComponent } from '../view-file/view-file.component';
import { Session } from '@shared/auth/Session';

@Component({
  selector: 'uaj-detalle-convenio',
  templateUrl: './detalle-convenio.component.html',
  styleUrls: ['./detalle-convenio.component.scss']
})
export class DetalleConvenioComponent implements OnInit {

  @ViewChild('uploadInput') uploadInput: ElementRef;
  loading: boolean = false;
  archivos: any = {};
  datas: any[] = [];
  flat_archivo: boolean = false;
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

  planTrabajo: any = {};
  idPlanTrabajo: number = 0;

  btnActive: boolean = true;

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
    this.datosPlanTrabajo();

    //console.log(Session.identity.id_usuario);

    if (Session.identity.lista_perfil_modulo[0].idArea != 14) {
      this.btnActive = true;
      this.convenioForm.get("convenio").disable();
      this.convenioForm.get("denominacion").disable();
      this.convenioForm.get("tipoConvenio").disable();
      this.convenioForm.get("gobierno").disable();
      this.convenioForm.get("sector").disable();
      this.convenioForm.get("entidad").disable();
      this.convenioForm.get("fecha_suscripcion").disable();
      this.convenioForm.get("fecha_fin_convenio").disable();
      this.convenioForm.get("objeto").disable();
      this.convenioForm.get("coordinadorPais").disable();
      this.convenioForm.get("coordinadorContraparte").disable();
      this.convenioForm.get("pais").disable();
      this.convenioForm.get("contraparte").disable();
    }

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
      this.convenioForm.get("denominacion").setValue(response.denominacion);
      this.convenioForm.get("tipoConvenio").setValue(+response.tipoConvenio);
      this.convenioForm.get("gobierno").setValue(response.gobierno);
      this.convenioForm.get("sector").setValue(response.sector);
      this.convenioForm.get("entidad").setValue(response.entidad);
      this.convenioForm.get("fecha_suscripcion").setValue(response.fecha_suscripcion);
      this.convenioForm.get("fecha_fin_convenio").setValue(response.fecha_fin_convenio);
      this.convenioForm.get("objeto").setValue(response.objeto);
      this.id_empleado = response.coordinadorPais;
      this.convenioForm.get("coordinadorPais").setValue(response.nombreCoordinadorPais);
      this.convenioForm.get("coordinadorContraparte").setValue(response.coordinadorContraparte);
      this.convenioForm.get("pais").setValue(response.pais);
      this.convenioForm.get("contraparte").setValue(response.contraparte);

      this.convenioForm.get("observacion").setValue(response.observacion);
      this.convenioForm.get("plan").setValue("");

      this.archivos = {
        idArchivo: response.archivo.idArchivo,
        directory: response.archivo.directory,
        filename: response.archivo.filename,
        filetype: response.archivo.filetype
      };

      this.flat_archivo = true;

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
      formData.append('file', files.item(i));

      this.conveniosService.upload(formData).subscribe(
        response => {
          this.archivos = {
            idArchivo: 0,
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

  actualizarConvenio() {
    if (this.convenioForm.valid) {

      if (!this.flat_archivo) {
        this.matSnackBar.open(
          'Falta archivo de convenio',
          'Cerrar',
          { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' }
        )
        return false;
      }

      this.spinner.show();
      const convenio = Object.assign(
        this.convenioForm.getRawValue(),
        {
          idConvenio: this.id_convenio,
          coordinadorPais: this.id_empleado,
          archivo: this.archivos,
        }
      );

      this.conveniosService.actualizarConvenio(convenio).subscribe(response => {
        if (response.codigo == '00') {
          this.spinner.hide();
          this.matSnackBar.open(
            'Se actualizo convenio.',
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
      this.datas = response;
    });
  }

  nuevoPlan() {
    const planDialog = this.matDialog.open(CrearPlanTrabajoComponent, {
      width: '450px',
      panelClass: 'dialog-no-padding',
      data: this.id_convenio
    });

    planDialog.afterClosed().subscribe(result => {
      if (result) {
        this.datosPlanTrabajo();
      }
    });
  }

  datosPlanTrabajo() {
    this.conveniosService.datoPlanTrabajo(this.id_convenio).subscribe((response) => {
      if (response.idPlan != null) {
        this.planTrabajo = response;
        this.idPlanTrabajo = response.idPlan;
      }
    });
  }

  eliminarAdenda(id_adenda) {
    this.spinner.show();
    this.conveniosService.eliminarAdenda(id_adenda).subscribe(response => {
      if (response.codigo == '00') {
        this.matSnackBar.open(
          'Se Eliminó Adenda.',
          'Cerrar',
          { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' }
        )
        this.spinner.hide();
        this.listaAdenda();
      } else {
        console.log(response.mensaje);
      }
    });
  }

  obtenerMes(mes: number) {
    let mes_texto: string;
    switch (mes) {
      case 1:
        mes_texto = 'Enero';
        break;
      case 2:
        mes_texto = 'Febreo';
        break;
      case 3:
        mes_texto = 'Marzo';
        break;
      case 4:
        mes_texto = 'Abril';
        break;
      case 5:
        mes_texto = 'Mayo';
        break;
      case 6:
        mes_texto = 'Junio';
        break;
      case 7:
        mes_texto = 'Julio';
        break;
      case 8:
        mes_texto = 'Agosto';
        break;
      case 9:
        mes_texto = 'Setiembre';
        break;
      case 10:
        mes_texto = 'Octubre';
        break;
      case 11:
        mes_texto = 'Noviembre';
        break;
      case 12:
        mes_texto = 'Diciembre';
        break;
      default:
        mes_texto = '';
        break;
    }
    return mes_texto;
  }

  observacionText(text: string) {
    if (text.length > 0) {
      this.btnActive = false;
    } else {
      this.btnActive = true;
    }
  }

  openFile(path: string) {
    this.conveniosService.viewFile(path).subscribe((data) => {
      this.matDialog.open(ViewFileComponent, {
        width: '850px',
        panelClass: 'dialog-no-padding',
        data: data
      });
    });
  }
}
