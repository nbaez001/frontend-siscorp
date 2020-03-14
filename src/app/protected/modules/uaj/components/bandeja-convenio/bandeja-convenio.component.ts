import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CrearConvenioComponent } from '../crear-convenio/crear-convenio.component';
import { UajService } from '../../services/uaj.service';
import { DetalleConvenioComponent } from '../detalle-convenio/detalle-convenio.component';
import { ViewFileComponent } from '../view-file/view-file.component';
import { Session } from '@shared/auth/Session';

@Component({
  selector: 'app-bandeja-convenio',
  templateUrl: './bandeja-convenio.component.html',
  styleUrls: ['./bandeja-convenio.component.scss']
})
export class BandejaConvenioComponent implements OnInit {

  displayedColumns = [
    'row',
    'denominacion_convenios',
    'tipo_convenios',
    'entidad_contraparte_convenios',
    'fecha_suscripcion',
    'fecha_fin_convenio',
    'coordinadores_convenios',
    'buttons'
  ];

  // paginado//                
  pageTotal: number;
  pageSize: number = 10;
  pageIndex: number = 1;

  convenios = [];
  denominacion: any[];
  tipoConvenio: any[];
  area: any[];

  filtrosForm: FormGroup;
  // MatPaginator Inputs
  btnValidar: boolean = true;

  constructor(
    private conveniosService: UajService,
    private matDialog: MatDialog,
    private router: Router,
  ) {
    this.crearFiltrosForm();
    this.listaDenominacion();
    this.listaTipo();
    this.listaArea();
    this.lista();
    if (Session.identity.lista_perfil_modulo[0].idArea != 14) {
      this.btnValidar = false;
      this.filtrosForm.get('area').disable();
    }
  }

  ngOnInit() { }

  crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
      denominacion: new FormControl(null),
      tipoConvenio: new FormControl(null),
      area: new FormControl((Session.identity.lista_perfil_modulo[0].idArea) != 14 ? (Session.identity.lista_perfil_modulo[0].idArea) : null),
    });
  }

  lista() {
    this.conveniosService.listarConvenio({
      denominacion: this.filtrosForm.get('denominacion').value,
      tipoConvenio: this.filtrosForm.get('tipoConvenio').value,
      area: this.filtrosForm.get('area').value,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }).subscribe((response) => {
      if (response.length > 0) {
        this.pageTotal = response[0].total;
        this.convenios = response;
      }
    });
  }

  listaArea() {
    this.conveniosService.listaArea().subscribe((response) => {
      this.area = response;
    });
  }

  cambiarPagina(event) {
    this.pageIndex = event.pageIndex + 1;
    this.lista();
  }

  nuevoConvenio() {
    const conveniotDialog = this.matDialog.open(CrearConvenioComponent, {
      width: '800px',
      panelClass: 'dialog-no-padding',
    });

    conveniotDialog.afterClosed().subscribe(result => {
      if (result) {
        this.lista();
      }
    });
  }

  detalleConvenio(id_convenio) {
    const conveniotDialog = this.matDialog.open(DetalleConvenioComponent, {
      width: '950px',
      panelClass: 'dialog-no-padding',
      data: id_convenio
    });

    conveniotDialog.afterClosed().subscribe(() => {
      this.lista();
    });
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

  openPlanTrabajo(id_convenio) {
    this.router.navigate([`/uaj/plan-trabajo/${id_convenio}`]);
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

  clearForm() {
    this.filtrosForm.reset();
  }

}