import { NgModule } from '@angular/core';

import { GestServRoutingModule } from './gest-serv-routing.module';
import { BandejaPrincipalComponent } from './components/bandeja-principal/bandeja-principal.component';
import { SharedModule } from '@shared/shared.module';
import { ConfigurarDatosComponent } from './components/configurar-datos/configurar-datos.component';
import { HistorialComponent } from './components/historial/historial.component';
import { GestServService } from './services/gest-serv.service';
import { HistorialEstadosComponent } from './components/historial-estados/historial-estados.component';
import { environment } from 'environments/environment';
import { SocketIoModule } from 'ng-socket-io';
import { AuthModule } from '@shared/auth/auth.module';

@NgModule({
  declarations: [
    BandejaPrincipalComponent,
    ConfigurarDatosComponent,
    HistorialComponent,
    HistorialEstadosComponent
  ],
  entryComponents: [
    ConfigurarDatosComponent,
    HistorialComponent,
    HistorialEstadosComponent
  ],
  imports: [
    GestServRoutingModule,
    SharedModule,
    AuthModule.forRoot(),
    SocketIoModule.forRoot({url: environment.serverWebSocket})
  ],
  providers: [
    GestServService
  ]
})
export class GestServModule { }
