import { Component, OnInit } from '@angular/core';
import { DebugRenderer2 } from '@angular/core/src/view/services';
import { CotizacionService } from '../../../../service/cotizacion.service';
import { MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { ProveedorRequest } from '../../../../dto/request/ProveedorRequest';
import { CotizacionProveedorRequest } from '../../../../dto/request/CotizacionProveedorRequest';
import { TrabajadorService } from '../../../../service/trabajador.service';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateUpdateProveedorComponent } from '../../proveedor/crud-proveedor/create-update-proveedor/create-update-proveedor.component';
import { Sunat } from '../../../../dto/response/Sunat';

@Component({
  selector: 'app-cuadro-comparativo-dinamico',
  templateUrl: './cuadro-comparativo-dinamico.component.html',
  styleUrls: ['./cuadro-comparativo-dinamico.component.scss']
})
export class CuadroComparativoDinamicoComponent implements OnInit {

  insumoProveedorResponse: any[];
  data: MatTableDataSource<any>;
  filtrosForm: FormGroup;
  proveedor: ProveedorRequest = new ProveedorRequest();
  
  displayedColumns: string[] = ['recurso', 'unidad', 'cantidad'];
  //displayedColumns: string[] = ['', '', ''];

  displayedColumnsHeader: string[] = ['yy'];
  
  columnsToDisplay: string[] = this.displayedColumns.slice();

  columnsToDisplayHeader: string[] = this.displayedColumnsHeader.slice();
  //data: PeriodicElement[] = ELEMENT_DATA;
  total: any;
 
  addColumn() {
  
    //const randomColumn = Math.floor(Math.random() * this.displayedColumns.length);

   // this.columnsToDisplay.push(this.displayedColumns[randomColumn]);
   /* this.displayedColumns = ['recurso', 'unidad', 'cantidad','marca','precio','total']; */
   this.displayedColumns = ['recurso', 'unidad', 'cantidad','marca','precio','total'];
   this.displayedColumnsHeader = ['yy','p1'];

   this.columnsToDisplay.push('marca','precio','total');
   this.columnsToDisplayHeader.push('p1');

  }

  removeColumn() {
    if (this.columnsToDisplay.length) {
    
      //this.columnsToDisplay.pop();
      let valor = this.displayedColumns.find(x => x == 'cantidad');
      console.log(valor);
      if(this.columnsToDisplay.length>3){
        this.columnsToDisplay.splice(this.columnsToDisplay.length - 3,3)
      }
     
    }
  }

