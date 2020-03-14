import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/protected/services/auth.service';
import { MENSAJES } from 'app/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ItemComboServicio } from '../../services/item-combo.service';
import { ItemBean } from '../../dto/Request/ItemBean';
import { datosProyecto } from '../../dto/Request/datosProyecto';
import { ProyectoService } from '../../services/proyecto.service';


import { WsResponseDatoProyecto, DatoProyecto } from '../../dto/Response/DatoProyectoResponse';
import { MatDialogRef, MatDialog, MatTableDataSource, PageEvent, MatSnackBar } from '@angular/material';
import { DatosProyectoGestionComponent } from './datos-proyecto-gestion/datos-proyecto-gestion.component';
import { BandejaProyectoGestionResponse, WsBandejaProyectoGestionResponse } from '../../dto/Response/BandejaProyectoGestionResponse';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-cargar-proyecto-gestion',
  templateUrl: './cargar-proyecto-gestion.component.html',
  styleUrls: ['./cargar-proyecto-gestion.component.scss']
})
export class CargarProyectoGestionComponent implements OnInit {


  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private ProyectoService: ProyectoService,
    private itemComboService: ItemComboServicio,
    
    private snackBar: MatSnackBar,
  ) {

    this.dataSource = new MatTableDataSource([]);
    
  }

  filtrosProyectoRequest: FiltroProyectoRequest = new FiltroProyectoRequest();
  proyectoGestionFiltroForm: FormGroup;
  columnas: string[] = [];
  dataSource: MatTableDataSource<BandejaProyectoGestionResponse>;
  proyectoResponse: BandejaProyectoGestionResponse[];
  disableBuscar: boolean;
  isLoading: boolean;
  pagina = 1;
  cantidad = 10;
  total = 0;
  mensaje: string;

  crpS: any[];
  cgpS: any[];

  dataItemCRP: ItemBean;
  dataItemCGP: ItemBean;

  dialogRefMessage: MatDialogRef<any>;
  wsResponseProyecto: DatoProyecto;

  crearFiltrosForm() {
    this.proyectoGestionFiltroForm = new FormGroup({
      tamboFrmCtrl: new FormControl(null),
      snipFrmCtrl: new FormControl(null),
      crpFrmCtrl: new FormControl(null),
      cgpFrmCtrl: new FormControl(null)
    });
  }
  
  columnasAutorizacion(): void {
    this.columnas = [
      'item',
      'nombreTambo',
      'snip',
      'nroCentrosPoblados',
      'nroPoblacionBeneficiada',
      'cgp',
      'crp',
      'estado',
      'acciones'
    ];
  }

  ngOnInit() {

    this.tituloBandeja();
    this.cargarDataCRP();
    this.cargarDataCGP();
    this.crearFiltrosForm();
    this.columnasAutorizacion();
    this.cargarProyectoGestion();
  }

  



  tituloBandeja() {
    this.authService.cabecera.next({
      titulo: MENSAJES.PREOPERATIVA.TITLE_PROYECTO,
      icono: ''
    });
  }



  ngOnDestroy() {

  }

  reiniciar() {
    this.proyectoGestionFiltroForm.reset('');
    this.filtrosProyectoRequest = null;
    this.filtrosProyectoRequest = new FiltroProyectoRequest();
    this.cargarProyectoGestion();
  }

  public guardarFiltrosBusqueda(): void {
    this.filtrosProyectoRequest.tambo = this.tamboFrmCtrl.value;
    this.filtrosProyectoRequest.snip = this.snipFrmCtrl.value;
    this.filtrosProyectoRequest.crp = this.crpFrmCtrl.value;
    this.filtrosProyectoRequest.cgp = this.cgpFrmCtrl.value;
  }

  public buscarProyectoGestion($event): void {
    $event.preventDefault();
    this.guardarFiltrosBusqueda();
    this.cargarProyectoGestion();
  }

  get tamboFrmCtrl() { return this.proyectoGestionFiltroForm.get('tamboFrmCtrl'); }
  get snipFrmCtrl() { return this.proyectoGestionFiltroForm.get('snipFrmCtrl'); }
  get crpFrmCtrl() { return this.proyectoGestionFiltroForm.get('crpFrmCtrl'); }
  get cgpFrmCtrl() { return this.proyectoGestionFiltroForm.get('cgpFrmCtrl'); }


 
  public cargarTablaGestion(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }


  cambiarPagina(event: PageEvent) {

    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarProyectoGestion();
  }
  
  public cargarProyectoGestion(): void {
    this.dataSource = null;
    this.disableBuscar = true;
    this.proyectoResponse = [];
    this.isLoading = true;
    this.ProyectoService.listaProyectoGestion(this.pagina, this.cantidad, this.filtrosProyectoRequest)
      .subscribe(
        (wsResponseProyecto: WsBandejaProyectoGestionResponse) => {
          console.log("DDD");
          console.log(wsResponseProyecto.codResultado);
          if (wsResponseProyecto.codResultado == 1) {
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
            this.cargarTablaGestion();
            console.log(wsResponseProyecto);
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            console.log("fff");
          }
          this.isLoading = false;
          this.disableBuscar = false;
        },
        error => {

          console.error(error);

        }
      );
  }

  

  editarProyecto(proyecto: BandejaProyectoGestionResponse){
    console.log(proyecto  )
    const dialogReg: MatDialogRef<DatosProyectoGestionComponent> = this.dialog.open(DatosProyectoGestionComponent, {
      disableClose: true,
      width: '1200px',
      autoFocus: false,
      data: { title:'ACTUALIZAR DATOS GENERALES DEL PROYECTO',objeto: proyecto},
    });
    dialogReg.afterClosed().pipe(filter(r => !!r)).subscribe(() => {
        console.log("hola")
    });
  }


  eliminarProyecto(idProyecto: String){
    console.log(idProyecto)
    this.openDialogMensajeConfirm('¿Esta seguro de eliminar el proyecto?', true);
    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.ProyectoService.eliminarProyectoGestion(idProyecto).subscribe(
          ()=>{
            this.snackBar.open("Proyecto eliminado");
            this.cargarProyectoGestion();
          }
        )
      
        
      });
  }

  public openDialogMensaje(
    message: string,
    message2: string,
    alerta: boolean,
    confirmacion: boolean,
    valor: any
  ): void {
    const dialogRef = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: MENSAJES.ARCHIVO_TITLE,
        message: message,
        message2: message2,
        alerta: alerta,
        confirmacion: confirmacion,
        valor: valor
      }
    });
    dialogRef.afterClosed().subscribe((ok: number) => {
      if (ok == 0) {

      }
    });
  }

   ///////CARGAR COMBO CRP ///
   cargarDataCRP() {

    this.itemComboService.obtenerCRP().subscribe(dataItem => {
      this.dataItemCRP = Object.assign({
        crpS: dataItem.response,
        
      });
    });

  }
  //////////////////////////

  cargarDataCGP() {
    this.itemComboService.obtenerCGP().subscribe(dataItem => {
      this.dataItemCGP = Object.assign({
        cgpS: dataItem.response

      });
    });

  }
  //////////////////////////

  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

  modalDatosProyectoGestion(): void {
    const dialogReg: MatDialogRef<DatosProyectoGestionComponent> = this.dialog.open(DatosProyectoGestionComponent, {
      disableClose: true,
      width: '1200px',
      autoFocus: false,
      data: {
        title:'REGISTRAR DATOS GENERALES DEL PROYECTO',objeto: ''
      },
    });
  }

}


export class FiltroProyectoRequest {
  tambo?: string;
  snip?: string;
  crp?: string;
  cgp?: string;
}

