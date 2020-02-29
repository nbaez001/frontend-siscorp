import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreLiquidacionRoutingModule } from './pre-liquidacion-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@shared/auth/auth.module';
import { LoadingModule } from '@shared/loading/loading.module';
import { BandejaResidenteComponent } from './components/bandeja-residente/bandeja-residente.component';
import { GestionPreliquidacionService } from './services/gestion-preliquidacion.services';
import { ItemComboService } from './services/item-combo.service';
import { ComprobantesComponent } from './components/bandeja-residente/comprobantes/comprobantes.component';
import { AgregarComprobanteComponent } from './components/bandeja-residente/comprobantes/agregar-comprobante/agregar-comprobante.component';
import {FieldsetModule} from 'primeng/fieldset';
import {TabViewModule} from 'primeng/tabview';
import { InformePreliquidacionComponent } from './components/bandeja-residente/informe-preliquidacion/informe-preliquidacion.component';
import { AgregarDocumentoComponent } from './components/bandeja-residente/informe-preliquidacion/agregar-documento/agregar-documento.component';
import { TrabajadorService } from '../autorizacion-gasto/service/trabajador.service';
import { ValorizacionAvanceComponent } from './components/bandeja-residente/valorizacion-avance/valorizacion-avance.component';
import { ResumenMovimientoAlmacenComponent } from './components/bandeja-residente/resumen-movimiento-almacen/resumen-movimiento-almacen.component';
import { RegistrarComprobanteComponent } from './components/bandeja-residente/registrar-comprobante/registrar-comprobante.component';

@NgModule({
  declarations: [
    BandejaResidenteComponent,
    ComprobantesComponent,
    AgregarComprobanteComponent,
    InformePreliquidacionComponent,
    AgregarDocumentoComponent,
    ValorizacionAvanceComponent,
    ResumenMovimientoAlmacenComponent,
    RegistrarComprobanteComponent
  ],
  imports: [
    CommonModule,
    PreLiquidacionRoutingModule,
    SharedModule,
    AuthModule.forRoot(),
    LoadingModule.forRoot(),
    FieldsetModule,
    TabViewModule,
    // ReactiveFormsModule
  ],
  providers: [
    GestionPreliquidacionService,
    ItemComboService,
    TrabajadorService
  ],
  entryComponents: [ //para dialogos
    AgregarComprobanteComponent,
    AgregarDocumentoComponent
 ]
})
export class PreLiquidacionModule { }
