import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreOperativaRoutingModule } from './pre-operativa-routing.module';
import { CargarProyectoGestionComponent } from './components/cargar-proyecto-gestion/cargar-proyecto-gestion.component';
import { CargarProyectoCRPComponent } from './components/cargar-proyecto-crp/cargar-proyecto-crp.component';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@shared/auth/auth.module';
import { LoadingModule } from '@shared/loading/loading.module';
import { FieldsetModule } from 'primeng/fieldset';
import { TrabajadorService } from '../autorizacion-gasto/service/trabajador.service';

@NgModule({
  declarations: [CargarProyectoGestionComponent, CargarProyectoCRPComponent],
  imports: [
    CommonModule,
    PreOperativaRoutingModule,
    SharedModule,
    AuthModule.forRoot(),
    LoadingModule.forRoot(),
    FieldsetModule,
  ],

  providers: [
   
    TrabajadorService,
    
  ]
})
export class PreOperativaModule { }
