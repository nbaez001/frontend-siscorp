import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivoExpedienteRoutingModule } from './archivo-expediente-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@shared/auth/auth.module';
import { BandejaArchivoExpedienteComponent } from './components/bandeja-archivo-expediente/bandeja-archivo-expediente.component';
import { ArchivoExpedienteService } from './service/archivo-expediente.service';
import { AdjuntarArchivoExpedienteComponent } from './components/bandeja-archivo-expediente/adjuntar-archivo-expediente/adjuntar-archivo-expediente.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingModule } from '@shared/loading/loading.module';
import { TrabajadorService } from '../autorizacion-gasto/service/trabajador.service';

@NgModule({
  declarations: [
    BandejaArchivoExpedienteComponent,
    AdjuntarArchivoExpedienteComponent
  ],
  providers: [
    ArchivoExpedienteService,
    TrabajadorService
  ],
  entryComponents: [
    AdjuntarArchivoExpedienteComponent
  ],
  imports: [
    CommonModule,
    ArchivoExpedienteRoutingModule,
    SharedModule,
    AuthModule.forRoot(),
    LoadingModule.forRoot(),
    NgxSpinnerModule
  ]
})
export class ArchivoExpedienteModule { }
