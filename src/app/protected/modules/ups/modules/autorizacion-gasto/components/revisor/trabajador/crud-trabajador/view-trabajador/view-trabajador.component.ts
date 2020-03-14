import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TrabajadorRequest } from '../../../../../dto/request/TrabajadorRequest';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatTableDataSource } from '@angular/material';
import { TrabajadorService } from '../../../../../service/trabajador.service';
import * as _moment from 'moment';
import { MENSAJES } from 'app/common';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { filter } from 'rxjs/operators';
import { WsResponseProyecto } from 'app/protected/modules/ups/modules/expediente/dto/response/ProyectoResponse';

@Component({
  selector: 'app-view-trabajador',
  templateUrl: './view-trabajador.component.html',
  styleUrls: ['./view-trabajador.component.scss']
})
export class ViewTrabajadorComponent implements OnInit {

  // ************* tabs
  laboral: boolean;
  selectedIndexTab: string;
  // ************* data
  proyectoForm: FormGroup;

  listTipoDocumento: any[];
  listGenero: any[];
  listRubro: any[];
  listCategoria: any[];
  listTipo: any[];
  listDepartamento: any[];
  listProvincia: any[];
  listDistrito: any[];


  dataSource: MatTableDataSource<any>;
  wsResponseProyecto: WsResponseProyecto;
  
  proyectoResponse: any[];
  objproyectoResponse: any;
  columnas: string[] = [];
  disableBuscar: boolean;
  isLoading: boolean;

  trabajador: TrabajadorRequest = new TrabajadorRequest();

  constructor(
    public dialogRef: MatDialogRef<ViewTrabajadorComponent>,
    private formBuilder: FormBuilder,
    private trabajadorService: TrabajadorService,
    private dialog: MatDialog,
    
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: DataTrabajador
  ) {
    this.formulario();
  }

  ngOnInit() {
    this.cargarCombos();
    if (this.datos.dataTrabajador) {
      
      this.trabajador = this.datos.dataTrabajador[1];
      this.buscarProvincia(this.trabajador.idDepartamento);
      this.buscarDistrito(this.trabajador.idProvincia);
      this.proyectoForm.get('fechaNacimiento').setValue(this.retornaFecha(this.trabajador.fechaNacimiento));
      this.proyectoForm.get('fechaInicioContrato').setValue(this.retornaFecha(this.trabajador.fechaInicioContrato));
      this.proyectoForm.get('fechaTerminoContrato').setValue(this.retornaFecha(this.trabajador.fechaTerminoContrato));
    }
  }

  retornaFecha(fecha: string) {
    return new Date(`${fecha}T23:00`);
  }

  // ************* TABS
  tab_click($event) {
    if ($event == 0) {
      this.selectedIndexTab = "0";
      this.laboral = true;
    } else if ($event == 1) {
      this.selectedIndexTab = "1";
    }
  }

  tabPersonalGuardar() {
    this.laboral = false;
    this.selectedIndexTab = "1";
    // let seleccionPartida = this.nombrePartidaFrmCtrl.value;
    // if(seleccionPartida != "-1"){

    //   this.tabInsumo = false;
    //   this.selectedIndexTab = "1";
    // }else{
    //   this.openDialogMensaje(MENSAJES.CRONOGRAMA.VALIDAR_PARTIDA, true);
    // }

  }



