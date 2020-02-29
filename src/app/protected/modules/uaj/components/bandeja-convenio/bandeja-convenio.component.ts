import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent, MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { CrearConvenioComponent } from '../crear-convenio/crear-convenio.component';
import { UajService } from '../../services/uaj.service';
import { DetalleConvenioComponent } from '../detalle-convenio/detalle-convenio.component';

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

  filtrosForm: FormGroup;
  // MatPaginator Inputs

  constructor(
    private conveniosService: UajService,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private router: Router,
  ) {
    this.lista();
  }

  ngOnInit() {
    this.crearFiltrosForm();
  }

  crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
      codDocFrmCtrl: new FormControl(null),
      codigoFrmCtrl: new FormControl(null),
      desProyectoFrmCtrl: new FormControl(null),
      fechaRegDesdeFrmCtrl: new FormControl(null),
      fechaRegHastaFrmCtrl: new FormControl(null),
      estadoFrmCtrl: new FormControl(null)
    });
  }

  lista() {
    this.conveniosService.listarConvenio(this.pageIndex, this.pageSize).subscribe((response) => {
      this.pageTotal = response[0].total;
      this.convenios = response;
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

    // conveniotDialog.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.lista();
    //   }
    // });
  }

}