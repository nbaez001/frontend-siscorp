import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog, PageEvent, MatDialogRef, MatSnackBar } from '@angular/material';
import { CustomIconService } from '../../../../expediente/services/custom-icon.service';
import { MENSAJES } from 'app/common';
import { WsResponseProyecto } from '../../../dto/response/Proyecto';
import { TrabajadorService } from '../../../service/trabajador.service';
import { SelectionModel } from '@angular/cdk/collections';
import * as _moment from 'moment';
import { filter } from 'rxjs/operators';
import { AsistenciaTareoComponent } from './asistencia-tareo/asistencia-tareo.component';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { CreateUpdateTrabajadorComponent } from './crud-trabajador/create-update-trabajador/create-update-trabajador.component';
import { ViewTrabajadorComponent } from './crud-trabajador/view-trabajador/view-trabajador.component';
import { CalculoPagoComponent } from './calculo-pago/calculo-pago.component';
import { TrabajadorRequest } from '../../../dto/request/TrabajadorRequest';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'app/protected/services/auth.service';
import { MontojornalComponent } from './montojornal/montojornal.component';
import { ListaAsistenciaTareoComponent } from './asistencia-tareo/lista-asistencia-tareo/lista-asistencia-tareo.component';
import { RegistroAsistenciaTareoComponent } from './asistencia-tareo/registro-asistencia-tareo/registro-asistencia-tareo.component';
import { CalendarView } from 'angular-calendar';
import { isToday } from 'date-fns';
import { ParametroBodyGeneralRequest } from '../../../dto/request/ParametroBodyGeneralRequest';
import { WsResponseTrabajador } from '../../../dto/response/TrabajadorResponse';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styleUrls: ['./trabajador.component.scss']
})
export class TrabajadorComponent implements OnInit {

  filtrosForm: FormGroup;
  fechaActual = new Date();
  pagina = 1;
  cantidad = 10;
  total = 0;

  listGenero: any[];
  listCategoria: any[];
  listTipo: any[];
  parametroGeneralRequest: ParametroBodyGeneralRequest = new ParametroBodyGeneralRequest();
  public fechaInicio: string = " ";
  public fechaFin: string = " ";

  // Tabla 1
  dataSourceManoObraNoCal: MatTableDataSource<any>; // dataSource: MatTableDataSource<RegistroComprobante>;
  manoObraNoCalResponse: any[]; //datosResponse : RegistroComprobante[];
  
  dataSourceManoObraCal: MatTableDataSource<any>; // dataSource: MatTableDataSource<RegistroComprobante>;
  manoObraCalResponse: any[]; //datosResponse : RegistroComprobante[];

  dataSourcePerAux: MatTableDataSource<any>; // dataSource: MatTableDataSource<RegistroComprobante>;
  perAuxResponse: any[]; //datosResponse : RegistroComprobante[];

  trabajadorRequest:TrabajadorRequest= new TrabajadorRequest();

  objproyectoResponse: any;


  // Checked
  selectionTrabajador = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dialogRefMessage: MatDialogRef<any>;

  isLoading: boolean;
  columnas3: string[] = [];
  columnas2: string[] = [];
  columnas: string[] = [];

  mensaje: string;
  dataTrabajador: any;

