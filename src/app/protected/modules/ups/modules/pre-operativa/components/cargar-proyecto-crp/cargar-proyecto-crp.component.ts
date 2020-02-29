import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/protected/services/auth.service';
import { MENSAJES } from 'app/common';
import { TrabajadorService } from '../../../autorizacion-gasto/service/trabajador.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatTableDataSource } from '@angular/material';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { Reniec } from '../../../autorizacion-gasto/dto/response/Reniec';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrabajadorRequest } from '../../../autorizacion-gasto/dto/request/TrabajadorRequest';
import { WsResponseProyecto } from '../../../autorizacion-gasto/dto/response/Proyecto';
import { id } from '@swimlane/ngx-charts/release/utils';

@Component({
  selector: 'app-cargar-proyecto-crp',
  templateUrl: './cargar-proyecto-crp.component.html',
  styleUrls: ['./cargar-proyecto-crp.component.scss']
})
export class CargarProyectoCRPComponent implements OnInit {
  
  proyectoForm1: FormGroup;
  proyectoForm2: FormGroup;
  proyectoForm3: FormGroup;

  listTipoDocumento: any[];
  listGenero: any[];
  listCargo: any[];
  listCargo2: any[];
  listColegiatura: any[];

  existencia: boolean;

  trabajador: TrabajadorRequest = new TrabajadorRequest();
  trabajador2: TrabajadorRequest = new TrabajadorRequest();

  dataSource: MatTableDataSource<any>;
  wsResponseProyecto: WsResponseProyecto;
  proyectoResponse: any[];
  objproyectoResponse: any;

  
  dataSource2: MatTableDataSource<Profesional>;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private trabajadorService: TrabajadorService,
    private spinner: NgxSpinnerService,
    
  
    
    private dialog: MatDialog,
    
