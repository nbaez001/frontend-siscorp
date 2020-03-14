import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UajService } from '../../services/uaj.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CrearActividadComponent } from '../crear-actividad/crear-actividad.component';
import { saveAs } from 'file-saver';
import { EditarActividadComponent } from '../editar-actividad/editar-actividad.component';

@Component({
  selector: 'uaj-plan-trabajo',
  templateUrl: './plan-trabajo.component.html',
  styleUrls: ['./plan-trabajo.component.scss'],
})
export class PlanTrabajoComponent implements OnInit {

  planTrabajo: any = {};
  id_convenio: number;
  actividades: any[];
  idPlanTrabajo: number = 0;
  anio: String = '0';
  cant_actividad: number = 0;

  constructor(
    private conveniosService: UajService,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id_convenio = params['id_convenio'];
    });
    this.datosPlanTrabajo();
  }

  ngOnInit() { }

  datosPlanTrabajo() {
    this.conveniosService.datoPlanTrabajo(this.id_convenio).subscribe((response) => {
      if (response.idPlan != null) {
        this.planTrabajo = response;
        this.idPlanTrabajo = response.idPlan;
        this.listaActividad();
      }
    });
  }

  nuevoActividad() {
    const planDialog = this.matDialog.open(CrearActividadComponent, {
      panelClass: 'dialog-no-padding',
      data: { idPlanTrabajo: this.idPlanTrabajo, anio: this.anio }
    });

    planDialog.afterClosed().subscribe(result => {
      if (result) {
        this.listaActividad();
      }
    });
  }

  listaActividad() {
    this.conveniosService.listarActividad(this.idPlanTrabajo).subscribe((response) => {
      if (response.length > 0) {
        this.cant_actividad = response.length;
        this.anio = response[0].anio;
        this.actividades = response;
      }
    });
  }

  descargarExcel() {
    this.conveniosService.descargarExcel(this.idPlanTrabajo).subscribe(data => {
      saveAs(new Blob([data], { type: MimeType['xlsx'] }), 'Plan_trabajo-' + this.anio + '.xlsx');
    },
      err => {
        this.matSnackBar.open(
          'Error al descargar. Archivo no encontrado en el servidor',
          'Cerrar',
          { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end', panelClass: ['red-snackbar'] }
        )
      }
    );
  }

  onRowSelect(event) {
    const planDialog = this.matDialog.open(EditarActividadComponent, {
      panelClass: 'dialog-no-padding',
      data: { idActividad: event.data.idActividad, cantActividad: this.cant_actividad }
    });

    planDialog.afterClosed().subscribe(result => {
      if (result) {
        this.listaActividad();
      }
    });
  }

  bandeja() {
    this.router.navigate([`/uaj/convenio-bandeja`]);
  }

}

