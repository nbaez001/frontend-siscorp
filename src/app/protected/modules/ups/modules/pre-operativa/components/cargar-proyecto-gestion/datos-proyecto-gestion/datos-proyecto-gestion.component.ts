import { Component, OnInit, Inject } from '@angular/core';
import { MENSAJES } from 'app/common';
import { AuthService } from 'app/protected/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ItemBean } from '../../../dto/Request/ItemBean';
import { ItemComboServicio } from '../../../services/item-combo.service';
import { ProyectoService } from '../../../services/proyecto.service';
import { datosProyecto } from '../../../dto/Request/datosProyecto';
import { ConsultaNombresUbigeoRequest } from '../../../dto/Request/ConsultaNombresUbigeoRequest';
import { WsApiOutResponse } from '../../../../expediente/dto/response/WsApiOutResponse';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { DataDialog } from 'app/protected/modules/ua/modules/control-combustible/entities/data-dialog.model';
import { WsBandejaProyectoGestionResponse, BandejaProyectoGestionResponse } from '../../../dto/Response/BandejaProyectoGestionResponse';

@Component({
  selector: 'app-datos-proyecto-gestion',
  templateUrl: './datos-proyecto-gestion.component.html',
  styleUrls: ['./datos-proyecto-gestion.component.scss']
})
export class DatosProyectoGestionComponent implements OnInit {
  proyectoForm: FormGroup;
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<DatosProyectoGestionComponent>,
    private itemComboService: ItemComboServicio,
    private proyectoService: ProyectoService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog
  ) {
    this.formulario();
  }

  ngOnInit() {
    this.cargarDataCRP();
    this.cargarDataCGP();
    this.cargarProyecto();
    // if (this.data.objeto) {
    //   this.trabajador = this.datos.dataTrabajador[1];
    //   this.buscarProvincia(this.trabajador.idDepartamento);
    //   this.buscarDistrito(this.trabajador.idProvincia);
    //   this.buscarDistrito(this.trabajador.idDistrito);
    //   this.proyectoForm.get('fechaNacimiento').setValue(this.retornaFecha(this.trabajador.fechaNacimiento));
    //   this.proyectoForm.get('fechaInicioContrato').setValue(this.retornaFecha(this.trabajador.fechaInicioContrato));
    //   this.proyectoForm.get('fechaTerminoContrato').setValue(this.retornaFecha(this.trabajador.fechaTerminoContrato));
    // } else {
    //   this.proyecto = new datosProyecto();
    // }
  }

  datosProyecto: any[];
  crpS: any[];
  cgpS: any[];
  dataItemCRP: ItemBean;
  dataItemCGP: ItemBean;
  dataItemTipoDocumento: ItemBean;
  proyecto: datosProyecto = new datosProyecto();
  wsResponseProyecto: BandejaProyectoGestionResponse;
  proyectoResponse: BandejaProyectoGestionResponse[];

  cargarProyecto() {
    console.log(this.data)
    if (this.data.objeto) {
      // this.proyectoService.editarProyectoGestion(this.data.objeto).subscribe(
      //   (wsResponseProyecto: WsBandejaProyectoGestionResponse) => {
      console.log("DDD");
      // console.log(wsResponseProyecto)
      // if (wsResponseProyecto.codResultado == 1) {
      // this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
      // this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;

      this.proyectoForm.get('nombreProyecto').setValue(this.data.objeto.nombreProyecto);
      this.proyectoForm.get('nombreTambo').setValue(this.data.objeto.nombreTambo);
      this.proyectoForm.get('snip').setValue(this.data.objeto.snip);
      this.proyectoForm.get('montoViable').setValue(this.data.objeto.montoViable);
      this.proyectoForm.get('crp').setValue(+this.data.objeto.codCgp);
      this.proyectoForm.get('cgp').setValue(+this.data.objeto.codCrp);
      this.proyectoForm.get('longitud').setValue(this.data.objeto.longitud);
      this.proyectoForm.get('latitud').setValue(this.data.objeto.latitud);
      this.proyectoForm.get('altitud').setValue(this.data.objeto.altitud);

      // this.proyectoForm.get('cgp').value;
      // } else {
      //   // this.mensaje = MENSAJES.ERROR_NOFUNCION;
      //   console.log("fff");
      // }
      // this.isLoading = false;
      // this.disableBuscar = false;
      // },
      // error => {

      //   console.error(error);

      // }

    }
    else {
      console.log("hola")
    }

  }




  formulario() {
    this.proyectoForm = this.formBuilder.group({
      nombreProyecto: [{ value: '', disabled: false }, [Validators.required]],
      nombreTambo: [{ value: '', disabled: false }, [Validators.required]],
      snip: [{ value: '', disabled: false }, [Validators.required]],
      motivoPriorizacion: [{ value: '', disabled: false }, [Validators.required]],
      nroCPBeneficiados: [{ value: '', disabled: false }, [Validators.required]],
      adjuntarCP: [{ value: '', disabled: false }, [Validators.required]],
      nroPoblacionBeneficiada: [{ value: '', disabled: false }, [Validators.required]],
      montoViable: [{ value: '', disabled: false }, [Validators.required]],
      ubigeo: [{ value: '', disabled: false }, [Validators.required]],
      lugar: [{ value: '', disabled: true }, [Validators.required]],
      longitud: [{ value: '', disabled: false }, [Validators.required]],
      latitud: [{ value: '', disabled: false }, [Validators.required]],
      altitud: [{ value: '', disabled: false }, [Validators.required]],
      crp: [{ value: '', disabled: false }, [Validators.required]],
      cgp: [{ value: '', disabled: false }, [Validators.required]],
    });
  }



  ngOnDestroy() {

  }



  ///////CARGAR COMBO CRP ///
  cargarDataCRP() {

    this.itemComboService.obtenerCRP().subscribe(dataItem => {
      this.dataItemCRP = Object.assign({
        crpS: dataItem.response

      });

    });
    console.log(this.crpS)
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


  registrarProyecto() {
    if (this.proyectoForm.valid) {
      let proyecto = new datosProyecto();
      console.log(this.proyectoForm)
      proyecto.nombreProyecto = this.proyectoForm.get('nombreProyecto').value;
      proyecto.tambo = this.proyectoForm.get('nombreTambo').value;
      proyecto.ubigeo = this.proyectoForm.get('ubigeo').value;
      proyecto.motivoPriorizacion = this.proyectoForm.get('motivoPriorizacion').value;
      proyecto.nroCPBeneficiados = this.proyectoForm.get('nroCPBeneficiados').value;
      proyecto.adjuntarCP = this.proyectoForm.get('adjuntarCP').value;
      proyecto.nroPoblacionBeneficiada = this.proyectoForm.get('nroPoblacionBeneficiada').value;
      proyecto.lugar = this.proyectoForm.get('lugar').value;
      proyecto.longitud = this.proyectoForm.get('longitud').value;
      proyecto.latitud = this.proyectoForm.get('latitud').value;
      proyecto.altitud = this.proyectoForm.get('altitud').value;
      proyecto.snip = this.proyectoForm.get('snip').value;
      proyecto.montoViable = this.proyectoForm.get('montoViable').value;
      proyecto.crp = this.proyectoForm.get('crp').value;
      proyecto.cgp = this.proyectoForm.get('cgp').value;
      
      

      if (this.data.objeto.idProyecto) {
        console.log("AAAa")
        proyecto.idCP = "31";
        proyecto.etapaProceso= "2";
        proyecto.idProyecto= this.data.objeto.idProyecto;
        console.log(proyecto)
        console.log(proyecto);
        this.proyectoService.actualizarProyectoGestion(proyecto).subscribe(
          () => {
            this.dialogRef.close(true);
            this.snackBar.open("Proyecto guardado");
          }

        );
      } else {
        console.log("bbb")



        console.log(proyecto);
        proyecto.etapaProceso= "2";
        this.proyectoService.cargarDatosProyecto(proyecto).subscribe(
          () => {
            this.dialogRef.close(true);
            this.snackBar.open("Proyecto guardado");
          }

        );
      }

    } else {
      const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
        width: '400px',
        disableClose: true,
        data: {
          message: 'Ingrese los campos obligatorios',
          alerta: true,
          confirmacion: false
        }
      });
    }

  }


  enviarProyecto(){
    if (this.proyectoForm.valid) {
      let proyecto = new datosProyecto();
      console.log(this.proyectoForm)
      proyecto.nombreProyecto = this.proyectoForm.get('nombreProyecto').value;
      proyecto.tambo = this.proyectoForm.get('nombreTambo').value;
      proyecto.ubigeo = this.proyectoForm.get('ubigeo').value;
      proyecto.motivoPriorizacion = this.proyectoForm.get('motivoPriorizacion').value;
      proyecto.nroCPBeneficiados = this.proyectoForm.get('nroCPBeneficiados').value;
      proyecto.adjuntarCP = this.proyectoForm.get('adjuntarCP').value;
      proyecto.nroPoblacionBeneficiada = this.proyectoForm.get('nroPoblacionBeneficiada').value;
      proyecto.lugar = this.proyectoForm.get('lugar').value;
      proyecto.longitud = this.proyectoForm.get('longitud').value;
      proyecto.latitud = this.proyectoForm.get('latitud').value;
      proyecto.altitud = this.proyectoForm.get('altitud').value;
      proyecto.snip = this.proyectoForm.get('snip').value;
      proyecto.montoViable = this.proyectoForm.get('montoViable').value;
      proyecto.crp = this.proyectoForm.get('crp').value;
      proyecto.cgp = this.proyectoForm.get('cgp').value;
      
      

      if (this.data.objeto.idProyecto) {
        console.log("AAAa")
        proyecto.idCP = "31";
        proyecto.idProyecto= this.data.objeto.idProyecto;
        proyecto.etapaProceso= "3";
        this.proyectoService.actualizarProyectoGestion(proyecto).subscribe(
          () => {
            this.dialogRef.close(true);
            this.snackBar.open("Proyecto enviado");
          }

        );
      } else {
        console.log("bbb")
        proyecto.etapaProceso= "3";
        this.proyectoService.cargarDatosProyecto(proyecto).subscribe(
          () => {
            this.dialogRef.close(true);
            this.snackBar.open("Proyecto enviado");
          }

        );
      }

    } else {
      const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
        width: '400px',
        disableClose: true,
        data: {
          message: 'Ingrese los campos obligatorios',
          alerta: true,
          confirmacion: false
        }
      });
    }

  }


  guardarFormulario() {
    const proyecto = new datosProyecto();
    proyecto.nombreProyecto = this.proyectoForm.get('nombreProyecto').value;
    proyecto.tambo = this.proyectoForm.get('nombreTambo').value;
    proyecto.ubigeo = this.proyectoForm.get('ubigeo').value;
    proyecto.lugar = this.proyectoForm.get('lugar').value;
    proyecto.snip = this.proyectoForm.get('snip').value;
    proyecto.montoViable = this.proyectoForm.get('montoviable').value;
    proyecto.crp = this.proyectoForm.get('crp').value;
    proyecto.cgp = this.proyectoForm.get('cgp').value;


  }


  /////////////GENERAR DEPART- PROV- DISTR ////////////
  generarLugar() {

    let req = new ConsultaNombresUbigeoRequest();
    req.ubigeo = this.proyectoForm.get('ubigeo').value;
    if (req.ubigeo.length == 6) {
      console.log(req);
      this.itemComboService.mostrarUbigeo(req).subscribe(
        (data: WsApiOutResponse) => {

          this.proyectoForm.get('lugar').setValue(data.response[0].descripcion);

          // this.proyectoForm.get('ubigeo').setValue(this.listTipoDocumento[0].idCodigo);
          console.log(data);

        },
        error => {
          console.log(error);
        });
    }

  }
  ////////////////////////////////////////////////////



}
