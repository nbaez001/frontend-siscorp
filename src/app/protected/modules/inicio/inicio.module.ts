import { NgModule } from '@angular/core';
import { InicioRoutingModule } from './inicio-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@shared/auth/auth.module';
import { InicioComponent } from './components/inicio/inicio.component';
import { ReporteService } from '../ups/modules/gest-plataformas/services/reporte.service';
import { LoadingModule } from '@shared/loading/loading.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    SharedModule,
    AuthModule.forRoot(),
    LoadingModule.forRoot(),
    NgxChartsModule,
    InicioRoutingModule
  
  ],
  providers: [
    ReporteService
  ]
})
export class InicioModule { }
