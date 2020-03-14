import { NgModule } from '@angular/core';

import { GestPlataformasRoutingModule } from './gest-plataformas-routing.module';
import { SharedModule } from '@shared/shared.module';
import { GestionarTambosComponent } from './components/gestionar-tambos/gestionar-tambos.component';
import { GestionTambosService } from './services/gestion-tambos.service';
import { ReporteService } from './services/reporte.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PlataformaFormularioComponent } from './components/gestionar-tambos/plataforma-formulario/plataforma-formulario.component';
import { PlataformaFormularioCondicionComponent } from './components/gestionar-tambos/plataforma-formulario-condicion/plataforma-formulario-condicion.component';
import { FormularioActivacionComponent } from './components/gestionar-tambos/formulario-activacion/formulario-activacion.component';
import { ResumenTambosComponent } from './components/resumen-tambos/resumen-tambos.component';
import { ParseChartPipe } from './pipes/parse-chart.pipe';
import { JerarquiaCondicionComponent } from './components/jerarquia-condicion/jerarquia-condicion.component';
import { AuthModule } from '@shared/auth/auth.module';
import { EjecucionProyectoComponent } from './components/ejecucion-proyecto/ejecucion-proyecto.component';
import { SubestadoPlataformasComponent } from './components/subestado-plataformas/subestado-plataformas.component';
import { LoadingModule } from '@shared/loading/loading.module';

@NgModule({
  declarations: [
    GestionarTambosComponent,
    ResumenTambosComponent,
    PlataformaFormularioComponent,
    PlataformaFormularioCondicionComponent,
    FormularioActivacionComponent,
    ParseChartPipe,
    JerarquiaCondicionComponent,
    EjecucionProyectoComponent,
    SubestadoPlataformasComponent
  ],
  entryComponents: [
    PlataformaFormularioComponent,
    PlataformaFormularioCondicionComponent,
    FormularioActivacionComponent,
    JerarquiaCondicionComponent,
    SubestadoPlataformasComponent
  ],
  imports: [
    SharedModule,
    AuthModule.forRoot(),
    LoadingModule.forRoot(),
    NgxChartsModule,
    GestPlataformasRoutingModule
  ],
  providers: [
    ReporteService,
    GestionTambosService
  ]
})
export class GestPlataformasModule { }