  shuffle() {
    let currentIndex = this.columnsToDisplay.length;
    while (0 !== currentIndex) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap
      let temp = this.columnsToDisplay[currentIndex];
      this.columnsToDisplay[currentIndex] = this.columnsToDisplay[randomIndex];
      this.columnsToDisplay[randomIndex] = temp;
    }
  }

  constructor(private cotizacionService: CotizacionService,
    private trabajadorService: TrabajadorService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService) { }



  ngOnInit() {
    this.cargarInsumoCotizacion();
    proveedor : Proveedor;
    this.crearFiltrosForm();
  }

  
  public cargarInsumoCotizacion(): void {

    this.data = null;
    this.insumoProveedorResponse = [];

    this.cotizacionService.listarInsumosDinamico(0, 0,null)
      .subscribe(
        (wsResponseInsumoProveedor: any) => {
          if (wsResponseInsumoProveedor.codResultado == 1) {
            this.insumoProveedorResponse = (wsResponseInsumoProveedor.response != null) ? wsResponseInsumoProveedor.response : [];
            this.total = (wsResponseInsumoProveedor.total != 0) ? wsResponseInsumoProveedor.total : 0;
            this.cargarTablaInsumoCotizacion();
          } 
        },
        error => {
          console.error(error);
        }
      );  

     // this.buscarProveedor();
  }

  public cargarTablaInsumoCotizacion(): void {
    if (this.insumoProveedorResponse != null && this.insumoProveedorResponse.length > 0) {
      this.data = new MatTableDataSource(this.insumoProveedorResponse);
    }
  }


   // ****************  FILTROS  ****************
   crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
      rucFrmCtrl1: new FormControl(null),
      rucFrmCtrl2: new FormControl(null),
      rucFrmCtrl3: new FormControl(null),
      comboRubroFrmCtrl: new FormControl(null),
      fechaCotizacionFrmCtrl: new FormControl(null),
      plazoEntregaFrmCtrl: new FormControl(null),
      formaPagoFrmCtrl: new FormControl(null),
      uitFrmCtrl: new FormControl(null),
      sustentoFrmCtrl: new FormControl(null),
      cuadrillaFrmCtrl: new FormControl(null)
  }) 
  }
  get rucFrmCtrl1() { return this.filtrosForm.get('rucFrmCtrl1'); }
  get rucFrmCtrl2() { return this.filtrosForm.get('rucFrmCtrl2'); }
  get rucFrmCtrl3() { return this.filtrosForm.get('rucFrmCtrl3'); }
  get fechaCotizacionFrmCtrl() { return this.filtrosForm.get('fechaCotizacionFrmCtrl'); }
  get plazoEntregaFrmCtrl() { return this.filtrosForm.get('plazoEntregaFrmCtrl'); }
  get formaPagoFrmCtrl() { return this.filtrosForm.get('formaPagoFrmCtrl'); }
  get uitFrmCtrl() { return this.filtrosForm.get('uitFrmCtrl'); }

  cotizacion: CotizacionProveedorRequest = new CotizacionProveedorRequest();
  existencia: boolean;
  dialogRefMessage: MatDialogRef<any>;
  wsSunat() {
    let numero = this.filtrosForm.get('rucFrmCtrl1').value;
    if (numero && numero.length == 11) {
      this.cotizacion.estado = "";
      this.cotizacion.condicion = "";
      this.trabajadorService.busquedaDataProveedor(numero).subscribe(
        (wsResponseProyecto: any) => {
          if (wsResponseProyecto.codResultado == 1) {
            this.existencia = wsResponseProyecto.response[0].existencia;

            this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
              width: '400px',
              disableClose: true,
              data: {
                message: 'El número de RUC no existe, se procederá a registrar al proveedor',
                alerta: true,
                confirmacion: false
              }
            });
            
            this.dialogRefMessage.afterClosed().subscribe(() => {
              this.spinner.show();
              this.trabajadorService.obtenerDataWsSunat(numero).subscribe(
                (wsResponseSunat: Sunat) => {
                  if (wsResponseSunat.mensaje == 'OK') {
                    this.spinner.hide()
                     const dialogReg: MatDialogRef<CreateUpdateProveedorComponent> = this.dialog.open(CreateUpdateProveedorComponent, {
                      panelClass: 'dialog-no-padding',
                      width: '40%',
                      height: '85%',
                      disableClose: true,
                      data: {
                        dataProveedor: wsResponseSunat.sunat,
                        bloqueaCampo: false,
                        flag: 1
                      }
                    }); 

                    this.cotizacion.estado = wsResponseSunat.sunat.estado;
                    this.cotizacion.condicion = ((wsResponseSunat.sunat.esHabido == true) ? "HABIDO" : "NO HABIDO");
                     
                    this.proveedor.nombreRazonSocial = wsResponseSunat.sunat.razonSocial

                  } else if (wsResponseSunat.retorno == '01') {
                    this.spinner.hide()
                    // const dialogMessage2: MatDialogRef<AlertMessageComponent> = this.dialog.open(AlertMessageComponent);
                    // dialogMessage2.componentInstance.message = 'NO SE HA ENCONTRADO INFORMACIÓN PARA EL NÚMERO DE RUC';
                    // dialogMessage2.afterClosed().subscribe((confirm: boolean) => {
                    //   if (confirm) {

                    //   }
                    // });
                  }
                },
                error => {
                  console.error(error);
                  this.spinner.hide()
                }
              );

            });
          }
        },
        error => {
          // alert("Verificar el ws Sunat");
          console.error(error);

        }
      );
    }
  }



}

export class Proveedor {
  ruc?: number;
  razonSocial?: string;
  estado?: string;
  condicion?: string;

}

