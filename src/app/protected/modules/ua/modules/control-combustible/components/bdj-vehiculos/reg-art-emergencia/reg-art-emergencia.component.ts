import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DataDialog } from '../../../entities/data-dialog.model';
import { BnsPatrimonioService } from '../../../services/bns-patrimonio.service';
import { WsApiOutResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/WsApiOutResponse';
import { AtcloEmgciaVehiculo } from '../../../dto/response/atclo-emgcia-vehiculo.response';
import { ObjBienPatrimonial } from '../../../dto/request/obj-bien-patrimonial.request';
import { ObjAtcloEmgciaVehiculo } from '../../../dto/request/obj-atclo-emgcia-vehiculo.request';
import { Session } from '@shared/auth/Session';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reg-art-emergencia',
  templateUrl: './reg-art-emergencia.component.html',
  styleUrls: ['./reg-art-emergencia.component.scss']
})
export class RegArtEmergenciaComponent implements OnInit {
  isLoading: boolean = false;

  listaArtEmergencia: AtcloEmgciaVehiculo[] = [];
  artEmergenciaGrp: FormGroup;
  messages = {};
  formErrors = {

  };

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RegArtEmergenciaComponent>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(BnsPatrimonioService) private bnsPatrimonioService: BnsPatrimonioService,
    @Inject(ValidationService) private validationService: ValidationService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    // this.artEmergenciaGrp = this.fb.group({
    //   // observacion: [{ value: 'OBSERVACIONES MUCHOS', disabled: this.user.perfil.id == 3 }, [Validators.required]]
    //   observacion: [{ value: 'OBSERVACIONES MUCHOS', disabled: false }, [Validators.required]]
    // });