  jornalPeon:string;
  jornalOperario:string;
  jornalOficial:string;
  parametrosBody: ParametroBodyGeneralRequest = new ParametroBodyGeneralRequest(); 

  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TrabajadorComponent>,
    private trabajadorService: TrabajadorService,
    private customIconService: CustomIconService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.dataSourceManoObraNoCal = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.customIconService.cargaIcono();
    this.crearFiltrosForm();
    this.cargarCombos();
    this.cargarTablaManoObraNoCal();
    this.cargarTablaManoObraCal();
    this.cargarTablaPersonalAuxiliar();
    this.cargarMontosJornales();
    
  }


  ngOnDestroy() {
    this.authService.cabecera.next({
      titulo: '',
      icono: ''
    });
  }

  cargarMontosJornales(){
    this.parametrosBody.idProyecto=21150;//seteamos el parametro idProyecto

    this.parametrosBody.opcion='BUSCA_JORNAL_PEON';
    this.trabajadorService.obtenerMontosJornal(this.parametrosBody).subscribe(data => {
      
       this.jornalPeon=data.response;
    });
    this.parametrosBody.opcion='BUSCA_JORNAL_OPERARIO';
    this.trabajadorService.obtenerMontosJornal(this.parametrosBody).subscribe(data => {
      this.jornalOperario=data.response;
    });
    this.parametrosBody.opcion='BUSCA_JORNAL_OFICIAL';
    this.trabajadorService.obtenerMontosJornal(this.parametrosBody).subscribe(data => {
      this.jornalOficial=data.response;
    });

  }

  // **************** CARGA TABLAS TRABAJADOR ****************
  cargarTablaManoObraNoCal(){
      this.columnas = ['nro', 'nombre', 'genero', 'numeroDocumento', 'acciones' ];
      this.parametroGeneralRequest.opcion = "LISTA_TRABAJADOR_NO_CALIFICADO"; 
      this.parametroGeneralRequest.idProyecto=21150;
      this.trabajadorService.listarTrabajadorAutorizacionGasto(this.pagina, this.cantidad, this.parametroGeneralRequest)
      .subscribe(
        (wsResponseTrabajador : WsResponseTrabajador)=> {
          if(wsResponseTrabajador.codResultado == 1){
            this.manoObraNoCalResponse = (wsResponseTrabajador.response != null) ? wsResponseTrabajador.response : [];
            this.total = (wsResponseTrabajador.total!=0)? wsResponseTrabajador.total : 0;
            if (this.manoObraNoCalResponse != null && this.manoObraNoCalResponse.length > 0) {
              this.dataSourceManoObraNoCal = new MatTableDataSource(this.manoObraNoCalResponse);
            }
          }
        },
        error => {
          console.error(error);
        }   
      ); 
  }

  cargarTablaManoObraCal(){
    this.columnas2 = ['nro', 'nombre', 'genero',  'numeroDocumento',  'tipo',  'acciones'  ];
    this.parametroGeneralRequest.opcion = "LISTA_TRABAJADOR_CALIFICADO"; 
    this.parametroGeneralRequest.idProyecto=21150;
    this.trabajadorService.listarTrabajadorAutorizacionGasto(this.pagina, this.cantidad, this.parametroGeneralRequest)
    .subscribe(
      (wsResponseTrabajador : WsResponseTrabajador)=> {
        if(wsResponseTrabajador.codResultado == 1){
          this.manoObraCalResponse = (wsResponseTrabajador.response != null) ? wsResponseTrabajador.response : [];
          this.total = (wsResponseTrabajador.total!=0)? wsResponseTrabajador.total : 0;
          if (this.manoObraCalResponse != null && this.manoObraCalResponse.length > 0) {
            this.dataSourceManoObraCal = new MatTableDataSource(this.manoObraCalResponse);
          }
        }
      },
      error => {
        console.error(error);
      }   
    ); 
  }

  cargarTablaPersonalAuxiliar(){
    this.columnas3 = ['nro',    'nombre',   'genero',  'numeroDocumento', 'tipo', 'fechaInicioTbjo','acciones'];
    this.parametroGeneralRequest.idUsuario = "1";//SETEAR E ID USUARIO
    this.parametroGeneralRequest.opcion = "LISTA_TRABAJADOR_AUXILIAR";
    this.parametroGeneralRequest.idProyecto=21150;
    this.trabajadorService.listarTrabajadorAutorizacionGasto(this.pagina, this.cantidad, this.parametroGeneralRequest)
    .subscribe(
      (wsResponseTrabajador : WsResponseTrabajador)=> {
        if(wsResponseTrabajador.codResultado == 1){
          this.perAuxResponse = (wsResponseTrabajador.response != null) ? wsResponseTrabajador.response : [];
          this.total = (wsResponseTrabajador.total!=0)? wsResponseTrabajador.total : 0;
          if (this.perAuxResponse != null && this.perAuxResponse.length > 0) {
            this.dataSourcePerAux = new MatTableDataSource(this.manoObraNoCalResponse);
          }
        }
      },
      error => {
        console.error(error);
      }   
    ); 
  }

  

  public cargarTrabajador(): void {
    /*this.columnas = ['nro', 'nombre', 'genero', 'numeroDocumento', 'acciones'  ];
    this.columnas2 = ['nro', 'nombre', 'genero',  'numeroDocumento',  'tipo',  'acciones'  ];
    this.columnas3 = ['nro',    'nombre',   'genero',  'numeroDocumento', 'tipo', 'fechaInicioTbjo','acciones'];

    this.dataSourceManoObraNoCal = null;
    this.disableBuscar = true;
    this.manoObraNoCalResponse = [];
    this.isLoading = true;
    this.parametroGeneralRequest.idUsuario = "1";//SETEAR E ID USUARIO
    this.parametroGeneralRequest.opcion = "LISTAR_TRAB_MONC";

    this.trabajadorService.listarTrabajadorAutorizacionGasto(this.pagina, this.cantidad, this.parametroGeneralRequest)
      .subscribe(
        (wsResponseManoObraNoCal: WsResponseProyecto) => {
          if (wsResponseManoObraNoCal.codResultado == 1) {
            this.manoObraNoCalResponse = (wsResponseManoObraNoCal.response != null) ? wsResponseManoObraNoCal.response : [];
            this.total = (wsResponseManoObraNoCal.total != 0) ? wsResponseManoObraNoCal.total : 0;
             if (this.manoObraNoCalResponse != null && this.manoObraNoCalResponse.length > 0) {
                this.dataSourceManoObraNoCal = new MatTableDataSource(this.manoObraNoCalResponse);
              }
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
      */
  }

  // **************** BANDEJA ****************

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarTrabajador();
  }

  seleccionarTrabajador(trabajador) {
    this.selectionTrabajador.toggle(trabajador);
  }

  // ****************  FILTROS  ****************
  crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
      apellidoNombreFrmCtrl: new FormControl(null),
      comboCategoriaFrmCtrl: new FormControl(null),
      comboTipoFrmCtrl: new FormControl(null),
      fechaDesdeFrmCtrl: new FormControl(null),
      fechaHastaFrmCtrl: new FormControl(null),
    });
  }
  get apellidoNombreFrmCtrl() { return this.filtrosForm.get('apellidoNombreFrmCtrl'); }
  get comboCategoriaFrmCtrl() { return this.filtrosForm.get('comboCategoriaFrmCtrl'); }
  get comboTipoFrmCtrl() { return this.filtrosForm.get('comboTipoFrmCtrl'); }
  // get fechaDesdeFrmCtrl() { return this.filtrosForm.get('fechaDesdeFrmCtrl'); }
  // get fechaHastaFrmCtrl() { return this.filtrosForm.get('fechaHastaFrmCtrl'); }

  cargarCombos() {
    // this.trabajadorService.obtenerGeneroTrabajador().subscribe(data => {
    //   this.listGenero = data.response;
    // });
    this.trabajadorService.obtenerCategoriaTrabajador().subscribe(data => {
      this.listCategoria = data.response;
    });
    this.trabajadorService.obtenerTipoTrabajador().subscribe(data => {
      this.listTipo = data.response
    });
  }

  public guardarFiltrosBusqueda(): void {
    // this.filtrosTrabajadorRequest.apellidoNombre = this.apellidoNombreFrmCtrl.value;
    // this.filtrosTrabajadorRequest.categoria = this.comboCategoriaFrmCtrl.value;
    // this.filtrosTrabajadorRequest.tipo = this.comboTipoFrmCtrl.value;
    // this.filtrosTrabajadorRequest.fechaInicio = this.fechaDesdeFrmCtrl.value !== null ? _moment(this.fechaDesdeFrmCtrl.value).format('DD-MM-YYYY') : null;
    // this.filtrosTrabajadorRequest.fechaFin = this.fechaHastaFrmCtrl.value !== null ? _moment(this.fechaHastaFrmCtrl.value).format('DD-MM-YYYY') : null;
  }

  public filtrarTrabajador($event): void {
    $event.preventDefault();
    this.guardarFiltrosBusqueda();
    this.cargarTrabajador();
  }

  reiniciar() {
    this.filtrosForm.reset('');
    //this.filtrosTrabajadorRequest = new TrabajadorRequest();
    this.cargarTrabajador();
  }

  showTitulo;
  idForm;
  
  modalTrabajador(idCodigo: number, idTitulo: number) {''
    console.log("idtitulo1");
    console.log(this.showTitulo);

    if(idTitulo==1){
      this.showTitulo="REGISTRAR MONC";
      this.idForm=1
     
    }else{
      if(idTitulo==2){
        this.showTitulo="REGISTRAR MOC";
        this.idForm=2
    }
    else{
      if(idTitulo==3){
        this.showTitulo="REGISTRAR PERSONAL AUXILIAR ";
        this.idForm=3
      }else{
        this.showTitulo="MODIFICAR TRABAJADOR";
        
      }
      
    }
  }
    
    
    if (idCodigo) {
      this.trabajadorService.obtenerTrabajador(idCodigo).subscribe(data => {
        
        
        
        const dialogReg: MatDialogRef<CreateUpdateTrabajadorComponent> = this.dialog.open(CreateUpdateTrabajadorComponent, {
          
          width: '750px',
          disableClose: true,
          data: {
            dataTrabajador: data.response,
            showTitulo: this.showTitulo,
            idForm: this.idForm          
          }
          

        });
       
        dialogReg.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe((parametroRequestDialog: any) => {
          this.cargarTrabajador();
        });
      });
    } else {
      console.log('DATOS form'),
      console.log(idTitulo);
      const dialogReg: MatDialogRef<CreateUpdateTrabajadorComponent> = this.dialog.open(CreateUpdateTrabajadorComponent, {
        
        
        
        width: '750px',
        disableClose: true,
        data: { id: 2,
          showTitulo: this.showTitulo ,
          idForm: this.idForm       
        }


      });
      dialogReg.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe((parametroRequestDialog: any) => {
        this.cargarTrabajador();
        
      });
      
    }
    
  }

  modificarJornal() {

    
      const dialogReg: MatDialogRef<MontojornalComponent> = this.dialog.open(MontojornalComponent, {
        panelClass: 'dialog-no-padding',
        width: '400px', 
        disableClose: true,
        data: {
          
         
        }
      });
    
  }

  verTrabajador(idCodigo: number) {

    
    this.trabajadorService.obtenerTrabajador(idCodigo).subscribe(data => {
      const dialogReg: MatDialogRef<ViewTrabajadorComponent> = this.dialog.open(ViewTrabajadorComponent, {
        panelClass: 'dialog-no-padding',
        width: '600px',
        
        disableClose: true,
        data: {
          dataTrabajador: data.response,
         
        }
      });
    });
  }

  verTrabajador2(tr: any) {

    console.log("idcodigo")
    console.log(tr.tipo)
    console.log("idtipo")
   
    this.trabajadorService.obtenerTrabajador(tr.idCodigo).subscribe(data => {
      const dialogReg: MatDialogRef<ViewTrabajadorComponent> = this.dialog.open(ViewTrabajadorComponent, {
        panelClass: 'dialog-no-padding',
        width: '600px',
        disableClose: true,
        data: {
          dataTrabajador: data.response,
         
        }
      });
    });
  }

  eliminarTrabajador(idCodigo: number, trabajador: string) {
    this.openDialogMensajeConfirm(MENSAJES.TRABAJADOR.ELIMINAR_TRABAJADOR_CONFIRM + trabajador + '?', true);
    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open("Trabajador " + trabajador + " eliminado");
        this.cargarTrabajador();
      });
  }

  calculoPagoMensual(idCodigo: number) {
    this.trabajadorService.obtenerTrabajadorCalculoPagoMensual(idCodigo).subscribe(data => {
      const dialogReg: MatDialogRef<CalculoPagoComponent> = this.dialog.open(CalculoPagoComponent, {
        panelClass: 'dialog-no-padding',
        width: '45%',
        height: '98%',
        disableClose: true,
        data: {
          dataPagoMensualTrabajador: data.response
        }
      });
    });
  }

  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

  // **************** TAREO ****************
  verAsistencia() {
    
    let idSelect = "";
    this.selectionTrabajador.selected.forEach(response => {
      idSelect = idSelect + response.idCodigo + ',';
    });
    const dialogReg: MatDialogRef<AsistenciaTareoComponent> = this.dialog.open(AsistenciaTareoComponent, {
      disableClose: true,
   
      width: '650px',
      data: {
        dataTrabajadorSelected: idSelect.substr(0, idSelect.length - 1)
      }
    });
    
  }

  

  registraAsistenciaDiaria() {
    let fecha = new Date()
    const dialogReg: MatDialogRef<RegistroAsistenciaTareoComponent> = this.dialog.open(RegistroAsistenciaTareoComponent, {
      disableClose: true,
     
      width: '650px',
      data: {
        dataTrabajadorSelectedRegistro: this.dataTrabajador,
        dataTrabajadorSelectedFecha: fecha.toDateString()
      }
    });
  }
  
  VerAsistenciaTareo() {
    
    let idSelect = "";
    this.selectionTrabajador.selected.forEach(response => {
      idSelect = idSelect + response.idCodigo + ',';
    });
    const dialogReg: MatDialogRef<ListaAsistenciaTareoComponent> = this.dialog.open(ListaAsistenciaTareoComponent, {
      disableClose: true,
      
      width: '800px',
      data: {
        dataTrabajadorSelected: idSelect.substr(0, idSelect.length - 1)
      }
    });
   
  }

  // **************** REPORTE ****************
  generaReporteTareo() {
    if (this.selectionTrabajador.selected.length != 0) {
      this.spinner.show();
      let idSelect = "";
      this.selectionTrabajador.selected.forEach(response => {
        idSelect = idSelect + response.idCodigo + ',';
      });

      this.trabajadorService.generaReporteTareo().subscribe(response => {
        let pdf = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdf);
        window.open(url, "_blank");

        this.trabajadorService.generaReporteJornal().subscribe(response => {
          let pdf = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(pdf);
          window.open(url, "_blank");
          this.spinner.hide()
        });

      });

    } else {
      this.snackBar.open("Seleccionar un trabajador ");
    }
  }

  generaReporteJornal() {
    if (this.selectionTrabajador.selected.length != 0) {
      let idSelect = "";
      this.selectionTrabajador.selected.forEach(response => {
        idSelect = idSelect + response.idCodigo + ',';
      });

      this.trabajadorService.generaReporteJornal().subscribe(response => {
        let pdf = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdf);
        window.open(url, "_blank");
      });

    } else {
      this.snackBar.open("Seleccionar un trabajador ");
    }
  }



}
