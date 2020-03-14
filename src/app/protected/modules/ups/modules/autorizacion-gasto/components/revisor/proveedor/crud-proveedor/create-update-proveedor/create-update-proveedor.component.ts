import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { TrabajadorService } from '../../../../../service/trabajador.service';
import { ProveedorRequest } from '../../../../../dto/request/ProveedorRequest';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { MENSAJES } from 'app/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-update-proveedor',
  templateUrl: './create-update-proveedor.component.html',
  styleUrls: ['./create-update-proveedor.component.scss']
})
export class CreateUpdateProveedorComponent implements OnInit {

  proyectoForm: FormGroup;

  listTipoPersona: any[];
  listTipoDocumento: any[];
  listRubro: any[];
  listDepartamento: any[];
  listProvincia: any[];
  listDistrito: any[];
  listEstado: any[];

  enabledProvincia: boolean = true;
  enabledDistrito: boolean = true;

  proveedor: ProveedorRequest = new ProveedorRequest();
  bloqueaCampo: boolean = this.datos.bloqueaCampo;

  dialogRefMessage: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateUpdateProveedorComponent>,
    private formBuilder: FormBuilder,
    private trabajadorService: TrabajadorService,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataProveedor
  ) {
    this.formulario();
  }

  ngOnInit() {
    this.cargarCombos();
    if (this.datos.dataProveedor) {
      this.proveedor.numeroDocumento = this.datos.dataProveedor.numeroRUC;
      this.proveedor.nombreRazonSocial = this.datos.dataProveedor.razonSocial;
      this.proveedor.idTipoProveedor = +this.datos.dataProveedor.codigoTipoPersona;
      this.proveedor.idTipoDocumento = ((this.datos.dataProveedor.tipoPersona == "PERSONA NATURAL") ? 1 : 3);
      this.proveedor.estado = this.datos.dataProveedor.estado;
      this.proveedor.condicion = ((this.datos.dataProveedor.esHabido == true) ? "HABIDO" : "NO HABIDO");
      this.buscarProvincia(this.proveedor.idDepartamento);
      this.buscarDistrito(this.proveedor.idProvincia);
    } else {
      this.proveedor = new ProveedorRequest();
      this.proveedor.idEstado = 1;
    }
  }

  cargarCombos() {
    this.trabajadorService.obtenerTipoPersona().subscribe(data => {
      this.listTipoPersona = data.response
    });
    this.trabajadorService.obtenerTipoDocumento().subscribe(data => {
      this.listTipoDocumento = data.response
    });
    this.trabajadorService.obtenerRubro().subscribe(data => {
      this.listRubro = data.response;
    });
    this.trabajadorService.obtenerListadoDepartamento().subscribe(data => {
      this.listDepartamento = data.response
    });
    this.trabajadorService.obtenerEstado().subscribe(data => {
      this.listEstado = data.response
    });
  }

  buscarProvincia(idDepartamento: number) {
    this.trabajadorService.obtenerListadoProvincia(idDepartamento).subscribe(data => {
      this.enabledProvincia = false;
      this.enabledDistrito = true;
      this.listProvincia = data.response
      this.listDistrito = null;
    });
  }

  buscarDistrito(idProvincia: number) {
    this.trabajadorService.obtenerListadoDistrito(idProvincia).subscribe(data => {
      this.enabledDistrito = false;
      this.listDistrito = data.response
    });
  }

  formulario() {
    this.proyectoForm = this.formBuilder.group({
      tipoProveedor: [''],
      tipoDocumento: [''],
      numeroDocumento: [''],
      nombreRazonSocial: [''],
     /*  idTipoRubro: [''], */
      telefono: [''],
      correoElectronico: [''],
      domicilioFiscal: [''],
      estado: [''],
      condicion: [''],
      actividadEconomica: [''],
      comprobantePago: [''],

      idDepartamento: [''],
      idProvincia: [''],
      idDistrito: [''],
      // idEstado: [''],
    });
  }

  public openDialogMensajeConfirm(message: string, confirmacion: boolean): void {

    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }
  
  //------------------------------------------
  guardarProveedor() {
    console.log(this.proveedor);
    if (this.datos.flag == 2) {
      console.log("actualiza");
      this.openDialogMensajeConfirm(MENSAJES.PROVEEDOR.MODIFICAR_PROVEEDOR , true);

      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => {
          this.dialogRef.close(true);
          this.snackBar.open("Los datos han sido modificados correctamente");
          // viewInsumo.item = this.indexInsumo--;
         /*  this.cotizacionResponse.splice(this.cotizacionResponse.indexOf(viewCotizacion), 1);
          this.dataSource = new MatTableDataSource(this.cotizacionResponse);
          this.dataSource.paginator = this.paginator; */
        });
    } else {
      console.log("inserta");
      this.openDialogMensajeConfirm(MENSAJES.PROVEEDOR.GUARDAR_PROVEEDOR , true);

      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => {
          this.dialogRef.close(true);
          this.snackBar.open("El proveedor ha sido registrado correctamente");
          // viewInsumo.item = this.indexInsumo--;
         /*  this.cotizacionResponse.splice(this.cotizacionResponse.indexOf(viewCotizacion), 1);
          this.dataSource = new MatTableDataSource(this.cotizacionResponse);
          this.dataSource.paginator = this.paginator; */
        });
    }
    //this.dialogRef.close();
  }

}

interface DataProveedor {
  dataProveedor?: any;
  bloqueaCampo?: boolean;
  flag?: any;
}
