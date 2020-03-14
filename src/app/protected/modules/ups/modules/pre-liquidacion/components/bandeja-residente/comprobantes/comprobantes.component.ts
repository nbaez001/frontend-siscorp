import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/protected/services/auth.service';
import { MENSAJES } from 'app/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ItemComboService } from '../../../services/item-combo.service';
import { ItemBean } from '../../../dto/response/ItemBean';
import { MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { Comprobante } from '../../../dto/response/Comprobante';
import { GestionPreliquidacionService } from '../../../services/gestion-preliquidacion.services';
import { GenerarRequerimientoComponent } from '../../../../autorizacion-gasto/components/revisor/requerimiento/generar-requerimiento/generar-requerimiento.component';
import { AgregarComprobanteComponent } from './agregar-comprobante/agregar-comprobante.component';
import { filter } from 'rxjs/operators';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-comprobantes',
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.scss']
})
export class ComprobantesComponent implements OnInit {

  filtrosForm: FormGroup;
  estados: any[];
  rubros:any[];
  tipos:any[];
  dataItemEstado: ItemBean;
  dataItemRubro: ItemBean;
  dataItemTipo: ItemBean;
  
  columnas: string[] = [];
  dataSource: Comprobante[] = []; //MatTableDataSource<Comprobante>;// Tabla ROCA
  pagina = 1;
  cantidad = 10;
  total = 0;
  
  constructor( 
    private authService: AuthService,
    private itemComboService: ItemComboService,
    private gestionPreliquidacionService: GestionPreliquidacionService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.tituloBandejaProyecto();
    this.crearFiltrosForm();
    this.cargarCombosFiltro() ;
    this.cargarBandeja();
  }

  tituloBandejaProyecto() {
    this.authService.cabecera.next({
      titulo: MENSAJES.PRE_LIQUIDACION.TITULO_BANDEJA_COMPROBANTE,
      icono: ''
    })
  }

  crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
     
      rubroFrmCtrl: new FormControl(null),
      tipoFrmCtrl: new FormControl(null),
      nroDocumentoFrmCtrl: new FormControl("78"),
      fechaRegDesdeFrmCtrl: new FormControl(null),
      fechaRegHastaFrmCtrl: new FormControl(null),
      estadoFrmCtrl: new FormControl(null)
    });
  }

  cargarCombosFiltro() {
      this.itemComboService.ObtenerRubroProyecto().subscribe(dataItem => {
        this.dataItemRubro = Object.assign({
          rubros: dataItem.response
        });
      });

      this.itemComboService.ObtenerTipoProyecto().subscribe(dataItem => {
        this.dataItemTipo = Object.assign({
          tipos: dataItem.response
        });
      });

      this.itemComboService.ObtenerEstadoComprobante().subscribe(dataItem => {
        this.dataItemEstado = Object.assign({
          estados: dataItem.response
        });
      });
  } 

  cargarBandeja() {
   console.log("cargado bandeja");
    this.columnas = [
      'id','rubro','tipoDocumento',
      'nroDocumento','fechaDocumento','proveedor','rucDni','descripcion','importe','estado','acciones']; 

   //const filtros = Object.entries(this.formulario.value).map(([i, v]) => `${i}=${v}`).join('&');
    this.gestionPreliquidacionService.comprobantesPreliquidacionFiltros(
      this.pagina,
      this.cantidad,
      null
    ).subscribe(({response, total}) => {
      const filas = [];
      console.log(total);
       response.forEach(p => filas.push(  p    ));
     this.dataSource = filas;
      this.total = total;
    });
  }


  agregarComprobante() {
      const dialogReg: MatDialogRef<AgregarComprobanteComponent> = this.dialog.open(AgregarComprobanteComponent, {
        panelClass: 'dialog-no-padding',
        width: '1200px',
       height:'800px',
        // maxWidth: '91%',
        // maxHeight: '91%',
        disableClose: true,
        data: {flag: 0}
    });
    // dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {
    //   this.cargarBandeja();
    // }); 

    dialogReg.afterClosed().pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.cargarBandeja();
        dialogReg.close(true);
        //this.snackBar.open("El insumo ha sido registrado correctamente");
      });

 }

 generarManifiestoGasto(){
   /*
  this.gestionPreliquidacionService.generaReporteManifiestoGasto().subscribe(response => {
    let pdf = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(pdf);
    window.open(url, "_blank");
  
  });*/

  this.gestionPreliquidacionService.generaReporteManifiestoGasto().subscribe(response => {
    const dialogReg:MatDialogRef<PdfViewerComponent>=this.dialog.open(PdfViewerComponent,{
      disableClose:true,
      panelClass:'dialog-no-padding',
      width:'90%',
      data:{dataBlob:response}
    });
    
    dialogReg.afterClosed().subscribe(result => {
      this.gestionPreliquidacionService.generaReporteResumenEstadoFinanciero().subscribe(response => {
          const dialogReg:MatDialogRef<PdfViewerComponent>=this.dialog.open(PdfViewerComponent,{
            disableClose:true,
            panelClass:'dialog-no-padding',
            width:'90%',
            data:{dataBlob:response}
          });
        });
      
    });
  });
  
  // this.gestionPreliquidacionService.generaReporteResumenEstadoFinanciero().subscribe(response => {
  //   const dialogReg:MatDialogRef<PdfViewerComponent>=this.dialog.open(PdfViewerComponent,{
  //     disableClose:true,
  //     panelClass:'dialog-no-padding',
  //     width:'90%',
  //     data:{dataBlob:response}
  //   });
  // });

  

 }

 buscar(): void{
  console.log("buscar");
 }

 reiniciar(): void{
   console.log("reiniciar");
  }
 

 


}

