import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'app/protected/services/auth.service';
import { MENSAJES } from 'app/common';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatTableDataSource } from '@angular/material';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { Reniec } from '../../../autorizacion-gasto/dto/response/Reniec';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrabajadorRequest } from '../../../autorizacion-gasto/dto/request/TrabajadorRequest';
import { WsResponseProyecto } from '../../../autorizacion-gasto/dto/response/Proyecto';
import { id } from '@swimlane/ngx-charts/release/utils';
import { TrabajadorService } from '../../services/trabajador.service';
import { DatosProyectoCrpComponent } from './datos-proyecto-crp/datos-proyecto-crp.component';
import { BandejaProyectoGestionResponse } from '../../dto/Response/BandejaProyectoGestionResponse';

@Component({
  selector: 'app-cargar-proyecto-crp',
  templateUrl: './cargar-proyecto-crp.component.html',
  styleUrls: ['./cargar-proyecto-crp.component.scss']
})
export class CargarProyectoCRPComponent implements OnInit {
  
  proyectoForm1: FormGroup;
  
  dataSource: MatTableDataSource<BandejaProyectoGestionResponse>;
  
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    
    private spinner: NgxSpinnerService,
   
  
    
    private dialog: MatDialog,
    
    // private proyectoEjecucionService: ProyectoEjecucionService,
      
  ) {
    this.dataSource = new MatTableDataSource([]);
    
  }

  ngOnInit() {
    
    this.tituloBandeja();
    this.crearFiltrosForm();
    this.columnasAutorizacion();
  
  }

  proyectoCRPFiltroForm: FormGroup;

  crearFiltrosForm() {
    this.proyectoCRPFiltroForm = new FormGroup({
      fechaRegDesdeFrmCtrl: new FormControl(null),
      fechaRegHastaFrmCtrl: new FormControl(null),
      estadoFrmCtrl: new FormControl(null)
    });
  }

  tituloBandeja() {
    this.authService.cabecera.next({
      titulo: MENSAJES.PREOPERATIVA.TITLE_PROYECTO,
      icono: ''
    });
  }

  columnas: string[] = [];
  columnasAutorizacion(): void {
    this.columnas = [
      'nro',
      'numeroHojaTramite',
      'numeroAutorizacionGasto',
      'fechaPresentacionPrograma',
      'montoSolicitado',
      'montoAutorizado',
      'estado',
      'fechaAprobacionAutorizacion',
      'acciones'
    ];
  }

  
  modalDatosProyectoGestion(): void {
    const dialogReg: MatDialogRef<DatosProyectoCrpComponent> = this.dialog.open(DatosProyectoCrpComponent, {
      disableClose: true,
      width: '1100px',
      autoFocus: false,
      data: {
       
      },
    });
  }

  ngOnDestroy() {
    
  }

}


interface DataTrabajador {
  dataTrabajador?: any
  showTitulo?: any
  showAge?: any
  idForm?: any
}


interface Profesional {
    id?: string
  cargo?: string
  nombre?: string
  dni?: string
}