    // console.log(this.data);
    this.isLoading = true;
    this.cargarDeclaracion();
  }

  // get getUser() {
  //   return this.user;
  // }

  cargarDeclaracion() {
    let obj = new ObjBienPatrimonial();
    obj.idVehiculo = this.data.objeto.idVehiculo;
    obj.idDenominacion = this.data.objeto.idDenominacion;

    this.bnsPatrimonioService.buscarAtcloEmgciaXVehiculo(obj).subscribe(
      (data: WsApiOutResponse) => {
        if (data.codResultado == 1) {
          this.listaArtEmergencia = data.response;
          console.log(this.listaArtEmergencia);
          this.crearControles();
        } else {
          this.listaArtEmergencia = [];
        }
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.isLoading = false;
      }
    )
  }

  crearControles(): void {
    const frmCtrl = {};
    this.listaArtEmergencia.forEach(el => {
      frmCtrl[`t${el.idAtcloEmgciaDenominacion}`] = new FormControl({ value: (el.flgTiene == 1 ? true : false), disabled: (el.flgTieneAdm == 1 ? false : true) }, [Validators.required]);
      frmCtrl[`op${el.idAtcloEmgciaDenominacion}`] = new FormControl({ value: (el.flgOperativo == 1 ? true : false), disabled: (el.flgTiene == 1 ? false : true) }, [Validators.required]);
      frmCtrl[`v${el.idAtcloEmgciaDenominacion}`] = new FormControl({ value: (el.fecVigencia ? new Date(this.datePipe.transform(el.fecVigencia, 'yyyy/MM/dd')) : ''), disabled: ((el.flgTiene == 1 && el.flgVigenteAdm == 1) ? false : true) }, (el.flgTiene == 1 ? [Validators.required] : []));
      frmCtrl[`o${el.idAtcloEmgciaDenominacion}`] = new FormControl({ value: el.observacion, disabled: false }, []);

      this.messages[`t${el.idAtcloEmgciaDenominacion}`] = { 'required': 'Campo obligatorio' };
      this.messages[`op${el.idAtcloEmgciaDenominacion}`] = { 'required': 'Campo obligatorio' };
      this.messages[`v${el.idAtcloEmgciaDenominacion}`] = { 'required': 'Campo obligatorio' };

      this.formErrors[`t${el.idAtcloEmgciaDenominacion}`] = '';
      this.formErrors[`op${el.idAtcloEmgciaDenominacion}`] = '';
      this.formErrors[`v${el.idAtcloEmgciaDenominacion}`] = '';
    });

    this.artEmergenciaGrp = new FormGroup(frmCtrl);
  }

  guardar(): void {
    if (this.artEmergenciaGrp.valid) {
      let lista: ObjAtcloEmgciaVehiculo[] = [];
      this.listaArtEmergencia.forEach(el => {
        let obj = new ObjAtcloEmgciaVehiculo();
        obj.fidAtcloEmgciaDenominacion = el.idAtcloEmgciaDenominacion;
        obj.fidVhclo = this.data.objeto.idVehiculo;
        obj.flgTiene = this.artEmergenciaGrp.get(`t${el.idAtcloEmgciaDenominacion}`).value == true ? 1 : 0;
        obj.flgOperativo = this.artEmergenciaGrp.get(`op${el.idAtcloEmgciaDenominacion}`).value ? 1 : 0;
        obj.fecVigencia = this.artEmergenciaGrp.get(`v${el.idAtcloEmgciaDenominacion}`).value ? this.artEmergenciaGrp.get(`v${el.idAtcloEmgciaDenominacion}`).value : null;
        obj.flgVigente = 1;
        obj.flgActual = 1;
        obj.txtObservacion = this.artEmergenciaGrp.get(`o${el.idAtcloEmgciaDenominacion}`).value;
        obj.flgActivo = 1;
        obj.fidIdUsuarioReg = +Session.identity.id_usuario;
        obj.fecReg = new Date();
        obj.txtIpmaqReg = '';

        if (el.flgVigenteAdm == 0) {//SI NO TIENE VIGENCIA
          obj.flgVigente = 1;
        } else if (obj.fecVigencia && obj.fecVigencia >= new Date(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))) {
          obj.flgVigente = 1;
        } else {
          obj.flgVigente = 0;
        }
        lista.push(obj);
      });

      console.log(lista);

      this.bnsPatrimonioService.grabarAtcloEmgciaXVehiculo(lista).subscribe(
        (data: WsApiOutResponse) => {
          if (data.codResultado == 1) {
            this._snackBar.open('Se ha registrado correctamente', 'OK', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            this.dialogRef.close(data);
          } else {
            this._snackBar.open('Error al grabar datos', 'OK', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        }, error => {
          console.log(error);
        }
      )

    } else {
      this.validationService.getValidationErrors(this.artEmergenciaGrp, this.messages, this.formErrors, true);
      console.log(this.artEmergenciaGrp);
      console.log(this.formErrors);
    }




    // this.bnsPatrimonioService.grabarAtcloEmgciaXVehiculo(obj).subscribe(
    //   (data: WsApiOutResponse) => {
    //     if (data.codResultado == 1) {

    //     }else{

    //     }
    //   }, error => {
    //     console.log(error);
    //   }
    // );
    // this.dialogRef.close();
  }

  actualizarControles(art: AtcloEmgciaVehiculo): void {
    if (this.artEmergenciaGrp.get('t' + art.idAtcloEmgciaDenominacion).value) {
      //ACTIVAR DEMAS
      this.artEmergenciaGrp.get('op' + art.idAtcloEmgciaDenominacion).enable();
      art.flgVigenteAdm == 1 ? this.artEmergenciaGrp.get('v' + art.idAtcloEmgciaDenominacion).enable() : this.artEmergenciaGrp.get('v' + art.idAtcloEmgciaDenominacion).disable();
    } else {
      this.artEmergenciaGrp.get('op' + art.idAtcloEmgciaDenominacion).disable();
      this.artEmergenciaGrp.get('v' + art.idAtcloEmgciaDenominacion).disable();
    }
  }

}