  //  ************* DATA
  formulario() {
    this.proyectoForm = this.formBuilder.group({
      tipoDocumento: [{ value: '', disabled: true }, [Validators.required]],
      numeroDocumento: [{ value: '', disabled: true }, [Validators.required]],
      apellidoPaterno: [{ value: '', disabled: true }, [Validators.required]],
      apellidoMaterno: [{ value: '', disabled: true }, [Validators.required]],
      nombre: [{ value: '', disabled: true }, [Validators.required]],
      fechaNacimiento: [{ value: '', disabled: true }, [Validators.required]],
      edad:[{ value: '', disabled: true }, [Validators.required]],
      telefono: [{ value: '', disabled: true }, [Validators.required]],
      correoElectronico: [{ value: '', disabled: true }, [Validators.required]],
      idDepartamento: [{ value: '', disabled: true }, [Validators.required]],
      idProvincia: [{ value: '', disabled: true }, [Validators.required]],
      idDistrito: [{ value: '', disabled: true }, [Validators.required]],
      direccion: [{ value: '', disabled: true }, [Validators.required]],
      genero: [{ value: '', disabled: true }, [Validators.required]],
      rubro: [{ value: '', disabled: true }, [Validators.required]],
      categoria:[{ value: '', disabled: true }, [Validators.required]],
      tipo: [{ value: '', disabled: true }, [Validators.required]],
      monto: [{ value: '', disabled: true }, [Validators.required]],
      nroContrato: [{ value: '', disabled: true }, [Validators.required]],
      fechaInicioContrato: [{ value: '', disabled: true }, [Validators.required]],
      fechaTerminoContrato: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

 

  modificar(){
    this.proyectoForm.get('tipoDocumento').enable();
    this.proyectoForm.get('numeroDocumento').enable();
    this.proyectoForm.get('apellidoPaterno').enable();
    this.proyectoForm.get('apellidoMaterno').enable();
    this.proyectoForm.get('nombre').enable();
    this.proyectoForm.get('fechaNacimiento').enable();
    this.proyectoForm.get('edad').enable();
    this.proyectoForm.get('telefono').enable();
    this.proyectoForm.get('correoElectronico').enable();
    this.proyectoForm.get('idDepartamento').enable();
    
    this.proyectoForm.get('idProvincia').enable();
    this.proyectoForm.get('idDistrito').enable();
    this.proyectoForm.get('direccion').enable();
    this.proyectoForm.get('genero').enable();
    this.proyectoForm.get('rubro').enable();
    this.proyectoForm.get('categoria').enable();

    this.proyectoForm.get('tipo').enable();


    this.proyectoForm.get('monto').enable();

    this.proyectoForm.get('nroContrato').enable();

    this.proyectoForm.get('fechaInicioContrato').enable();
    this.proyectoForm.get('fechaTerminoContrato').enable();


  }
  
  eliminarTrabajador(idCodigo: number, nombre: string, apellidoPaterno: string, apellidoMaterno: string ) {
    this.openDialogMensajeConfirm(MENSAJES.TRABAJADOR.ELIMINAR_TRABAJADOR_CONFIRM + nombre+" " + apellidoPaterno+" "+ apellidoMaterno +'?', true);
    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.dialogRef.close(true);
        this.snackBar.open("Trabajador " + nombre + " eliminado");
        
      });
  }


 

  guardarTrabajador() {
   
        

    const dataTrabajador = new TrabajadorRequest();
    dataTrabajador.tipoDocumento = this.proyectoForm.get('tipoDocumento').value;
    dataTrabajador.numeroDocumento = this.proyectoForm.get('numeroDocumento').value;
    dataTrabajador.apellidoPaterno = this.proyectoForm.get('apellidoPaterno').value;
    dataTrabajador.apellidoMaterno = this.proyectoForm.get('apellidoMaterno').value;
    dataTrabajador.nombre = this.proyectoForm.get('nombre').value;
    dataTrabajador.fechaNacimiento = this.proyectoForm.get('fechaNacimiento').value;
    dataTrabajador.edad= this.proyectoForm.get('edad').value;
    dataTrabajador.tipoGenero = this.proyectoForm.get('genero').value;
    dataTrabajador.telefono = this.proyectoForm.get('telefono').value;
    dataTrabajador.correoElectronico = this.proyectoForm.get('correoElectronico').value;
    dataTrabajador.idDepartamento = this.proyectoForm.get('idDepartamento').value;
    dataTrabajador.idProvincia = this.proyectoForm.get('idProvincia').value;
    dataTrabajador.idDistrito = this.proyectoForm.get('idDistrito').value;
    dataTrabajador.direccion = this.proyectoForm.get('direccion').value;
    dataTrabajador.tipoRubro = this.proyectoForm.get('rubro').value;
    dataTrabajador.tipoCategoria = this.proyectoForm.get('categoria').value;
    dataTrabajador.tipoTipo = this.proyectoForm.get('tipo').value;
    dataTrabajador.montoJornal = this.proyectoForm.get('monto').value;
    dataTrabajador.nroContrato = this.proyectoForm.get('nroContrato').value;
    dataTrabajador.fechaInicioContrato = this.proyectoForm.get('fechaInicioContrato').value;
    dataTrabajador.fechaTerminoContrato = this.proyectoForm.get('fechaTerminoContrato').value;

    console.log(dataTrabajador);
    console.log(this.trabajador.idCodigo);

    console.log(this.trabajador);

    if (this.trabajador.idCodigo) {
      // ACTUALIZAR
      
    } else {
      // INSERTA
      
    }

    this.openDialogMensajeConfirm(MENSAJES.TRABAJADOR.MODIFICAR_TRABAJADOR_CONFIRM, true);
    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.dialogRef.close(true);
        this.snackBar.open("Se guardo los cambios");
        
      });
    
  }


  dialogRefMessage: MatDialogRef<any>;

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

  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

 

  cargarCombos() {
    this.trabajadorService.obtenerTipoDocumento().subscribe(data => {
      this.listTipoDocumento = data.response
    });
    this.trabajadorService.obtenerGeneroTrabajador().subscribe(data => {
      this.listGenero = data.response
    });
    this.trabajadorService.obtenerRubro().subscribe(data => {
      this.listRubro = data.response
    });
    this.trabajadorService.obtenerCategoriaTrabajador().subscribe(data => {
      this.listCategoria = data.response
    });
    this.trabajadorService.obtenerTipoTrabajador().subscribe(data => {
      this.listTipo = data.response
    });
    this.trabajadorService.obtenerListadoDepartamento().subscribe(data => {
      this.listDepartamento = data.response
    });
  }

  buscarProvincia(idDepartamento: number) {
    this.trabajadorService.obtenerListadoProvincia(idDepartamento).subscribe(data => {
      this.listProvincia = data.response
      this.listDistrito = null;
    });
  }

  buscarDistrito(idProvincia: number) {
    this.trabajadorService.obtenerListadoDistrito(idProvincia).subscribe(data => {
      this.listDistrito = data.response
    });
  }

  descargarArchivo(idCodigoArchivo: any, nombreArchivo: any) {
    alert("descargando");
    /*
    const EXT = nombreArchivo.substr(nombreArchivo.lastIndexOf('.') + 1);
    this.trabajadorService.downloadFile(idCodigoArchivo, nombreArchivo)
      .subscribe(data => {
        //Guarda en la pc del cliente.
        saveAs(new Blob([data], { type: MimeType[EXT] }), nombreArchivo);
      })
    */
  }

}

interface DataTrabajador {
  dataTrabajador?: any
  
}
