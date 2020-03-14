import { Component, OnInit, ViewChild } from '@angular/core';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { MENSAJES } from 'app/common';
import { PageEvent, MatTableDataSource, MatPaginator, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { WsResponseProyecto } from '../../../../dto/response/Proyecto';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomIconService } from 'app/protected/modules/ups/modules/expediente/services/custom-icon.service';
import { CotizacionService } from '../../../../service/cotizacion.service';
import { WsResponseCotizacion, Cotizacion } from '../../../../dto/response/Cotizacion';
import { filter } from 'rxjs/operators';
import { WsResponseInsumoProveedor, InsumoProveedor } from '../../../../dto/response/InsumoProveedor';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { TrabajadorService } from '../../../../service/trabajador.service';
import { NodeService } from 'app/protected/modules/ups/modules/expediente/services/node.service';
import { ParametroRequest } from 'app/protected/modules/ups/modules/expediente/dto/request/ParametroRequest';
import { CotizacionProveedorRequest } from '../../../../dto/request/CotizacionProveedorRequest';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sunat } from '../../../../dto/response/Sunat';
import { ProveedorRequest } from '../../../../dto/request/ProveedorRequest';
import { CreateUpdateProveedorComponent } from '../../proveedor/crud-proveedor/create-update-proveedor/create-update-proveedor.component';

@Component({
  selector: 'app-cuadro-comparativo',
  templateUrl: './cuadro-comparativo.component.html',
  styleUrls: ['./cuadro-comparativo.component.scss']
})
export class CuadroComparativoComponent implements OnInit {

  @ViewChild('fileInput1')
  fileInput1;

  @ViewChild('fileInput2')
  fileInput2;

  @ViewChild('fileInput3')
  fileInput3;

  file1: File | null = null;
  file2: File | null = null;
  file3: File | null = null;


  formaPagoEfectivo: boolean;

  proveedor: ProveedorRequest = new ProveedorRequest();
  cotizacion: CotizacionProveedorRequest = new CotizacionProveedorRequest();
  existencia: boolean;
  filtrosForm: FormGroup;
  fechaActual = new Date();
  estados: any[];
  pagina = 1;
  cantidad = 2;
  total = 0;

  listRubro: any[];
  listCategoria: any[];
  listTipo: any[];
  public fechaInicio: string = " ";
  public fechaFin: string = " ";

  cols: any[];
  selectedCar3: Car;
  selectedCars3: Car[];

  // Tabla
  dataSource: MatTableDataSource<any>;
  wsResponseProyecto: WsResponseProyecto;
  insumoProveedorResponse: InsumoProveedor[];
  objproyectoResponse: any;
  // Checked
  selectionCotizacion = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dialogRefMessage: MatDialogRef<any>;

  isLoading: boolean;
  columnas: string[] = [];
  mensaje: string;
  disableBuscar: boolean;
  dataTrabajador: any;
  cars: any;
  parametroRequest: any;
  files: TreeNode[];

  lblProveedor01: string;
  lblProveedor02: string;
  lblProveedor03: string;


  estadoSunat: string;
  habidoSunat: string;


  constructor(public dialogRef: MatDialogRef<CuadroComparativoComponent>,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private cotizacionService: CotizacionService,
    private customIconService: CustomIconService,
    private trabajadorService: TrabajadorService,
    private nodeService: NodeService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.customIconService.cargaIcono();
    this.crearFiltrosForm();
    this.generarCabeceraColumnasprov03();
    this.cargarCombos();
    this.cargarInsumoCotizacion();
    //this.obtenerData();

    proveedor : Proveedor;

    let idMovimientoProyecto = 27148;
    this.isLoading = true;
    this.parametroRequest = new ParametroRequest();
    this.parametroRequest.idMovimientoProyecto = idMovimientoProyecto;
    this.nodeService.cronogramaJsonFullChildren(this.parametroRequest).then(files => this.files = files);
    this.lblProveedor01 = "Proveedor 01";
    this.lblProveedor02 = "Proveedor 02";
    this.lblProveedor03 = "Proveedor 03";
  }

  onClickFileInputButton1(): void {
     
    this.fileInput1.nativeElement.click();
  }

