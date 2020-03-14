import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorizacionGastoRoutingModule } from './autorizacion-gasto-routing.module';
import { RevisorComponent } from './components/revisor/revisor.component';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@shared/auth/auth.module';
import { LoadingModule } from '@shared/loading/loading.module';
import { ItemComboService } from './service/item-combo.service';
import { ProyectoEjecucionService } from './service/proyecto-ejecucion.service';
import { CustomIconService } from '../expediente/services/custom-icon.service';
import { MatIconRegistry } from '@angular/material';
import { CronogramaValorizadoComponent } from './components/revisor/cronograma-valorizado/cronograma-valorizado.component';
import { TreeTableModule } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import { NodeService } from '../expediente/services/node.service';
import { PartidaComponent } from './components/revisor/cronograma-valorizado/partida/partida.component';
import { CronogramaComponent } from './components/revisor/cronograma-valorizado/visualizar/cronograma/cronograma.component';
import { InsumoComponent } from './components/revisor/cronograma-valorizado/visualizar/insumo/insumo.component';
import { ModificacionComponent } from './components/revisor/cronograma-valorizado/visualizar/modificacion/modificacion.component';
import { TrabajadorComponent } from './components/revisor/trabajador/trabajador.component';
import { TrabajadorService } from './service/trabajador.service';
import { SoloLetrasDirective } from './directives/solo-letras.directive';
import { SoloNumerosDirective } from './directives/solo-numeros.directive';
import { AsistenciaTareoComponent } from './components/revisor/trabajador/asistencia-tareo/asistencia-tareo.component';
import { RegistroAsistenciaTareoComponent } from './components/revisor/trabajador/asistencia-tareo/registro-asistencia-tareo/registro-asistencia-tareo.component';
import { ListaAsistenciaTareoComponent } from './components/revisor/trabajador/asistencia-tareo/lista-asistencia-tareo/lista-asistencia-tareo.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AutorizacionComponent } from './components/revisor/cronograma-valorizado/autorizacion/autorizacion.component';
import { RegistrarComponent } from './components/revisor/cronograma-valorizado/autorizacion/registrar/registrar.component';
import { ProyectoVisualizarComponent } from './components/revisor/proyecto-visualizar/proyecto-visualizar.component';
import { InformeTecnicoComponent } from './components/revisor/cronograma-valorizado/autorizacion/informe-tecnico/informe-tecnico.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CotizacionComponent } from './components/revisor/cotizacion/cotizacion.component';
import { CotizacionService } from './service/cotizacion.service';
import { GenerarSolicitudComponent } from './components/revisor/cotizacion/generar-solicitud/generar-solicitud.component';
import { CreateUpdateTrabajadorComponent } from './components/revisor/trabajador/crud-trabajador/create-update-trabajador/create-update-trabajador.component';
import { ViewTrabajadorComponent } from './components/revisor/trabajador/crud-trabajador/view-trabajador/view-trabajador.component';
import { CalculoPagoComponent } from './components/revisor/trabajador/calculo-pago/calculo-pago.component';
import { ProveedorComponent } from './components/revisor/proveedor/proveedor.component';
import { CreateUpdateProveedorComponent } from './components/revisor/proveedor/crud-proveedor/create-update-proveedor/create-update-proveedor.component';
import { AdjuntarCotizacionComponent } from './components/revisor/proveedor/adjuntar-cotizacion/adjuntar-cotizacion.component';
import { CuadroComparativoComponent } from './components/revisor/cotizacion/cuadro-comparativo/cuadro-comparativo.component';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { PartidaInsumoComponent } from './components/revisor/cronograma-valorizado/partida-insumo/partida-insumo.component';
import { CreateUpdateInsumoComponent } from './components/revisor/cronograma-valorizado/partida-insumo/create-update-insumo/create-update-insumo.component';
import { PartidaListadoComponent } from './components/revisor/cronograma-valorizado/partida/partida-listado/partida-listado.component';
import { RequerimientoComponent } from './components/revisor/requerimiento/requerimiento.component';
import { GenerarRequerimientoComponent } from './components/revisor/requerimiento/generar-requerimiento/generar-requerimiento.component';
import { SupervisorComponent } from './components/supervisor/supervisor.component';
import { CoordinadorRtComponent } from './components/coordinador-rt/coordinador-rt.component';
import { CuadroComparativoDinamicoComponent } from './components/revisor/cotizacion/cuadro-comparativo-dinamico/cuadro-comparativo-dinamico.component';
import { DatosGeneralesComponent } from './components/revisor/datos-generales/datos-generales.component';
import { ResumenConfirmacionComponent } from './components/revisor/requerimiento/generar-requerimiento/resumen-confirmacion/resumen-confirmacion.component';
import { ProyectoService } from '../expediente/services/proyecto.service';
import { CoordinadorCgpComponent } from './components/coordinador-cgp/coordinador-cgp.component';
import { ProyectoVisualizarCgpComponent } from './components/coordinador-cgp/proyecto-visualizar/proyecto-visualizar.component';
import { EjecutarComponent } from './components/carta-fianza/ejecutar/ejecutar.component';
import { RenovarComponent } from './components/carta-fianza/renovar/renovar.component';
import { CartaFianzaComponent } from './components/carta-fianza/carta-fianza.component';
import { FieldsetModule } from 'primeng/fieldset';
import { TabViewModule } from 'primeng/tabview';
import { DetalleDatosGeneralesTamboComponent } from './components/revisor/datos-generales/detalle-datos-generales-tambo/detalle-datos-generales-tambo.component';
import { CarouselTamboComponent } from './components/revisor/datos-generales/carousel-tambo/carousel-tambo.component';
import { CarouselTamboItemElementDirective } from './components/revisor/datos-generales/carousel-tambo/carouset-tambo-item-element.directive';
import { CarouselTamboItemDirective } from './components/revisor/datos-generales/carousel-tambo/carouset-tambo-item.directive';
import { MontojornalComponent } from './components/revisor/trabajador/montojornal/montojornal.component';
import { CreateInsumoComponent } from './components/revisor/cronograma-valorizado/partida-insumo/create-insumo/create-insumo.component';
import { UpdateInsumoComponent } from './components/revisor/cronograma-valorizado/partida-insumo/update-insumo/update-insumo.component';
import { ModalFormaPagoComponent } from './components/revisor/requerimiento/generar-requerimiento/modal-forma-pago/modal-forma-pago.component';
import { ModalCronogramaValorizadoComponent } from './components/revisor/cronograma-valorizado/modal-cronograma-valorizado/modal-cronograma-valorizado.component';
import { ModalRequerimientoComponent } from './components/revisor/requerimiento/modal-requerimiento/modal-requerimiento.component';
import { BandejaPendienteComponent } from './components/revisor/bandeja-pendiente/bandeja-pendiente.component';
import { HistorialAutorizacionComponent } from './components/revisor/requerimiento/historial-autorizacion/historial-autorizacion.component';
import {CarouselModule} from 'primeng/carousel';
import { DataSharedService } from './service/data-shared.service';

