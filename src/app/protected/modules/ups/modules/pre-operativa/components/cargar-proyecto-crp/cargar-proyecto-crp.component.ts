import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'app/protected/services/auth.service';
import { MENSAJES } from 'app/common';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatTableDataSource } from '@angular/material';

import { NgxSpinnerService } from 'ngx-spinner';

import { ProyectoService } from '../../services/proyecto.service';
import { DatosProyectoCrpComponent } from './datos-proyecto-crp/datos-proyecto-crp.component';
import { BandejaProyectoGestionResponse, WsBandejaProyectoGestionResponse } from '../../dto/Response/BandejaProyectoGestionResponse';

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
    private proyectoService: ProyectoService,
  
    
    private dialog: MatDialog,
    
    // private proyectoEjecucionService: ProyectoEjecucionService,
      
  ) {
    this.dataSource = new MatTableDataSource([]);
    
  }

  ngOnInit() {
    
    this.tituloBandeja();
    this.crearFiltrosForm();
    this.generarCabeceraColumnasEncargado();
    this.cargarPerfilPrefactibilidad();
  }

  proyectoCRPFiltroForm: FormGroup;

  crearFiltrosForm() {
    this.proyectoCRPFiltroForm = new FormGroup({
      tamboFrmCtrl: new FormControl(null),
      codigoFrmCtrl: new FormControl(null),
      convenioFrmCtrl: new FormControl(null),
    });
  }

  get tamboFrmCtrl() { return this.proyectoCRPFiltroForm.get('tamboFrmCtrl'); }
  get codigoFrmCtrl() { return this.proyectoCRPFiltroForm.get('codigoFrmCtrl'); }
  get convenioFrmCtrl() { return this.proyectoCRPFiltroForm.get('convenioFrmCtrl'); }

  filtrosProyectoRequest: FiltroProyectoRequest = new FiltroProyectoRequest();
  reiniciar() {
    this.proyectoCRPFiltroForm.reset('');
    this.filtrosProyectoRequest = null;
    this.filtrosProyectoRequest = new FiltroProyectoRequest();
    this.cargarPerfilPrefactibilidad();
  }

  public guardarFiltrosBusqueda(): void {
    this.filtrosProyectoRequest.tambo = this.tamboFrmCtrl.value;
    this.filtrosProyectoRequest.codigo = this.codigoFrmCtrl.value;
    this.filtrosProyectoRequest.convenio = this.convenioFrmCtrl.value;
  }


  tituloBandeja() {
    this.authService.cabecera.next({
      titulo: MENSAJES.PREOPERATIVA.TITLE_PROYECTO,
      icono: ''
    });
  }

  columnas: string[] = [];
  generarCabeceraColumnasEncargado(): void {
    this.columnas = [
      'item',
      'nroCodigo',
      'nroConvenio',
      'tambo',
      'inicioObra',
      'planEjecucion',
      'ampliacionPlazo',
      'diasRetraso',
      'terminoObra',
      'plazoEjecucionReal',
      'avanceFisicoProgramado',
      'avanceFisicoEjecutado',
      'avanceFinanciero',
      'estado',
      'prestandoServicio',
      'acciones'];
  }
  
  public buscarPerfilPrefactibilidad($event): void {
    $event.preventDefault();
    this.guardarFiltrosBusqueda();
    this.cargarPerfilPrefactibilidad();
  }

  

  public cargarTablaPrefactibilidad(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

  proyectoResponse: BandejaProyectoGestionResponse[];
  disableBuscar: boolean;
  isLoading: boolean;
  pagina = 1;
  cantidad = 10;
  total = 0;
  mensaje: string;

  cargarPerfilPrefactibilidad(): void {
    this.dataSource = null;
    this.disableBuscar = true;
    this.proyectoResponse = [];
    this.isLoading = true;
    this.proyectoService.listaProyectoCRP(this.pagina, this.cantidad, this.filtrosProyectoRequest)
      .subscribe(
        (wsResponseProyecto: WsBandejaProyectoGestionResponse) => {
         
          if (wsResponseProyecto.codResultado == 1) {
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
            this.cargarTablaPrefactibilidad();
            
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
             
          }
          this.isLoading = false;
          this.disableBuscar = false;
        },
        error => {

          console.error(error);

        }
      );
  }

  agregarDatosProyectoCRP(proyecto: BandejaProyectoGestionResponse): void {
    console.log(proyecto)
    const dialogReg: MatDialogRef<DatosProyectoCrpComponent> = this.dialog.open(DatosProyectoCrpComponent, {
      disableClose: true,
      width: '1100px',
      autoFocus: false,
      data: {
        title:'ACTUALIZAR DATOS GENERALES DEL PROYECTO',objeto: proyecto

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

export class FiltroProyectoRequest {
  convenio?: string;
  codigo?: string;
  tambo?: string;
}