  onChangeFileInput1(): void {
    const files: { [key: string]: File } = this.fileInput1.nativeElement.files;
     
    this.file1 = files[0];
  }

  onClickFileInputButton2(): void {
    this.fileInput2.nativeElement.click();
  }

  onChangeFileInput2(): void {
    const files: { [key: string]: File } = this.fileInput2.nativeElement.files;
    this.file2 = files[0];
  }

  onClickFileInputButton3(): void {
    this.fileInput3.nativeElement.click();
  }

  onChangeFileInput3(): void {
    const files: { [key: string]: File } = this.fileInput3.nativeElement.files;
    this.file3= files[0];
  }

  definirColumnas(){
    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' }
    ];
  }

  obtenerData(){
    this.definirColumnas();
    this.cotizacionService.getCarsSmall().then(cars => this.cars = cars);
   
  }

  // **************** BANDEJA ****************
  public cargarTablaInsumoCotizacion(): void {
    if (this.insumoProveedorResponse != null && this.insumoProveedorResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.insumoProveedorResponse);
    }
  }

  public cargarInsumoCotizacion(): void {

    this.dataSource = null;
    this.disableBuscar = true;
    this.insumoProveedorResponse = [];
    this.isLoading = true;

    this.cotizacionService.listarInsumosCotizadosProv03(this.pagina, this.cantidad, null)
      .subscribe(
        (wsResponseInsumoProveedor: WsResponseInsumoProveedor) => {
          if (wsResponseInsumoProveedor.codResultado == 1) {
            this.insumoProveedorResponse = (wsResponseInsumoProveedor.response != null) ? wsResponseInsumoProveedor.response : [];
            this.total = (wsResponseInsumoProveedor.total != 0) ? wsResponseInsumoProveedor.total : 0;
            this.dataSource = new MatTableDataSource(this.insumoProveedorResponse);
            //this.cargarTablaInsumoCotizacion();

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

  public buscarProveedor():void{

    this.dataSource = null;
    this.disableBuscar = true;

    this.isLoading = true;

    let cantidadProveedores = 2;

    let encontro = this.insumoProveedorResponse.find(e => e.cantidaProveedor > 0);

    if(cantidadProveedores === 1){
      this.cotizacionService.listarInsumosCotizadosProv01(this.pagina, this.cantidad,null)
      .subscribe(
        (wsResponseInsumoProveedor: WsResponseInsumoProveedor) => {
          if (wsResponseInsumoProveedor.codResultado == 1) {
            this.insumoProveedorResponse = (wsResponseInsumoProveedor.response != null) ? wsResponseInsumoProveedor.response : [];
            this.total = (wsResponseInsumoProveedor.total != 0) ? wsResponseInsumoProveedor.total : 0;
            this.cargarTablaInsumoCotizacion();
            this.generarCabeceraColumnasprov01();
           
            
           
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
    }else if(cantidadProveedores === 2){
      this.cotizacionService.listarInsumosCotizadosProv02(this.pagina, this.cantidad,null)
      .subscribe(
        (wsResponseInsumoProveedor: WsResponseInsumoProveedor) => {
          if (wsResponseInsumoProveedor.codResultado == 1) {
            this.insumoProveedorResponse = (wsResponseInsumoProveedor.response != null) ? wsResponseInsumoProveedor.response : [];
            this.total = (wsResponseInsumoProveedor.total != 0) ? wsResponseInsumoProveedor.total : 0;
            this.cargarTablaInsumoCotizacion();
            this.generarCabeceraColumnasprov02();
           
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


    }else if(cantidadProveedores === 3){
      this.cotizacionService.listarInsumosCotizadosProv03(this.pagina, this.cantidad,null)
      .subscribe(
        (wsResponseInsumoProveedor: WsResponseInsumoProveedor) => {
          if (wsResponseInsumoProveedor.codResultado == 1) {
            this.insumoProveedorResponse = (wsResponseInsumoProveedor.response != null) ? wsResponseInsumoProveedor.response : [];
            this.total = (wsResponseInsumoProveedor.total != 0) ? wsResponseInsumoProveedor.total : 0;
            this.cargarTablaInsumoCotizacion();
            this.generarCabeceraColumnasprov03();
           
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
   
  } 
  generarCabeceraColumnas(): void {
    this.columnas = [
      'check',
      'recurso',
      'unidad',
      'cantidad'
    ];
  }

  generarCabeceraColumnasprov01(): void {
    this.columnas = [
      'check',
      'recurso',
      'unidad',
      'cantidad',
      'marcaProv01',
      'precioUnitarioProv01',
      'subTotalProv01'
    ];
  }

  generarCabeceraColumnasprov02(): void {
    this.columnas = [
      'check',
      'recurso',
      'unidad',
      'cantidad',
      'marcaProv01',
      'precioUnitarioProv01',
      'subTotalProv01',
      'marcaProv02',
      'precioUnitarioProv02',
      'subTotalProv02'
    ];
  }

  generarCabeceraColumnasprov03(): void {
    this.columnas = [
      'check',
      'recurso',
      'unidad',
      'cantidad',
      'marcaProv01',
      'precioUnitarioProv01',
      'subTotalProv01',
      'marcaProv02',
      'precioUnitarioProv02',
      'subTotalProv02',
      'marcaProv03',
      'precioUnitarioProv03',
      'subTotalProv03'
    ];
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarInsumoCotizacion();
  }

  seleccionarCotizacion(trabajador) {
    this.selectionCotizacion.toggle(trabajador);
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


  cargarCombos() {
     this.cotizacionService.obtenerProveedores().subscribe(data => {
      this.listRubro = data.response;
    });

  }

  public guardarFiltrosBusqueda(): void {
  /*   this.filtrosTrabajadorRequest.apellidoNombre = this.apellidoNombreFrmCtrl.value;
    this.filtrosTrabajadorRequest.genero = this.comboGeneroFrmCtrl.value;
    this.filtrosTrabajadorRequest.categoria = this.comboCategoriaFrmCtrl.value;
    this.filtrosTrabajadorRequest.tipo = this.comboTipoFrmCtrl.value;
    this.filtrosTrabajadorRequest.fechaInicio = this.fechaDesdeFrmCtrl.value !== null ? _moment(this.fechaDesdeFrmCtrl.value).format('DD-MM-YYYY') : null;
    this.filtrosTrabajadorRequest.fechaFin = this.fechaHastaFrmCtrl.value !== null ? _moment(this.fechaHastaFrmCtrl.value).format('DD-MM-YYYY') : null;
    this.filtrosTrabajadorRequest.semana = this.semanaFrmCtrl.value; */
  }

  public filtrarTrabajador($event): void {
    $event.preventDefault();
    this.guardarFiltrosBusqueda();
    this.cargarInsumoCotizacion();
  }

  reiniciar() {
    this.filtrosForm.reset('');
    //this.filtrosTrabajadorRequest = new TrabajadorRequest();
    this.cargarInsumoCotizacion();
  }

  // **************** TRABAJADOR ****************
/*   modalTrabajador(idCodigo: number) {
    if (idCodigo) {
      this.trabajadorService.obtenerTrabajador(idCodigo).subscribe(data => {
        const dialogReg: MatDialogRef<RegistoTrabajadorComponent> = this.dialog.open(RegistoTrabajadorComponent, {
          disableClose: true,
          panelClass: 'dialog-no-padding',
          width: '40%',
          data: {
            dataTrabajador: data.response
          }
        });
        dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {
          this.cargarTrabajador();
        });
      });
    } else {
      const dialogReg: MatDialogRef<RegistoTrabajadorComponent> = this.dialog.open(RegistoTrabajadorComponent, {
        disableClose: true,
        panelClass: 'dialog-no-padding',
        width: '40%',
        data: {}
      });
      dialogReg.afterClosed().subscribe((parametroRequestDialog: any) => {
        this.cargarTrabajador();
      });
    }
  } */

 

  eliminarTrabajador(idCodigo: number, trabajador: string) {
    this.openDialogMensajeConfirm(MENSAJES.TRABAJADOR.ELIMINAR_TRABAJADOR_CONFIRM + trabajador + '?', true);
    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open("Trabajador " + trabajador + " eliminado");
        this.cargarInsumoCotizacion();
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
/*   registrarAsistenciaTareo() {
    if (this.selectionCotizacion.selected.length != 0) {
      let idSelect = "";
      this.selectionCotizacion.selected.forEach(response => {
        idSelect = idSelect + response.idCodigo + ',';
      });
      const dialogReg: MatDialogRef<AsistenciaTareoComponent> = this.dialog.open(AsistenciaTareoComponent, {
        disableClose: true,
        panelClass: 'dialog-no-padding',
        width: '30%',
        data: {
          dataTrabajadorSelected: idSelect.substr(0, idSelect.length - 1)
        }
      });
    }else{
      console.log("seleccionar");
    }
  } */



  guardarInsumoCotizacion(){
    //if(this.selectionCotizacion.selected.length != 0){
      this.openDialogMensajeConfirm(MENSAJES.COTIZACION.GUARDAR_COTIZACION, true);

      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => {
          this.snackBar.open(MENSAJES.COTIZACION.INFO_SUCCESS_GUARDAR);
          this.dialogRef.close();
        });
 /*    }else {
      this.snackBar.open("Seleccionar al menos un insumo ");
    } */

  }


  verCuadroComparativo(){
    this.trabajadorService.generaReporteCuadroComparativo().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
    });
  }


  wsSunat() {
    let numero = this.filtrosForm.get('rucFrmCtrl1').value;
    if (numero && numero.length == 11) {
      this.cotizacion.estado = "";
      this.cotizacion.condicion = "";
      this.trabajadorService.busquedaDataProveedor(numero).subscribe(
        (wsResponseProyecto: any) => {
          if (wsResponseProyecto.codResultado == 1) {
            this.existencia = wsResponseProyecto.response[0].existencia;
            console.log("sunat 1")
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
              console.log("sunat 2")
              
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
                    console.log("sunat 3")
                    console.log(wsResponseSunat.mensaje)
                    this.cotizacion.estado = wsResponseSunat.sunat.estado;
                    this.cotizacion.condicion = ((wsResponseSunat.sunat.esHabido == true) ? "HABIDO" : "NO HABIDO");

                    this.estadoSunat =  wsResponseSunat.sunat.estado;
                    this.habidoSunat = ((wsResponseSunat.sunat.esHabido == true) ? "HABIDO" : "NO HABIDO");
                     
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

  wsSunat2() {
    let numero = this.filtrosForm.get('rucFrmCtrl2').value;
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
                        bloqueaCampo: false
                      }
                    }); 

                    this.cotizacion.estado = wsResponseSunat.sunat.estado;
                    this.cotizacion.condicion = ((wsResponseSunat.sunat.esHabido == true) ? "HABIDO" : "NO HABIDO");
                     
                    this.proveedor.nombreRazonSocial2 = wsResponseSunat.sunat.razonSocial

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

  wsSunat3() {
    let numero = this.filtrosForm.get('rucFrmCtrl3').value;
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
                        bloqueaCampo: false
                      }
                    });

                    this.cotizacion.estado = wsResponseSunat.sunat.estado;
                    this.cotizacion.condicion = ((wsResponseSunat.sunat.esHabido == true) ? "HABIDO" : "NO HABIDO");
                     
                    this.proveedor.nombreRazonSocial3 = wsResponseSunat.sunat.razonSocial

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

  changeFormaPago(value){
    console.log(value);
    if(value == "Efectivo"){
      this.formaPagoEfectivo = true;
    }else {
      this.formaPagoEfectivo = false;
    }
  }

  editarProveedor(){
   
           const dialogReg: MatDialogRef<CreateUpdateProveedorComponent> = this.dialog.open(CreateUpdateProveedorComponent, {
            
            width: '40%',
            
            disableClose: true,
            data: {

            }
          }); 

      
  }
}


export interface Car {
  vin?;
  year?;
  brand?;
  color?;
  price?;
  saleDate?;
}


export interface TreeNode {
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
}


export class Proveedor {
  ruc?: number;
  razonSocial?: string;
  estado?: string;
  condicion?: string;

}
