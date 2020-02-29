import { NgModule } from '@angular/core';
import { UajRoutingModule } from './uaj-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@shared/auth/auth.module';
import { BandejaConvenioComponent } from './components/bandeja-convenio/bandeja-convenio.component';
import { CrearConvenioComponent } from './components/crear-convenio/crear-convenio.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UajService } from './services/uaj.service';
import { CrearAdendaComponent } from './components/crear-adenda/crear-adenda.component';
import { CrearPlanTrabajoComponent } from './components/crear-plan-trabajo/crear-plan-trabajo.component';
import { DetalleConvenioComponent } from './components/detalle-convenio/detalle-convenio.component';

@NgModule({
  declarations: [
    BandejaConvenioComponent,
    CrearConvenioComponent,
    CrearAdendaComponent,
    CrearPlanTrabajoComponent,
    DetalleConvenioComponent
  ],
  imports: [
    NgxSpinnerModule,
    SharedModule,
    UajRoutingModule,
    AuthModule.forRoot()
  ],
  entryComponents: [
    CrearConvenioComponent,
    DetalleConvenioComponent,
    CrearAdendaComponent,
    CrearPlanTrabajoComponent
  ],
  providers: [
    UajService,
  ]
})
export class UajModule { }