@NgModule({
  declarations: [
    RevisorComponent,
    CronogramaValorizadoComponent,
    PartidaComponent,
    CronogramaComponent,
    InsumoComponent,
    ModificacionComponent,
    AutorizacionComponent,
    RegistrarComponent,
    TrabajadorComponent,
    SoloLetrasDirective,
    SoloNumerosDirective,
    AsistenciaTareoComponent,
    RegistroAsistenciaTareoComponent,
    ListaAsistenciaTareoComponent,
    ProyectoVisualizarComponent,
    InformeTecnicoComponent,
    CotizacionComponent,
    GenerarSolicitudComponent,
    CreateUpdateTrabajadorComponent,
    ViewTrabajadorComponent,
    CalculoPagoComponent,
    ProveedorComponent,
    CreateUpdateProveedorComponent,
    AdjuntarCotizacionComponent,
    CuadroComparativoComponent,
    PartidaInsumoComponent,
    CreateUpdateInsumoComponent,
    PartidaListadoComponent,
    RequerimientoComponent,
    GenerarRequerimientoComponent,
    SupervisorComponent,
    CoordinadorRtComponent,
    CuadroComparativoDinamicoComponent,
    DatosGeneralesComponent,
    ResumenConfirmacionComponent,
    CoordinadorCgpComponent,
    ProyectoVisualizarCgpComponent,
    EjecutarComponent,
    RenovarComponent,
    CartaFianzaComponent,
    DetalleDatosGeneralesTamboComponent,
    CarouselTamboComponent,
    CarouselTamboItemElementDirective,
    CarouselTamboItemDirective,
    MontojornalComponent,
    CreateInsumoComponent,
    UpdateInsumoComponent,
    ModalFormaPagoComponent,
    ModalCronogramaValorizadoComponent,
    ModalRequerimientoComponent,
    BandejaPendienteComponent,
    HistorialAutorizacionComponent
  ], 
  entryComponents :[
    PartidaComponent,
    CronogramaComponent,
    InsumoComponent,
    ModificacionComponent,
    RegistrarComponent,
    AsistenciaTareoComponent,
    RegistroAsistenciaTareoComponent,
    ListaAsistenciaTareoComponent,
    InformeTecnicoComponent,
    GenerarSolicitudComponent,
    CreateUpdateTrabajadorComponent,
    ViewTrabajadorComponent,
    CalculoPagoComponent,
    CreateUpdateProveedorComponent,
    AdjuntarCotizacionComponent,
    CuadroComparativoComponent,
    PartidaInsumoComponent,
    CreateUpdateInsumoComponent,
    PartidaListadoComponent,
    GenerarRequerimientoComponent,
    CuadroComparativoDinamicoComponent,
    ResumenConfirmacionComponent,
    ProyectoVisualizarComponent,
    ProyectoVisualizarCgpComponent,
    EjecutarComponent,
    RenovarComponent,
    DatosGeneralesComponent,
    DetalleDatosGeneralesTamboComponent,
    CarouselTamboComponent,
    MontojornalComponent,
    CreateInsumoComponent,
    UpdateInsumoComponent,
    ModalFormaPagoComponent,
    ModalCronogramaValorizadoComponent,
    ModalRequerimientoComponent,
    HistorialAutorizacionComponent
  ],
  providers: [
    ItemComboService,
    ProyectoEjecucionService,
    MatIconRegistry,
    CustomIconService,
    NodeService,
    TrabajadorService,
    CotizacionService,
    ProyectoService,
    DataSharedService
  ],
  imports: [
    CommonModule,
    AutorizacionGastoRoutingModule,
    SharedModule,
    TreeTableModule,
    TableModule,
    CKEditorModule,
    AuthModule.forRoot(),
    LoadingModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgxSpinnerModule,
    FieldsetModule,
    TabViewModule,
    CarouselModule
  ]
})
export class AutorizacionGastoModule { }