    // private proyectoEjecucionService: ProyectoEjecucionService,
      
  ) {
    const prof: Profesional[] = []; 
    this.formulario1();
    this.formulario2();
    this.formulario3();
    this.cargarColumas1();
    this.dataSource2 = new MatTableDataSource(prof);
    
    
  }

  ngOnInit() {
    
    this.tituloBandeja();
    this.cargarCombos();
  
  }

  columnas: string[] = [];


  fileupload: any;
  
  buscarFoto(evt): void {
    document.getElementById('fileFoto').click();
  }

  cargarFoto(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.proyectoForm2.get('foto').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.proyectoForm2.get('foto').setValue(nombreArchivo);
    }
  }

  buscarFoto2(evt): void {
    document.getElementById('fileFoto2').click();
  }

  cargarFoto2(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.proyectoForm3.get('foto').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.proyectoForm3.get('foto').setValue(nombreArchivo);
    }
  }

  buscarContrato(evt): void {
    document.getElementById('fileContrato').click();
  }

  cargarContrato(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.proyectoForm2.get('contrato').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.proyectoForm2.get('contrato').setValue(nombreArchivo);
    }
  }

  agregarProfesional(id: number =1):Profesional{
      return{
        id: id.toString(),
        dni: this.proyectoForm2.get('nroDoc').value,  
        cargo: this.proyectoForm2.get('cargo').value,
        nombre: this.proyectoForm2.get('apellidoPaterno').value,
        
      }
  }

  addRow() {
    console.log("addrow")
    this.dataSource2.data.push(this.agregarProfesional(this.dataSource2.data.length+1));
    console.log(this.dataSource2)
    this.dataSource2.filter = "";
    console.log("addrow2")
  }
  cargarColumas1(){
  this.columnas = [
  'nro',
  'cargo',
  'nombre',
  'dni',
 
  ];
  }

  tituloBandeja() {
    this.authService.cabecera.next({
      titulo: MENSAJES.PREOPERATIVA.TITLE_PROYECTO,
      icono: ''
    });
  }


  public cargarTablaTrabajador(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

  disableBuscar: boolean;
  isLoading: boolean;
  pagina = 1;
  cantidad = 2;
  total = 0;
  mensaje: string;
  filtrosTrabajadorRequest: TrabajadorRequest = new TrabajadorRequest();
  public cargarTrabajador(): void {
   
    this.dataSource = null;
    this.disableBuscar = true;
    this.proyectoResponse = [];
    this.isLoading = true;
    

    this.trabajadorService.obtenerListadoTrabajador(this.pagina, this.cantidad, this.filtrosTrabajadorRequest)
      .subscribe(
        (wsResponseProyecto: WsResponseProyecto) => {
          if (wsResponseProyecto.codResultado == 1) {
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
            this.cargarTablaTrabajador();
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            //this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);     
          }
          this.isLoading = false;
          this.disableBuscar = false;
        },
        error => {
          console.error(error);
        }
      );
      
  }
  public cargarTrabajador2(): void {
                      this.proyectoForm2.get('nroDoc').value;  
                      this.proyectoForm2.get('cargo').value;
                      this.proyectoForm2.get('apellidoPaterno').value;
                      this.proyectoForm2.get('apellidoMaterno').value;
                      this.proyectoForm2.get('nombres').value;
                       
                     
      
  }


  formulario1() {
    this.proyectoForm1 = this.formBuilder.group({
      numeroConvenio: [{ value: '', disabled: false }, [Validators.required]],
      plazoEjecucion: [{ value: '', disabled: false }, [Validators.required]],
      fechaInicioObra: [{ value: '', disabled: false }, [Validators.required]],
      entidadBancaria: [{ value: '', disabled: false }, [Validators.required]],
     
      numeroCta: [{ value: '', disabled: false }, [Validators.required]],
      monto: [{ value: '', disabled: false }, [Validators.required]],
      fechaTramite: [{ value: '', disabled: false }, [Validators.required]],
      fechaRecepcion: [{ value: '', disabled: false }, [Validators.required]],
      nroVoucher: [{ value: '', disabled: false }, [Validators.required]],
      adjuntarVoucher: [{ value: '', disabled: false }, [Validators.required]],
      actaTerreno: [{ value: '', disabled: false }, [Validators.required]],
      informeCompat: [{ value: '', disabled: false }, [Validators.required]],
    });
  }

  formulario2() {
    this.proyectoForm2 = this.formBuilder.group({
      cargo: [{ value: '', disabled: false }, [Validators.required]],
      tipoDoc: [{ value: '', disabled: false }, [Validators.required]],
      nroDoc: [{ value: '', disabled: false }, [Validators.required]],
      apellidoPaterno: [{ value: '', disabled: false }, [Validators.required]],
     
      apellidoMaterno: [{ value: '', disabled: false }, [Validators.required]],
      nombres: [{ value: '', disabled: false }, [Validators.required]],
      genero: [{ value: '', disabled: false }, [Validators.required]],
      fechaNacimiento: [{ value: '', disabled: false }, [Validators.required]],
      edad: [{ value: '', disabled: false }, [Validators.required]],
      departamento: [{ value: '', disabled: false }, [Validators.required]],
      provincia: [{ value: '', disabled: false }, [Validators.required]],
      distrito: [{ value: '', disabled: false }, [Validators.required]],
      direccion: [{ value: '', disabled: false }, [Validators.required]],
      telefono: [{ value: '', disabled: false }, [Validators.required]],
      correo: [{ value: '', disabled: false }, [Validators.required]],
      foto: [{ value: '', disabled: false }, [Validators.required]],
      tipoColegiatura: [{ value: '', disabled: false }, [Validators.required]],
      nroColegiatura: [{ value: '', disabled: false }, [Validators.required]],
      profesion: [{ value: '', disabled: false }, [Validators.required]],
      fechaInicioContrato: [{ value: '', disabled: false }, [Validators.required]],
      montoContrato: [{ value: '', disabled: false }, [Validators.required]],
      porcInformeComp: [{ value: '', disabled: false }, [Validators.required]],
      porcGarantia: [{ value: '', disabled: false }, [Validators.required]],
      contrato: [{ value: '', disabled: false }, [Validators.required]],



    });
  }

  formulario3() {
    this.proyectoForm3 = this.formBuilder.group({
      cargo: [{ value: '', disabled: false }, [Validators.required]],
      tipoDoc: [{ value: '', disabled: false }, [Validators.required]],
      nroDoc: [{ value: '', disabled: false }, [Validators.required]],
      apellidoPaterno: [{ value: '', disabled: false }, [Validators.required]],
     
      apellidoMaterno: [{ value: '', disabled: false }, [Validators.required]],
      nombres: [{ value: '', disabled: false }, [Validators.required]],
      genero: [{ value: '', disabled: false }, [Validators.required]],
      fechaNacimiento: [{ value: '', disabled: false }, [Validators.required]],
      edad: [{ value: '', disabled: false }, [Validators.required]],
      departamento: [{ value: '', disabled: false }, [Validators.required]],
      provincia: [{ value: '', disabled: false }, [Validators.required]],
      distrito: [{ value: '', disabled: false }, [Validators.required]],
      direccion: [{ value: '', disabled: false }, [Validators.required]],
      telefono: [{ value: '', disabled: false }, [Validators.required]],
      correo: [{ value: '', disabled: false }, [Validators.required]],
      foto: [{ value: '', disabled: false }, [Validators.required]],
      
    });
  }

  cargarCombos() {
    this.trabajadorService.obtenerTipoDocumento().subscribe(data => {
      this.listTipoDocumento = data.response
      this.proyectoForm2.get('tipoDoc').setValue(this.listTipoDocumento[0].idCodigo);
      this.proyectoForm3.get('tipoDoc').setValue(this.listTipoDocumento[0].idCodigo);
    });
    

    this.trabajadorService.obtenerGeneroTrabajador().subscribe(data => {
      this.listGenero = data.response
    });

    this.trabajadorService.obtenerCargoProfesionalesNE().subscribe(data => {
      this.listCargo = data.response
    });

    this.trabajadorService.obtenerTipoColegiatura().subscribe(data => {
      this.listColegiatura = data.response
    });
    this.trabajadorService.obtenerCargoMiembrosNE().subscribe(data => {
      this.listCargo2 = data.response
    });

    

    
  }

  retornaFecha(fecha: string) {
    return new Date(`${fecha}T23:00`);
  }

  age;
  showAge;
  age2;

  ageCalculator() {

    // if (this.age) {
    const convertAge = new Date(this.age);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    // this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    // this.trabajador.edad = (Math.floor((timeDiff / (1000 * 3600 * 24)) / 365)).toString();
    console.log(convertAge);
    console.log(timeDiff);
    console.log(this.showAge);

    return (Math.floor((timeDiff / (1000 * 3600 * 24)) / 365)).toString();

    


  }

  ageCalculator2() {

    // if (this.age) {
    const convertAge = new Date(this.age2);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    // this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    // this.trabajador.edad = (Math.floor((timeDiff / (1000 * 3600 * 24)) / 365)).toString();
    console.log(convertAge);
    console.log(timeDiff);
    console.log(this.showAge);

    return (Math.floor((timeDiff / (1000 * 3600 * 24)) / 365)).toString();
    
    


  }


  buscarPersona() {
    let numero = this.proyectoForm2.get('nroDoc').value;
    let tipoDocumento = this.proyectoForm2.get('tipoDoc').value;
    console.log(this.proyectoForm2.get('nroDoc').value);
    console.log(this.proyectoForm2.get('tipoDoc').value);
    if ((tipoDocumento == 1 && numero.length == 8) || (tipoDocumento == 3 && numero.length == 11)) {

    if (tipoDocumento == 1) {

      if (numero) {


        if (numero.length == 8) {
          this.trabajadorService.busquedaDataPersona(numero).subscribe(
            (wsResponseProyecto: any) => {
              if (wsResponseProyecto.codResultado == 1) {
                this.existencia = wsResponseProyecto.response[0].existencia;

                const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
                  width: '400px',
                  disableClose: true,
                  data: {
                    message: 'El número de documento no existe, se procederá a registrar a la persona',
                    alerta: true,
                    confirmacion: false
                  }
                });

                dialogRefMessage.afterClosed().subscribe(() => {
                  this.spinner.show();
                  this.trabajadorService.obtenerDataWsReniec(numero).subscribe(
                    (wsResponseReniec: Reniec) => {
                      if (wsResponseReniec.mensaje == 'OK') {
                        this.spinner.hide()
                       


                        this.proyectoForm2.get('apellidoPaterno').setValue(wsResponseReniec.reniec.apellidoMaterno);
                        this.proyectoForm2.get('apellidoMaterno').setValue(wsResponseReniec.reniec.apellidoPaterno);
                        this.proyectoForm2.get('nombres').setValue(wsResponseReniec.reniec.nombres);
                        this.proyectoForm2.get('direccion').setValue(wsResponseReniec.reniec.direccionDomicilio);
                        this.proyectoForm2.get('genero').setValue(+wsResponseReniec.reniec.sexo);
                        this.proyectoForm2.get('departamento').setValue(wsResponseReniec.reniec.ubigeoDptoDomicilio);
                        this.proyectoForm2.get('provincia').setValue(wsResponseReniec.reniec.ubigeoDistDomicilio);
                        this.proyectoForm2.get('distrito').setValue(wsResponseReniec.reniec.ubigeoProvDomicilio);
                        this.proyectoForm2.get('fechaNacimiento').setValue(this.retornaFecha((wsResponseReniec.reniec.fechaNacimiento).substr(0, 4) + "-" + (wsResponseReniec.reniec.fechaNacimiento).substr(4, 2) + "-" + (wsResponseReniec.reniec.fechaNacimiento).substr(6, 2)));
                        this.proyectoForm2.get('edad').setValue(this.ageCalculator());
                        this.proyectoForm2.get('fechaNacimiento').disable();
                        this.proyectoForm2.get('edad').disable();
                        this.proyectoForm2.get('apellidoPaterno').disable();
                        this.proyectoForm2.get('apellidoMaterno').disable();
                        this.proyectoForm2.get('apellidoPaterno').disable();
                        this.proyectoForm2.get('nombres').disable();
                        this.proyectoForm2.get('genero').disable();
                        this.proyectoForm2.get('departamento').disable();
                        this.proyectoForm2.get('provincia').disable();
                        this.proyectoForm2.get('distrito').disable();
                        this.proyectoForm2.get('direccion').disable();
                        
                      } else if (wsResponseReniec.retorno == '01') {
                        // this.spinner.hide()
                        // const dialogMessage2: MatDialogRef<AlertMessageComponent> = this.dialog.open(AlertMessageComponent);
                        // dialogMessage2.componentInstance.message = 'NO SE HA ENCONTRADO INFORMACIÓN PARA EL NÚMERO DE RUC';
                        // dialogMessage2.afterClosed().subscribe((confirm: boolean) => {
                        //   if (confirm) {

                        //   }
                        // });
                      }
                    }



                  );
                });

              }
            }
          );

        }
        else {
          const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
            width: '400px',
            disableClose: true,
            data: {
              message: 'Ingrese 8 digitos',
              alerta: true,
              confirmacion: false
            }
          });
        }
      }

    } else {
      if (tipoDocumento == 2) {
        if (numero.length == 9) {


        }
        else {
          const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
            width: '400px',
            disableClose: true,
            data: {
              message: 'Ingrese 9 digitos',
              alerta: true,
              confirmacion: false
            }
          });
        }
      } else {
        if (numero.length == 11) {


        }
        else {
          const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
            width: '400px',
            disableClose: true,
            data: {
              message: 'Ingrese 11 digitos',
              alerta: true,
              confirmacion: false
            }
          });
        }

      }
    }





  }

  }

  buscarPersona2() {
    let numero = this.proyectoForm3.get('nroDoc').value;
    let tipoDocumento = this.proyectoForm3.get('tipoDoc').value;
    console.log(this.proyectoForm3.get('nroDoc').value);
    console.log(this.proyectoForm3.get('tipoDoc').value);
    if ((tipoDocumento == 1 && numero.length == 8) || (tipoDocumento == 3 && numero.length == 11)) {

    if (tipoDocumento == 1) {

      if (numero) {


        if (numero.length == 8) {
          this.trabajadorService.busquedaDataPersona(numero).subscribe(
            (wsResponseProyecto: any) => {
              if (wsResponseProyecto.codResultado == 1) {
                this.existencia = wsResponseProyecto.response[0].existencia;

                const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
                  width: '400px',
                  disableClose: true,
                  data: {
                    message: 'El número de documento no existe, se procederá a registrar a la persona',
                    alerta: true,
                    confirmacion: false
                  }
                });

                dialogRefMessage.afterClosed().subscribe(() => {
                  this.spinner.show();
                  this.trabajadorService.obtenerDataWsReniec(numero).subscribe(
                    (wsResponseReniec: Reniec) => {
                      if (wsResponseReniec.mensaje == 'OK') {
                        this.spinner.hide()
                       
                        

                        this.proyectoForm3.get('apellidoPaterno').setValue(wsResponseReniec.reniec.apellidoMaterno);
                        this.proyectoForm3.get('apellidoMaterno').setValue(wsResponseReniec.reniec.apellidoPaterno);
                        this.proyectoForm3.get('nombres').setValue(wsResponseReniec.reniec.nombres);
                        this.proyectoForm3.get('direccion').setValue(wsResponseReniec.reniec.direccionDomicilio);
                        this.proyectoForm3.get('genero').setValue(+wsResponseReniec.reniec.sexo);
                        this.proyectoForm3.get('departamento').setValue(wsResponseReniec.reniec.ubigeoDptoDomicilio);
                        this.proyectoForm3.get('provincia').setValue(wsResponseReniec.reniec.ubigeoDistDomicilio);
                        this.proyectoForm3.get('distrito').setValue(wsResponseReniec.reniec.ubigeoProvDomicilio);
                        this.proyectoForm3.get('fechaNacimiento').setValue(this.retornaFecha((wsResponseReniec.reniec.fechaNacimiento).substr(0, 4) + "-" + (wsResponseReniec.reniec.fechaNacimiento).substr(4, 2) + "-" + (wsResponseReniec.reniec.fechaNacimiento).substr(6, 2)));
                        this.proyectoForm3.get('edad').setValue(this.ageCalculator2());
                        this.proyectoForm3.get('fechaNacimiento').disable();
                        this.proyectoForm3.get('edad').disable();
                        this.proyectoForm3.get('apellidoPaterno').disable();
                        this.proyectoForm3.get('apellidoMaterno').disable();
                        this.proyectoForm3.get('apellidoPaterno').disable();
                        this.proyectoForm3.get('nombres').disable();
                        this.proyectoForm3.get('genero').disable();
                        this.proyectoForm3.get('departamento').disable();
                        this.proyectoForm3.get('provincia').disable();
                        this.proyectoForm3.get('distrito').disable();
                        this.proyectoForm3.get('direccion').disable();
                        
                      } else if (wsResponseReniec.retorno == '01') {
                        // this.spinner.hide()
                        // const dialogMessage2: MatDialogRef<AlertMessageComponent> = this.dialog.open(AlertMessageComponent);
                        // dialogMessage2.componentInstance.message = 'NO SE HA ENCONTRADO INFORMACIÓN PARA EL NÚMERO DE RUC';
                        // dialogMessage2.afterClosed().subscribe((confirm: boolean) => {
                        //   if (confirm) {

                        //   }
                        // });
                      }
                    }



                  );
                });

              }
            }
          );

        }
        else {
          const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
            width: '400px',
            disableClose: true,
            data: {
              message: 'Ingrese 8 digitos',
              alerta: true,
              confirmacion: false
            }
          });
        }
      }

    } else {
      if (tipoDocumento == 2) {
        if (numero.length == 9) {


        }
        else {
          const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
            width: '400px',
            disableClose: true,
            data: {
              message: 'Ingrese 9 digitos',
              alerta: true,
              confirmacion: false
            }
          });
        }
      } else {
        if (numero.length == 11) {


        }
        else {
          const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
            width: '400px',
            disableClose: true,
            data: {
              message: 'Ingrese 11 digitos',
              alerta: true,
              confirmacion: false
            }
          });
        }

      }
    }





  }

  }
  

  ngOnDestroy() {
    this.authService.cabecera.next({
      titulo: '',
      icono: ''
    });
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