import { NgModule } from '@angular/core';
import { PreOperativaRoutingModule } from './pre-operativa-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@shared/auth/auth.module';
import { CargarProyectoGestionComponent } from './components/cargar-proyecto-gestion/cargar-proyecto-gestion.component';
import { CargarProyectoCRPComponent } from './components/cargar-proyecto-crp/cargar-proyecto-crp.component';
import { DatosProyectoGestionComponent } from './components/cargar-proyecto-gestion/datos-proyecto-gestion/datos-proyecto-gestion.component';
import { DatosProyectoCrpComponent } from './components/cargar-proyecto-crp/datos-proyecto-crp/datos-proyecto-crp.component';
import { FieldsetModule } from 'primeng/fieldset';
import { ProyectoService } from './services/proyecto.service';
import { TrabajadorService } from './services/trabajador.service';
import { ItemComboServicio } from './services/item-combo.service';

@NgModule({
  declarations: [
    CargarProyectoGestionComponent,
    CargarProyectoCRPComponent,
    DatosProyectoGestionComponent,
    DatosProyectoCrpComponent,
  ],
  entryComponents: [
    DatosProyectoGestionComponent,
    DatosProyectoCrpComponent,
    
  ],
  providers: [
    ProyectoService,
    TrabajadorService,
    ItemComboServicio,
  ],
  imports: [
    SharedModule,
    AuthModule.forRoot(),
    PreOperativaRoutingModule,
    FieldsetModule,
  ]
})
export class PreOperativaModule { }
